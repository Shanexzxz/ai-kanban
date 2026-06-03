// L2 Agent 专项分析（IC Memo Agent · 完整数据看板）

function initL2Charts() {
  // ② 解析失败 + 生成失败趋势
  initMemoParseFail();
  initMemoGenTrend();
  // ③ 编辑率分布 + 章节编辑率
  initMemoEditDist();
  initMemoSectionEditDual();
  // ⑤ 满意度信号
  initMemoSatisfaction();
  // ⑦ 节省趋势 + 节省时长
  initMemoSavingTrend();
  initMemoSavingDist();
  // ⑧ 类型 / 复用 / 提交时段
  initMemoTypeChart();
  initMemoReuseChart();
  initMemoSubmitTime();
  // ⑨ 上下文利用率
  initMemoContextUsage();
  // 表格渲染
  renderMemoQualityTable();
  renderMemoTopAuthors();
}

// ========== ② 解析失败 Top 5 ==========
function initMemoParseFail() {
  const __el = document.getElementById('chart-memo-parse-fail');
  if (!__el) return;
  const chart = echarts.init(__el);
  const ax = getChartAxisStyle();
  const data = IC_MEMO.parseFailTop.slice().sort(function(a, b){ return a.value - b.value; });
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' } }, COMMON_TOOLTIP),
    grid: { left: 150, right: 50, top: 10, bottom: 30 },
    xAxis: Object.assign({ type: 'value', axisLabel: { fontSize: 11, color: '#334155', fontWeight: 500 } }, ax),
    yAxis: { type: 'category', data: data.map(function(d){ return d.name; }),
      axisLabel: { fontSize: 12, color: '#1e293b', fontWeight: 500 }, axisLine: ax.axisLine, splitLine: { show: false } },
    series: [{
      type: 'bar',
      data: data.map(function(d){
        return { value: d.value, itemStyle: { color: '#4f6ef7', borderRadius: [0, 4, 4, 0] } };
      }),
      barWidth: 16,
      label: { show: true, position: 'right', fontSize: 12, color: '#334155', fontWeight: 600 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// ========== ② 生成失败趋势 ==========
function initMemoGenTrend() {
  const __el = document.getElementById('chart-memo-gen-trend');
  if (!__el) return;
  const chart = echarts.init(__el);
  const ax = getChartAxisStyle();
  const totals = IC_MEMO.genTrend.map(function(d){ return d.total; });
  const fails  = IC_MEMO.genTrend.map(function(d){ return d.fail; });
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis' }, COMMON_TOOLTIP),
    legend: Object.assign({ top: 0 }, getChartLegendStyle()),
    grid: { left: 50, right: 30, top: 30, bottom: 30 },
    xAxis: Object.assign({ type: 'category', data: DATES_30.map(function(d){ return d.slice(5); }),
      axisLabel: { fontSize: 10, interval: 4, color: '#334155', fontWeight: 500 } }, ax),
    yAxis: Object.assign({ type: 'value' }, ax),
    series: [
      { name: '总生成', type: 'line', smooth: true, data: totals,
        lineStyle: { color: '#4f6ef7', width: 2 }, itemStyle: { color: '#4f6ef7' }, symbol: 'none',
        areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(79,110,247,0.2)'},{offset:1,color:'rgba(79,110,247,0.02)'}]) } },
      { name: '失败', type: 'bar', data: fails, itemStyle: { color: '#ef4444', borderRadius: [3, 3, 0, 0] }, barWidth: 6 }
    ]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// ========== ③ 编辑率分布（堆叠条） ==========
function initMemoEditDist() {
  const __el = document.getElementById('chart-memo-edit-dist');
  if (!__el) return;
  const chart = echarts.init(__el);
  const ax = getChartAxisStyle();
  const buckets = ['未编辑', '<10%', '10-30%', '30-50%', '>50%'];
  const colors = ['#cbd5e1', '#a5b4fc', '#818cf8', '#4f6ef7', '#3730a3'];
  const series = buckets.map(function(name, i){
    return {
      name: name, type: 'bar', stack: 'total',
      data: IC_MEMO.editDistByChapter.map(function(d){ return d.buckets[i]; }),
      itemStyle: { color: colors[i] },
      barWidth: 28
    };
  });
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' } }, COMMON_TOOLTIP),
    legend: Object.assign({ top: 0 }, getChartLegendStyle()),
    grid: { left: 50, right: 30, top: 35, bottom: 30 },
    xAxis: Object.assign({ type: 'category', data: IC_MEMO.editDistByChapter.map(function(d){ return d.chapter; }),
      axisLabel: { fontSize: 11, color: '#334155', fontWeight: 500 } }, ax),
    yAxis: Object.assign({ type: 'value' }, ax),
    series: series
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// ========== ③ 章节编辑率（手动 vs 对话） ==========
function initMemoSectionEditDual() {
  const __el = document.getElementById('chart-memo-section-edit-dual');
  if (!__el) return;
  const chart = echarts.init(__el);
  const ax = getChartAxisStyle();
  const data = IC_MEMO.sectionEditDual;
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: function(v){ return v + '%'; } }, COMMON_TOOLTIP),
    legend: Object.assign({ top: 0, data: ['手动编辑', '对话调整'] }, getChartLegendStyle()),
    grid: { left: 100, right: 50, top: 35, bottom: 30 },
    xAxis: Object.assign({ type: 'value', max: 50, axisLabel: { formatter: '{value}%', fontSize: 11, color: '#334155', fontWeight: 500 } }, ax),
    yAxis: { type: 'category', data: data.map(function(d){ return d.name; }).reverse(),
      axisLabel: { fontSize: 12, color: '#1e293b', fontWeight: 500 }, axisLine: ax.axisLine, splitLine: { show: false } },
    series: [
      { name: '手动编辑', type: 'bar', data: data.map(function(d){ return d.manual; }).reverse(),
        itemStyle: { color: '#4f6ef7' }, barWidth: 10 },
      { name: '对话调整', type: 'bar', data: data.map(function(d){ return d.chat; }).reverse(),
        itemStyle: { color: '#fb923c' }, barWidth: 10 }
    ]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// ========== ④ 章节质量统计表格 ==========
function renderMemoQualityTable() {
  const tbody = document.getElementById('memo-quality-tbody');
  if (!tbody) return;
  tbody.innerHTML = IC_MEMO.qualityTable.map(function(r) {
    var statusBadge = r.status === 'good'
      ? '<span style="padding:2px 8px;background:rgba(16,185,129,0.12);color:var(--success);border-radius:10px;font-size:11px;font-weight:600;">优质</span>'
      : '<span style="padding:2px 8px;background:rgba(245,158,11,0.12);color:var(--warning);border-radius:10px;font-size:11px;font-weight:600;">关注</span>';
    return '<tr>' +
      '<td><strong>' + r.chapter + '</strong></td>' +
      '<td style="text-align:right;">' + r.count.toLocaleString() + '</td>' +
      '<td style="text-align:right;">' + r.manualEdit + '%</td>' +
      '<td style="text-align:right;">' + r.chatEdit + '%</td>' +
      '<td style="text-align:right;font-weight:600;">' + r.totalEdit + '%</td>' +
      '<td style="text-align:right;font-weight:600;color:' + (r.score >= 4.0 ? 'var(--success)' : 'var(--warning)') + ';">' + r.score.toFixed(1) + '</td>' +
      '<td style="text-align:center;">' + statusBadge + '</td>' +
    '</tr>';
  }).join('');
}

// ========== ⑤ 满意度信号 ==========
function initMemoSatisfaction() {
  const __el = document.getElementById('chart-memo-satisfaction');
  if (!__el) return;
  const chart = echarts.init(__el);
  const ax = getChartAxisStyle();
  const data = IC_MEMO.satisfaction.slice().sort(function(a, b){ return a.value - b.value; });
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: function(v){ return v + '%'; } }, COMMON_TOOLTIP),
    grid: { left: 170, right: 60, top: 10, bottom: 30 },
    xAxis: Object.assign({ type: 'value', max: 100, axisLabel: { formatter: '{value}%', fontSize: 11, color: '#334155', fontWeight: 500 } }, ax),
    yAxis: { type: 'category', data: data.map(function(d){ return d.name; }),
      axisLabel: { fontSize: 11, color: '#1e293b', fontWeight: 500 }, axisLine: ax.axisLine, splitLine: { show: false } },
    series: [{
      type: 'bar',
      data: data.map(function(d){
        return { value: d.value, itemStyle: {
          color: new echarts.graphic.LinearGradient(0,0,1,0,[{offset:0,color:'#10b981'},{offset:1,color:'#34d399'}]),
          borderRadius: [0, 4, 4, 0]
        }};
      }),
      barWidth: 16,
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 12, color: '#334155', fontWeight: 600 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// ========== ⑦ 节省趋势 ==========
function initMemoSavingTrend() {
  const __el = document.getElementById('chart-memo-saving-trend');
  if (!__el) return;
  const chart = echarts.init(__el);
  const ax = getChartAxisStyle();
  const months = ['25/07','25/08','25/09','25/10','25/11','25/12','26/01','26/02','26/03','26/04','26/05','26/06'];
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', valueFormatter: function(v){ return v + ' h'; } }, COMMON_TOOLTIP),
    grid: { left: 50, right: 30, top: 20, bottom: 30 },
    xAxis: Object.assign({ type: 'category', data: months, axisLabel: { fontSize: 10, color: '#334155', fontWeight: 500 } }, ax),
    yAxis: Object.assign({ type: 'value' }, ax),
    series: [{
      type: 'line', data: IC_MEMO.savingTrend, smooth: true,
      lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' }, symbol: 'circle', symbolSize: 5,
      areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(16,185,129,0.3)'},{offset:1,color:'rgba(16,185,129,0.02)'}]) },
      label: { show: true, position: 'top', fontSize: 10, color: '#334155' }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// ========== ⑦ 节省时长分布 ==========
function initMemoSavingDist() {
  const __el = document.getElementById('chart-memo-saving-dist');
  if (!__el) return;
  const chart = echarts.init(__el);
  const ax = getChartAxisStyle();
  const colors = ['#cbd5e1', '#a5b4fc', '#818cf8', '#4f6ef7', '#3730a3'];
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' } }, COMMON_TOOLTIP),
    grid: { left: 50, right: 30, top: 20, bottom: 40 },
    xAxis: Object.assign({ type: 'category', data: IC_MEMO.savingDist.map(function(d){ return d.name; }),
      axisLabel: { fontSize: 11, color: '#334155', fontWeight: 500, interval: 0 } }, ax),
    yAxis: Object.assign({ type: 'value' }, ax),
    series: [{
      type: 'bar',
      data: IC_MEMO.savingDist.map(function(d, i){ return { value: d.value, itemStyle: { color: colors[i], borderRadius: [4, 4, 0, 0] } }; }),
      barWidth: 36,
      label: { show: true, position: 'top', fontSize: 11, color: '#334155', fontWeight: 600 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// ========== ⑧ Memo 类型分布（饼） ==========
function initMemoTypeChart() {
  const __el = document.getElementById('chart-memo-type');
  if (!__el) return;
  const chart = echarts.init(__el);
  const colors = ['#4f6ef7', '#10b981', '#f59e0b', '#94a3b8'];
  chart.setOption({
    tooltip: Object.assign({ trigger: 'item' }, COMMON_TOOLTIP),
    legend: Object.assign({ bottom: 0 }, getChartLegendStyle()),
    series: [{
      type: 'pie', radius: ['45%', '70%'], center: ['50%', '45%'],
      data: IC_MEMO.byType.map(function(d, i){
        return Object.assign({}, d, { itemStyle: { color: colors[i] } });
      }),
      label: { formatter: '{b}\n{d}%', fontSize: 11, color: '#334155' }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// ========== ⑧ 复用率（饼） ==========
function initMemoReuseChart() {
  const __el = document.getElementById('chart-memo-reuse');
  if (!__el) return;
  const chart = echarts.init(__el);
  const colors = ['#10b981', '#f59e0b', '#ef4444'];
  chart.setOption({
    tooltip: Object.assign({ trigger: 'item' }, COMMON_TOOLTIP),
    legend: Object.assign({ bottom: 0 }, getChartLegendStyle()),
    series: [{
      type: 'pie', radius: ['45%', '70%'], center: ['50%', '45%'],
      data: IC_MEMO.reuse.map(function(d, i){
        return Object.assign({}, d, { itemStyle: { color: colors[i] } });
      }),
      label: { formatter: '{b}\n{d}%', fontSize: 11, color: '#334155' }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// ========== ⑧ 提交时段（24h） ==========
function initMemoSubmitTime() {
  const __el = document.getElementById('chart-memo-submit-time');
  if (!__el) return;
  const chart = echarts.init(__el);
  const ax = getChartAxisStyle();
  const hours = Array.from({length:24}, function(_, i){ return i + 'h'; });
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: function(v){ return v + ' 次'; } }, COMMON_TOOLTIP),
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: Object.assign({ type: 'category', data: hours, axisLabel: { fontSize: 10, interval: 2, color: '#334155', fontWeight: 500 } }, ax),
    yAxis: Object.assign({ type: 'value' }, ax),
    series: [{
      type: 'bar', data: IC_MEMO.submitTime,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#4f6ef7'},{offset:1,color:'#a5b4fc'}]),
        borderRadius: [3, 3, 0, 0]
      },
      barWidth: '70%'
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// ========== ⑨ 上下文利用率 ==========
function initMemoContextUsage() {
  const __el = document.getElementById('chart-memo-context-usage');
  if (!__el) return;
  const chart = echarts.init(__el);
  const ax = getChartAxisStyle();
  const colors = ['#ef4444', '#f59e0b', '#a5b4fc', '#4f6ef7', '#10b981'];
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: function(v){ return v + '%'; } }, COMMON_TOOLTIP),
    grid: { left: 50, right: 30, top: 20, bottom: 40 },
    xAxis: Object.assign({ type: 'category', data: IC_MEMO.contextUsage.map(function(d){ return d.name; }),
      axisLabel: { fontSize: 11, color: '#334155', fontWeight: 500, interval: 0 } }, ax),
    yAxis: Object.assign({ type: 'value', axisLabel: { formatter: '{value}%' } }, ax),
    series: [{
      type: 'bar',
      data: IC_MEMO.contextUsage.map(function(d, i){ return { value: d.value, itemStyle: { color: colors[i], borderRadius: [4, 4, 0, 0] } }; }),
      barWidth: 36,
      label: { show: true, position: 'top', formatter: '{c}%', fontSize: 11, color: '#334155', fontWeight: 600 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// ========== ⑨ Top 高产作者表格 ==========
function renderMemoTopAuthors() {
  const tbody = document.getElementById('memo-top-authors-tbody');
  if (!tbody) return;
  tbody.innerHTML = IC_MEMO.topAuthors.map(function(r) {
    return '<tr>' +
      '<td class="user-name">' + r.name + '</td>' +
      '<td class="user-group">' + r.dept + '</td>' +
      '<td style="text-align:right;font-weight:600;">' + r.count + '</td>' +
      '<td style="text-align:right;color:var(--success);">' + r.downloadRate + '%</td>' +
      '<td style="text-align:right;">' + r.editRate + '%</td>' +
    '</tr>';
  }).join('');
}

// 输入形态拆分（纯文本/含附件/含 URL/含信息库引用）
function initInputFormDist() {
  const __el = document.getElementById('chart-input-form');
  if (!__el) return;
  const chart = echarts.init(__el);
  const axisStyle = getChartAxisStyle();
  const data = [
    { name: '纯文本', value: 58 },
    { name: '含附件', value: 22 },
    { name: '含 URL', value: 12 },
    { name: '含信息库引用', value: 8 }
  ];
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: function(v){ return v + '%'; } }, COMMON_TOOLTIP),
    grid: { left: 110, right: 50, top: 20, bottom: 30 },
    xAxis: Object.assign({ type: 'value', max: 70, axisLabel: { formatter: '{value}%', fontSize: 11, color: '#334155', fontWeight: 500 } }, axisStyle),
    yAxis: {
      type: 'category',
      data: data.map(function(d){ return d.name; }).reverse(),
      axisLabel: { fontSize: 12, color: '#1e293b', fontWeight: 500 },
      axisLine: axisStyle.axisLine,
      splitLine: { show: false }
    },
    series: [{
      type: 'bar',
      data: data.map(function(d){ return d.value; }).reverse(),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0,0,1,0,[
          {offset:0,color:'#f59e0b'},{offset:1,color:'#fbbf24'}
        ]),
        borderRadius: [0, 4, 4, 0]
      },
      barWidth: 22,
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 12, color: '#334155', fontWeight: 600 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initChatModelDist() {
  const __el_chart_chat_model = document.getElementById('chart-chat-model');
  if (!__el_chart_chat_model) return;
  const chart = echarts.init(__el_chart_chat_model);
  const legendStyle = getChartLegendStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'item' }, COMMON_TOOLTIP),
    legend: Object.assign({ bottom: 0 }, legendStyle),
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '42%'],
      data: [
        { value: 38, name: 'DeepSeek-V3.5', itemStyle: { color: '#4f6ef7' } },
        { value: 25, name: '混元 Turbo', itemStyle: { color: '#10b981' } },
        { value: 22, name: 'GLM-4.6', itemStyle: { color: '#f59e0b' } },
        { value: 15, name: 'Kimi K2', itemStyle: { color: '#8b5cf6' } }
      ],
      label: { formatter: '{b}\n{d}%', fontSize: 12 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initChatRoundDist() {
  const __el_chart_chat_rounds = document.getElementById('chart-chat-rounds');
  if (!__el_chart_chat_rounds) return;
  const chart = echarts.init(__el_chart_chat_rounds);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis' }, COMMON_TOOLTIP),
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: Object.assign({ type: 'category', data: CHAT_ROUND_DIST.map(function(d) { return d.range; }) }, axisStyle),
    yAxis: Object.assign({ type: 'value', axisLabel: { formatter: '{value}%' } }, axisStyle),
    series: [{
      type: 'bar',
      data: CHAT_ROUND_DIST.map(function(d) { return d.value; }),
      itemStyle: {
        color: function(params) { return ['#4f6ef7', '#818cf8', '#c7d2fe'][params.dataIndex]; },
        borderRadius: [6, 6, 0, 0]
      },
      barWidth: 48,
      label: { show: true, position: 'top', formatter: '{c}%', fontSize: 11, color: '#64748b' }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initTimeHeatmap() {
  const __el_chart_time_heatmap = document.getElementById('chart-time-heatmap');
  if (!__el_chart_time_heatmap) return;
  const chart = echarts.init(__el_chart_time_heatmap);
  const axisStyle = getChartAxisStyle();
  const hours = Array.from({ length: 24 }, function(_, i) { return i + ':00'; });
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  chart.setOption({
    tooltip: Object.assign({
      formatter: function(p) { return days[p.value[1]] + ' ' + hours[p.value[0]] + '<br/>调用次数: ' + p.value[2]; }
    }, COMMON_TOOLTIP),
    grid: { left: 50, right: 60, top: 10, bottom: 30 },
    xAxis: {
      type: 'category',
      data: hours,
      axisLabel: { fontSize: 9, interval: 2, color: axisStyle.axisLabel.color },
      splitArea: { show: true }
    },
    yAxis: {
      type: 'category',
      data: days,
      axisLabel: { fontSize: 11, color: axisStyle.axisLabel.color }
    },
    visualMap: {
      min: 0, max: 100, calculable: true, orient: 'vertical', right: 0, top: 'center',
      inRange: { color: ['#f8fafc', '#c7d2fe', '#818cf8', '#4f6ef7', '#3730a3'] },
      textStyle: { fontSize: 10, color: axisStyle.axisLabel.color }
    },
    series: [{
      type: 'heatmap',
      data: TIME_HEATMAP,
      label: { show: false },
      itemStyle: { borderColor: '#fff', borderWidth: 1, borderRadius: 2 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initDeepseekTrend() {
  const __el_chart_deepseek_trend = document.getElementById('chart-deepseek-trend');
  if (!__el_chart_deepseek_trend) return;
  const chart = echarts.init(__el_chart_deepseek_trend);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis' }, COMMON_TOOLTIP),
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: Object.assign({
      type: 'category',
      data: DATES_30.map(function(d) { return d.slice(5); }),
      axisLabel: { fontSize: 10, interval: 4, color: '#334155', fontWeight: 500 }
    }, axisStyle),
    yAxis: Object.assign({ type: 'value' }, axisStyle),
    series: [{
      type: 'line',
      data: DEEPSEEK_DAILY_FILES,
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(16,185,129,0.3)' },
          { offset: 1, color: 'rgba(16,185,129,0.02)' }
        ])
      },
      lineStyle: { color: '#10b981', width: 2 },
      itemStyle: { color: '#10b981' },
      symbol: 'none'
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// Changed from pie to horizontal bar chart
function initDeepseekFileTypes() {
  const __el_chart_deepseek_files = document.getElementById('chart-deepseek-files');
  if (!__el_chart_deepseek_files) return;
  const chart = echarts.init(__el_chart_deepseek_files);
  const axisStyle = getChartAxisStyle();
  const colors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function(p) { return p[0].name + ': ' + p[0].value + '%'; } }, COMMON_TOOLTIP),
    grid: { left: 70, right: 40, top: 20, bottom: 20 },
    xAxis: Object.assign({ type: 'value', max: 55, axisLabel: { formatter: '{value}%' } }, axisStyle),
    yAxis: {
      type: 'category',
      data: DEEPSEEK_FILE_TYPES.map(function(d) { return d.name; }).reverse(),
      axisLabel: { fontSize: 12, color: '#334155', fontWeight: 500 },
      axisLine: axisStyle.axisLine,
      splitLine: { show: false }
    },
    series: [{
      type: 'bar',
      data: DEEPSEEK_FILE_TYPES.map(function(d, i) {
        return {
          value: d.value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: colors[colors.length - 1 - i] },
              { offset: 1, color: colors[colors.length - 1 - i].replace('d1fae5', 'a7f3d0').replace('a7f3d0', '6ee7b7').replace('6ee7b7', '34d399').replace('34d399', '10b981') }
            ]),
            borderRadius: [0, 4, 4, 0]
          }
        };
      }).reverse(),
      barWidth: 20,
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 11, color: '#64748b' }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initDeepseekSatisfaction() {
  const __el = document.getElementById('chart-deepseek-satisfaction');
  if (!__el) return;
  const chart = echarts.init(__el);
  const axisStyle = getChartAxisStyle();
  const data = [
    { name: 'DeepSeek-V3.5', value: 82 },
    { name: 'GLM-4.6', value: 79 },
    { name: '混元 Turbo', value: 76 },
    { name: 'Kimi K2', value: 73 }
  ];
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' } }, COMMON_TOOLTIP),
    grid: { left: 110, right: 50, top: 20, bottom: 30 },
    xAxis: Object.assign({ type: 'value', max: 100, axisLabel: { formatter: '{value}%', fontSize: 11, color: '#334155', fontWeight: 500 } }, axisStyle),
    yAxis: {
      type: 'category',
      data: data.map(function(d){ return d.name; }).reverse(),
      axisLabel: { fontSize: 12, color: '#1e293b', fontWeight: 500 },
      axisLine: axisStyle.axisLine,
      splitLine: { show: false }
    },
    series: [{
      type: 'bar',
      data: data.map(function(d){ return d.value; }).reverse(),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0,0,1,0,[
          {offset:0,color:'#4f6ef7'},{offset:1,color:'#818cf8'}
        ]),
        borderRadius: [0, 4, 4, 0]
      },
      barWidth: 22,
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 12, color: '#334155', fontWeight: 600 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initMemoEditBehavior() {
  const __el_chart_memo_edit = document.getElementById('chart-memo-edit');
  if (!__el_chart_memo_edit) return;
  const chart = echarts.init(__el_chart_memo_edit);
  const legendStyle = getChartLegendStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'item' }, COMMON_TOOLTIP),
    legend: Object.assign({ bottom: 0 }, legendStyle),
    series: [{
      type: 'pie',
      radius: ['38%', '62%'],
      center: ['50%', '42%'],
      data: IC_MEMO_LEGACY.editBehavior.map(function(d, i) {
        return Object.assign({}, d, { itemStyle: { color: ['#f59e0b', '#fbbf24', '#fde68a'][i] } });
      }),
      label: { formatter: '{b}\n{d}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initMemoSectionEdit() {
  const __el_chart_memo_sections = document.getElementById('chart-memo-sections');
  if (!__el_chart_memo_sections) return;
  const chart = echarts.init(__el_chart_memo_sections);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis' }, COMMON_TOOLTIP),
    grid: { left: 80, right: 30, top: 20, bottom: 30 },
    xAxis: Object.assign({ type: 'value', max: 100, axisLabel: { formatter: '{value}%' } }, axisStyle),
    yAxis: {
      type: 'category',
      data: IC_MEMO_LEGACY.sectionEditRate.map(function(d) { return d.section; }).reverse(),
      axisLabel: { fontSize: 11, color: '#334155', fontWeight: 500 },
      axisLine: axisStyle.axisLine,
      splitLine: { show: false }
    },
    series: [{
      type: 'bar',
      data: IC_MEMO_LEGACY.sectionEditRate.map(function(d) { return d.rate; }).reverse(),
      itemStyle: {
        color: function(params) {
          var rate = params.value;
          if (rate >= 60) return '#ef4444';
          if (rate >= 45) return '#f59e0b';
          return '#10b981';
        },
        borderRadius: [0, 4, 4, 0]
      },
      barWidth: 16,
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 11, color: '#64748b' }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initUserMigration() {
  const __el_chart_migration = document.getElementById('chart-migration');
  if (!__el_chart_migration) return;
  const chart = echarts.init(__el_chart_migration);
  chart.setOption({
    tooltip: Object.assign({ trigger: 'item' }, COMMON_TOOLTIP),
    series: [{
      type: 'sankey',
      layout: 'none',
      emphasis: { focus: 'adjacency' },
      data: [
        { name: '上月高频' }, { name: '上月中频' }, { name: '上月低频' }, { name: '上月沉默' },
        { name: '本月高频' }, { name: '本月中频' }, { name: '本月低频' }, { name: '本月沉默' }
      ],
      links: USER_SEGMENTS.migration,
      lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.4 },
      itemStyle: {
        color: function(params) {
          var colors = {
            '上月高频': '#4f6ef7', '上月中频': '#818cf8', '上月低频': '#c7d2fe', '上月沉默': '#e2e8f0',
            '本月高频': '#4f6ef7', '本月中频': '#818cf8', '本月低频': '#c7d2fe', '本月沉默': '#e2e8f0'
          };
          return colors[params.name] || '#999';
        }
      },
      label: { fontSize: 11 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initActivationFunnel() {
  const __el_chart_funnel = document.getElementById('chart-funnel');
  if (!__el_chart_funnel) return;
  const chart = echarts.init(__el_chart_funnel);
  chart.setOption({
    tooltip: Object.assign({ trigger: 'item', formatter: '{b}: {c}人' }, COMMON_TOOLTIP),
    series: [{
      type: 'funnel',
      left: '10%',
      width: '80%',
      top: 10,
      bottom: 10,
      min: 0,
      max: 100,
      sort: 'descending',
      gap: 4,
      label: { show: true, position: 'inside', formatter: '{b}\n{c}人', fontSize: 12 },
      itemStyle: { borderColor: '#fff', borderWidth: 2 },
      data: USER_SEGMENTS.funnel.map(function(d, i) {
        return {
          value: d.count,
          name: d.stage,
          itemStyle: { color: ['#4f6ef7', '#6366f1', '#818cf8', '#a5b4fc'][i] }
        };
      })
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// ==================== v2 NEW CHARTS ====================

function initFormFieldRate() {
  const __el_chart_form_field_rate = document.getElementById('chart-form-field-rate');
  if (!__el_chart_form_field_rate) return;
  const chart = echarts.init(__el_chart_form_field_rate);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', formatter: function(p) { return p[0].name + ': ' + p[0].value + '%'; } }, COMMON_TOOLTIP),
    grid: { left: 130, right: 30, top: 20, bottom: 30 },
    xAxis: Object.assign({ type: 'value', max: 100, axisLabel: { formatter: '{value}%' } }, axisStyle),
    yAxis: {
      type: 'category',
      data: SKILL_FIELD_FILL_RATE.map(function(d) { return d.field; }).reverse(),
      axisLabel: { fontSize: 11, color: '#334155', fontWeight: 500 },
      axisLine: axisStyle.axisLine,
      splitLine: { show: false }
    },
    series: [{
      type: 'bar',
      data: SKILL_FIELD_FILL_RATE.map(function(d) { return d.rate; }).reverse(),
      itemStyle: {
        color: function(params) {
          var v = params.value;
          if (v >= 80) return '#10b981';
          if (v >= 60) return '#4f6ef7';
          if (v >= 40) return '#f59e0b';
          return '#ef4444';
        },
        borderRadius: [0, 4, 4, 0]
      },
      barWidth: 18,
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 11, color: '#64748b' }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initArtifactType() {
  const __el = document.getElementById('chart-artifact-type');
  if (!__el) return;
  const chart = echarts.init(__el);
  const axisStyle = getChartAxisStyle();
  // 颜色按文件类型语义匹配（md=蓝/pdf=红/docx=蓝灰/xlsx=绿/pptx=橙）
  const colorMap = {
    'Markdown (.md)':  '#4f6ef7',
    'PDF (.pdf)':      '#ef4444',
    'Word (.docx)':    '#1e40af',
    'Excel (.xlsx)':   '#10b981',
    'PPT (.pptx)':     '#f59e0b',
    '其他':            '#94a3b8'
  };
  const sorted = ARTIFACT.byType.slice().sort(function(a, b){ return a.value - b.value; });
  const total = sorted.reduce(function(s, d){ return s + d.value; }, 0);
  chart.setOption({
    tooltip: Object.assign({
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function(p){
        var item = p[0];
        var pct = ((item.value / total) * 100).toFixed(1);
        return item.name + '<br/>' + item.value + ' 个 · ' + pct + '%';
      }
    }, COMMON_TOOLTIP),
    grid: { left: 130, right: 50, top: 10, bottom: 30 },
    xAxis: Object.assign({ type: 'value', axisLabel: { fontSize: 11, color: '#334155', fontWeight: 500 } }, axisStyle),
    yAxis: {
      type: 'category',
      data: sorted.map(function(d){ return d.name; }),
      axisLabel: { fontSize: 12, color: '#1e293b', fontWeight: 500 },
      axisLine: axisStyle.axisLine,
      splitLine: { show: false }
    },
    series: [{
      type: 'bar',
      data: sorted.map(function(d){
        return { value: d.value, itemStyle: { color: colorMap[d.name] || '#94a3b8', borderRadius: [0, 4, 4, 0] } };
      }),
      barWidth: 18,
      label: { show: true, position: 'right', fontSize: 12, color: '#334155', fontWeight: 600 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initKbSaveTrend() {
  const __el_chart_kb_save_trend = document.getElementById('chart-kb-save-trend');
  if (!__el_chart_kb_save_trend) return;
  const chart = echarts.init(__el_chart_kb_save_trend);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', formatter: function(p) { return p[0].axisValue + '<br/>存入信息库率: ' + p[0].value + '%'; } }, COMMON_TOOLTIP),
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: Object.assign({
      type: 'category',
      data: DATES_30.map(function(d) { return d.slice(5); }),
      axisLabel: { fontSize: 10, interval: 4, color: '#334155', fontWeight: 500 }
    }, axisStyle),
    yAxis: Object.assign({ type: 'value', min: 30, max: 70, axisLabel: { formatter: '{value}%' } }, axisStyle),
    series: [{
      type: 'line',
      data: ARTIFACT.kbSaveTrend,
      smooth: true,
      symbol: 'none',
      lineStyle: { color: '#10b981', width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(16,185,129,0.3)' },
          { offset: 1, color: 'rgba(16,185,129,0.02)' }
        ])
      }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initWelcomeCard() {
  const __el_chart_welcome_card = document.getElementById('chart-welcome-card');
  if (!__el_chart_welcome_card) return;
  const chart = echarts.init(__el_chart_welcome_card);
  const axisStyle = getChartAxisStyle();
  const data = ENTRY_DISCOVERY.welcomeCardConversion;
  const legendStyle = getChartLegendStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' } }, COMMON_TOOLTIP),
    legend: Object.assign({ data: ['点击数', '完成任务数'], top: 0 }, legendStyle),
    grid: { left: 100, right: 60, top: 30, bottom: 20 },
    xAxis: Object.assign({ type: 'value' }, axisStyle),
    yAxis: {
      type: 'category',
      data: data.map(function(d) { return d.card; }),
      axisLabel: { fontSize: 11, color: '#334155', fontWeight: 500 },
      axisLine: axisStyle.axisLine,
      splitLine: { show: false }
    },
    series: [
      {
        name: '点击数', type: 'bar',
        data: data.map(function(d) { return d.clicks; }),
        itemStyle: { color: '#c7d2fe', borderRadius: [0, 4, 4, 0] },
        barWidth: 14, barGap: '20%'
      },
      {
        name: '完成任务数', type: 'bar',
        data: data.map(function(d) { return d.completedTasks; }),
        itemStyle: { color: '#4f6ef7', borderRadius: [0, 4, 4, 0] },
        barWidth: 14,
        label: {
          show: true, position: 'right', fontSize: 11, color: '#64748b',
          formatter: function(p) {
            var item = data[p.dataIndex];
            return item.completedTasks + ' (' + item.rate + '%)';
          }
        }
      }
    ]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initSidebarNav() {
  const __el_chart_sidebar_nav = document.getElementById('chart-sidebar-nav');
  if (!__el_chart_sidebar_nav) return;
  const chart = echarts.init(__el_chart_sidebar_nav);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' } }, COMMON_TOOLTIP),
    grid: { left: 90, right: 50, top: 20, bottom: 20 },
    xAxis: Object.assign({ type: 'value' }, axisStyle),
    yAxis: {
      type: 'category',
      data: ENTRY_DISCOVERY.sidebarNavPV.map(function(d) { return d.name; }).reverse(),
      axisLabel: { fontSize: 11, color: '#334155', fontWeight: 500 },
      axisLine: axisStyle.axisLine,
      splitLine: { show: false }
    },
    series: [{
      type: 'bar',
      data: ENTRY_DISCOVERY.sidebarNavPV.map(function(d) { return d.value; }).reverse(),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#4f6ef7' },
          { offset: 1, color: '#818cf8' }
        ]),
        borderRadius: [0, 4, 4, 0]
      },
      barWidth: 18,
      label: { show: true, position: 'right', fontSize: 11, color: '#64748b' }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initSearchTarget() {
  const __el_chart_search_target = document.getElementById('chart-search-target');
  if (!__el_chart_search_target) return;
  const chart = echarts.init(__el_chart_search_target);
  chart.setOption({
    tooltip: Object.assign({ trigger: 'item', formatter: '{b}: {c}%' }, COMMON_TOOLTIP),
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '50%'],
      data: ENTRY_DISCOVERY.globalSearch.targetSplit.map(function(d, i) {
        return Object.assign({}, d, { itemStyle: { color: ['#4f6ef7', '#10b981'][i] } });
      }),
      label: { formatter: '{b}\n{d}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initMemoryDist() {
  const __el_chart_memory_dist = document.getElementById('chart-memory-dist');
  if (!__el_chart_memory_dist) return;
  const chart = echarts.init(__el_chart_memory_dist);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', formatter: function(p) { return p[0].name + ': ' + p[0].value + '% 用户'; } }, COMMON_TOOLTIP),
    grid: { left: 30, right: 10, top: 12, bottom: 22 },
    xAxis: Object.assign({
      type: 'category',
      data: ENTRY_DISCOVERY.memory.distribution.map(function(d) { return d.range; }),
      axisLabel: { fontSize: 9, color: '#334155', fontWeight: 500 }
    }, axisStyle),
    yAxis: Object.assign({ type: 'value', axisLabel: { formatter: '{value}%', fontSize: 9 } }, axisStyle),
    series: [{
      type: 'bar',
      data: ENTRY_DISCOVERY.memory.distribution.map(function(d) { return d.value; }),
      itemStyle: {
        color: function(params) { return ['#e2e8f0', '#a7f3d0', '#34d399', '#10b981'][params.dataIndex]; },
        borderRadius: [3, 3, 0, 0]
      },
      barWidth: 22
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// ==================== v2 HTML / Table rendering ====================

function renderL2Extras() {
  renderHtmlFunnel('funnel-mcp-auth', MCP_AUTH_FUNNEL, 'count', { showConv: true, color: 'warning' });
  renderHtmlFunnel('funnel-artifact', ARTIFACT.funnel, 'count', { showConv: true, color: 'success' });
  renderMcpBlockers();
  initKbTrend();
}

// 信息库使用率 30 天趋势
function initKbTrend() {
  const __el = document.getElementById('chart-kb-trend');
  if (!__el) return;
  const chart = echarts.init(__el);
  const axisStyle = getChartAxisStyle();
  const dates = (typeof DATES_30 !== 'undefined') ? DATES_30 : Array.from({length:30}, (_,i) => '2026-05-' + String(i+1).padStart(2,'0'));
  const data = dates.map(function(d, i){
    var base = 36 + (i / 29) * 8;
    var weekday = new Date(d).getDay();
    var wkAdj = (weekday === 0 || weekday === 6) ? -3 : 0;
    return (base + wkAdj + (Math.random() * 2 - 1)).toFixed(1);
  });
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', valueFormatter: function(v){ return v + '%'; } }, COMMON_TOOLTIP),
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: Object.assign({
      type: 'category',
      data: dates.map(function(d){ return d.slice(5); }),
      axisLabel: { fontSize: 10, interval: 4, color: '#334155', fontWeight: 500 }
    }, axisStyle),
    yAxis: Object.assign({ type: 'value', min: 30, max: 50, axisLabel: { formatter: '{value}%' } }, axisStyle),
    series: [{
      type: 'line',
      data: data,
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0,0,0,1,[
          {offset:0,color:'rgba(16,185,129,0.3)'},{offset:1,color:'rgba(16,185,129,0.02)'}
        ])
      },
      lineStyle: { color: '#10b981', width: 2 },
      itemStyle: { color: '#10b981' },
      symbol: 'none'
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function renderHtmlFunnel(containerId, data, valueKey, opts) {
  var container = document.getElementById(containerId);
  if (!container) return;
  opts = opts || {};
  var max = Math.max.apply(null, data.map(function(d) { return d[valueKey]; }));
  var colorClass = opts.color === 'success' ? 'success' : opts.color === 'warning' ? 'warning' : '';
  container.innerHTML = data.map(function(d, i) {
    var pct = Math.round((d[valueKey] / max) * 100);
    var conv = i === 0 ? '—' : Math.round((d[valueKey] / data[i - 1][valueKey]) * 100) + '%';
    return '<div class="step">' +
      '<span class="step-label">' + d.stage + '</span>' +
      '<div class="step-bar-wrap">' +
        '<div class="step-bar ' + colorClass + '" style="width: ' + pct + '%"></div>' +
        '<span class="step-value">' + d[valueKey] + '</span>' +
      '</div>' +
      (opts.showConv ? '<span class="step-conv">' + conv + '</span>' : '') +
    '</div>';
  }).join('');
}

function renderRatioByField() {
  var container = document.getElementById('ratio-by-field');
  if (!container) return;
  container.innerHTML = ASSET_REUSE.byField.map(function(row) {
    return '<div class="field-row">' +
      '<span class="field-name">' + row.field + '</span>' +
      '<div class="field-bar">' +
        '<div class="ratio-segment kb" style="flex: ' + row.kb + ';">' + row.kb + '%</div>' +
        '<div class="ratio-segment upload" style="flex: ' + row.upload + ';">' + row.upload + '%</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function renderMcpBlockers() {
  var tbody = document.getElementById('mcp-blockers-tbody');
  if (!tbody) return;
  tbody.innerHTML = MCP_BLOCKERS.map(function(m) {
    var cls = m.blockRate >= 60 ? 'high' : m.blockRate >= 40 ? 'mid' : 'low';
    return '<tr>' +
      '<td class="mcp-name">' + m.name + '</td>' +
      '<td style="text-align: right;">' + m.prompts + '</td>' +
      '<td style="text-align: right;">' + m.completed + '</td>' +
      '<td style="text-align: right;" class="block-rate ' + cls + '">' + m.blockRate + '%</td>' +
    '</tr>';
  }).join('');
}
