#!/usr/bin/env bash
# ai-kanban 启动脚本（参考 Daily Digest 的写法）
# 用法：
#   ./start.sh           # 前台启动（Ctrl+C 退出）
#   ./start.sh -d        # 后台启动（detached）
#   ./start.sh stop      # 停止后台实例
#   ./start.sh restart   # 重启
#   ./start.sh status    # 查看状态
#   ./start.sh logs      # tail -f 日志

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PORT="${PORT:-8001}"
HOST="${HOST:-0.0.0.0}"
SERVE_DIR="${SERVE_DIR:-$SCRIPT_DIR/demo}"
LOG="$SCRIPT_DIR/server.log"
PID_FILE="$SCRIPT_DIR/.server.pid"

# 载入 .env（如果存在）
if [[ -f "$SCRIPT_DIR/.env" ]]; then
  set -a
  # shellcheck source=/dev/null
  source "$SCRIPT_DIR/.env"
  set +a
fi

_running_pid() {
  [[ -f "$PID_FILE" ]] || return 1
  local pid
  pid=$(cat "$PID_FILE" 2>/dev/null || echo "")
  [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null && { echo "$pid"; return 0; }
  rm -f "$PID_FILE"
  return 1
}

_serve_cmd() {
  # Python 内置 http.server 是单线程的，并发差。
  # 优先使用 ThreadingHTTPServer（Python 3.7+）以支持多并发。
  echo "python3 -u -c \"
import sys
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
handler = partial(SimpleHTTPRequestHandler, directory='$SERVE_DIR')
srv = ThreadingHTTPServer(('$HOST', $PORT), handler)
print(f'Serving $SERVE_DIR on http://$HOST:$PORT', flush=True)
srv.serve_forever()
\""
}

_spawn() {
  # 滚动旧日志，保留崩溃现场（最多保留 5 份）
  if [[ -f "$LOG" && -s "$LOG" ]]; then
    for i in 4 3 2 1; do
      [[ -f "$LOG.$i" ]] && mv "$LOG.$i" "$LOG.$((i+1))"
    done
    mv "$LOG" "$LOG.1"
  fi
  # 完全脱离当前 shell/session：setsid 新会话 + nohup 忽略 HUP + 标准描述符重定向
  local cmd
  cmd=$(_serve_cmd)
  setsid nohup bash -c "$cmd" > "$LOG" 2>&1 < /dev/null &
  local pid=$!
  echo "$pid" > "$PID_FILE"
  disown 2>/dev/null || true
  # 等服务 ready（最多 10 秒）
  for i in 1 2 3 4 5 6 7 8 9 10; do
    sleep 1
    if kill -0 "$pid" 2>/dev/null && ss -tlnp 2>/dev/null | grep -q ":$PORT "; then
      return 0
    fi
  done
}

cmd_start_fg() {
  echo ">>> 前台启动 ai-kanban on $HOST:$PORT (dir=$SERVE_DIR)"
  local cmd
  cmd=$(_serve_cmd)
  exec bash -c "$cmd"
}

cmd_start_bg() {
  if pid=$(_running_pid); then
    echo "⚠️  已在运行 (pid=$pid)。用 ./start.sh restart 重启。"
    exit 0
  fi
  # 检查端口占用（不是自己）
  if ss -tlnp 2>/dev/null | grep -q ":$PORT "; then
    echo "❌ 端口 $PORT 已被占用："
    ss -tlnp 2>/dev/null | grep ":$PORT "
    exit 1
  fi
  echo ">>> 后台启动 ai-kanban on $HOST:$PORT (dir=$SERVE_DIR)"
  _spawn
  if pid=$(_running_pid); then
    echo "✅ pid=$pid · log: $LOG"
    sleep 1
    tail -n 10 "$LOG" 2>/dev/null || true
  else
    echo "❌ 启动失败，请查看日志：$LOG"
    tail -n 30 "$LOG" 2>/dev/null || true
    exit 1
  fi
}

cmd_stop() {
  if pid=$(_running_pid); then
    echo ">>> 停止 pid=$pid"
    kill "$pid" 2>/dev/null || true
    sleep 2
    kill -0 "$pid" 2>/dev/null && kill -9 "$pid" 2>/dev/null || true
    rm -f "$PID_FILE"
    # 清理孤儿进程（精确匹配 SERVE_DIR，避免误杀其他 http.server）
    pkill -9 -f "directory='$SERVE_DIR'" 2>/dev/null || true
    echo "✅ 已停止"
  else
    if pgrep -f "directory='$SERVE_DIR'" >/dev/null; then
      pkill -9 -f "directory='$SERVE_DIR'" 2>/dev/null || true
      echo "✅ 已清理孤儿进程"
    else
      echo "未在运行"
    fi
  fi
}

cmd_status() {
  if pid=$(_running_pid); then
    echo "✅ 运行中 (pid=$pid)"
    ss -tlnp 2>/dev/null | grep ":$PORT " || netstat -tlnp 2>/dev/null | grep ":$PORT " || true
    curl -sS -o /dev/null -w "   health: HTTP %{http_code}\n" --max-time 3 "http://127.0.0.1:$PORT/" 2>&1 || true
  else
    echo "❌ 未运行"
  fi
}

cmd_logs() {
  [[ -f "$LOG" ]] || { echo "没有日志文件: $LOG"; exit 1; }
  tail -n 100 -f "$LOG"
}

case "${1:-}" in
  ""|start)         cmd_start_fg ;;
  -d|--detach|bg)   cmd_start_bg ;;
  stop)             cmd_stop ;;
  restart)          cmd_stop; cmd_start_bg ;;
  status)           cmd_status ;;
  logs|log)         cmd_logs ;;
  *)
    cat <<EOF
Usage: $0 [command]

Commands:
  (no arg) | start   前台启动
  -d       | bg      后台启动（独立进程）
  stop               停止后台实例
  restart            重启（= stop + bg）
  status             查看运行状态
  logs               tail -f 日志

环境变量（可在 .env 中配置）：
  PORT=8001                          监听端口
  HOST=0.0.0.0                       监听地址
  SERVE_DIR=$SCRIPT_DIR/demo         静态文件目录
EOF
    exit 1
    ;;
esac
