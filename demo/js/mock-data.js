// Mock data for AI Platform Monitoring Dashboard
// Simulates 30 days of data for ~100 employees across 8 departments

const GROUPS = [
  '智能应用组', '医疗健康组', '内容金融组', '投资组合管理组',
  '数字化平台组', '技术企业组', '消费组', '全球娱乐组'
];

const GROUP_SIZES = {
  '智能应用组': 15, '医疗健康组': 12, '内容金融组': 14,
  '投资组合管理组': 13, '数字化平台组': 10, '技术企业组': 14,
  '消费组': 12, '全球娱乐组': 10
};

const TOTAL_EMPLOYEES = 100;

const MODELS = ['DeepSeek-V3.5', '混元 Turbo', 'GLM-4.6', 'Kimi K2'];

// Generate last 30 days dates
function generateDates(days) {
  const dates = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

const DATES_30 = generateDates(30);

// DAU data (workdays higher, weekends lower)
function generateDAU() {
  return DATES_30.map(dateStr => {
    const d = new Date(dateStr);
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = isWeekend ? 25 : 52;
    const noise = Math.floor(Math.random() * 12) - 6;
    return Math.max(20, Math.min(68, base + noise));
  });
}

const DAU_DATA = generateDAU();
const WAU = 72;
const MAU = 85;
const PENETRATION_RATE = Math.round(MAU / TOTAL_EMPLOYEES * 100);

// Group penetration rates
const GROUP_PENETRATION = {
  '智能应用组': 93, '医疗健康组': 75, '内容金融组': 86,
  '投资组合管理组': 92, '数字化平台组': 90, '技术企业组': 88,
  '消费组': 78, '全球娱乐组': 70
};

// Retention data
const RETENTION_DATA = {
  overall: { W1: 72, W4: 55, W12: 40 },
  byGroup: {
    '智能应用组': { W1: 80, W4: 65, W12: 50 },
    '医疗健康组': { W1: 65, W4: 48, W12: 35 },
    '内容金融组': { W1: 75, W4: 58, W12: 42 },
    '投资组合管理组': { W1: 78, W4: 62, W12: 48 },
    '数字化平台组': { W1: 82, W4: 68, W12: 52 },
    '技术企业组': { W1: 70, W4: 52, W12: 38 },
    '消费组': { W1: 68, W4: 50, W12: 36 },
    '全球娱乐组': { W1: 62, W4: 45, W12: 32 }
  }
};

const SILENT_USER_RATE = 15; // %

// Usage depth
const USAGE_DEPTH = {
  avgSessionsPerUser: 4.2,
  avgMessagesPerUser: 18.6,
  avgSessionLength: 4.4, // rounds
  crossFunctionRate: 1.8, // avg modules used per user
  userFrequency: { high: 22, medium: 45, low: 33 } // %
};

// Session length distribution
const SESSION_LENGTH_DIST = [
  { range: '1-2轮', count: 180 },
  { range: '3-5轮', count: 320 },
  { range: '6-10轮', count: 250 },
  { range: '11-15轮', count: 85 },
  { range: '16-20轮', count: 40 },
  { range: '20+轮', count: 25 }
];

// Quality metrics
const QUALITY = {
  thumbsUpRate: 78, // %
  regenerateRate: 12, // %
  abandonRate: 8, // %
  copyRate: 45, // %
  highRoundRate: 14 // % sessions > 10 rounds
  // 注：当前平台只有 👍/👎 按钮，无主动评分（avgRating）、无点踩原因（reasons）
};

// Power users leaderboard
const POWER_USERS = [
  { rank: 1, name: 'Jason Li', group: '投资组合管理组', sessions: 156, messages: 892, tokens: '185K' },
  { rank: 2, name: 'Rachel Wang', group: '智能应用组', sessions: 142, messages: 768, tokens: '162K' },
  { rank: 3, name: 'Kevin Chen', group: '内容金融组', sessions: 128, messages: 704, tokens: '148K' },
  { rank: 4, name: 'Sophie Zhang', group: '技术企业组', sessions: 118, messages: 652, tokens: '135K' },
  { rank: 5, name: 'Michael Liu', group: '医疗健康组', sessions: 105, messages: 598, tokens: '122K' },
  { rank: 6, name: 'Emily Xu', group: '消费组', sessions: 98, messages: 542, tokens: '108K' },
  { rank: 7, name: 'David Wu', group: '数字化平台组', sessions: 92, messages: 488, tokens: '96K' },
  { rank: 8, name: 'Anna Zhao', group: '全球娱乐组', sessions: 87, messages: 456, tokens: '89K' },
  { rank: 9, name: 'Chris Yang', group: '投资组合管理组', sessions: 82, messages: 428, tokens: '84K' },
  { rank: 10, name: 'Linda Huang', group: '内容金融组', sessions: 78, messages: 402, tokens: '76K' }
];

// Page-level statistics (热门页面 TOP10)
const PAGE_STATS = [
  { rank: 1, path: '/chat', name: '通用对话', pv: 1842, uv: 78, avgDuration: '4.2' },
  { rank: 2, path: '/chat/history', name: '历史会话', pv: 956, uv: 65, avgDuration: '1.8' },
  { rank: 3, path: '/memo/create', name: 'IC Memo 生成', pv: 628, uv: 32, avgDuration: '8.5' },
  { rank: 4, path: '/models', name: '模型选择', pv: 512, uv: 58, avgDuration: '0.6' },
  { rank: 5, path: '/memo/edit', name: 'IC Memo 编辑', pv: 445, uv: 30, avgDuration: '12.3' },
  { rank: 6, path: '/files/upload', name: '文件上传', pv: 382, uv: 42, avgDuration: '1.2' },
  { rank: 7, path: '/settings', name: '个人设置', pv: 215, uv: 48, avgDuration: '0.8' },
  { rank: 8, path: '/memo/download', name: 'Memo 下载', pv: 186, uv: 28, avgDuration: '0.3' },
  { rank: 9, path: '/connectors', name: '连接器管理', pv: 124, uv: 15, avgDuration: '2.1' },
  { rank: 10, path: '/skills', name: '技能中心', pv: 98, uv: 22, avgDuration: '1.5' }
];

// 注：原 THUMBS_DOWN_REASONS 已删除 — 当前平台不采集点踩原因，仅有 👍/👎 按钮

// === L2.1 IC Memo Agent 数据看板 ===
const IC_MEMO = {
  // ② 解析失败 Top 5 原因
  parseFailTop: [
    { name: '文件格式不支持', value: 24 },
    { name: 'PDF 加密 / 受密码保护', value: 18 },
    { name: '图片型 PDF 无 OCR', value: 14 },
    { name: '文件过大 (>50MB)', value: 9 },
    { name: '编码异常', value: 6 }
  ],
  // ② 生成失败趋势（30 天，每日 [总生成, 失败]）
  genTrend: (function() {
    var arr = [];
    for (var i = 0; i < 30; i++) {
      var total = 8 + Math.floor(Math.random() * 6);
      var fail = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * 3);
      arr.push({ total: total, fail: fail });
    }
    return arr;
  })(),
  // ③ Memo 编辑率分布（按章节×编辑量分桶）
  // 假设 5 个章节 × 5 个编辑量分桶（未编辑 / <10% / 10-30% / 30-50% / >50%）
  editDistByChapter: [
    { chapter: '摘要', buckets: [12, 28, 35, 18, 7] },
    { chapter: '业务分析', buckets: [8, 22, 38, 24, 8] },
    { chapter: '财务分析', buckets: [15, 30, 32, 16, 7] },
    { chapter: '估值', buckets: [18, 32, 28, 14, 8] },
    { chapter: '风险', buckets: [22, 36, 26, 12, 4] },
    { chapter: '结论', buckets: [10, 25, 35, 20, 10] }
  ],
  // ③ 章节编辑率：手动 vs 对话
  sectionEditDual: [
    { name: '业务分析', manual: 38, chat: 24 },
    { name: '财务分析', manual: 35, chat: 22 },
    { name: '估值', manual: 32, chat: 28 },
    { name: '摘要', manual: 28, chat: 18 },
    { name: '风险', manual: 22, chat: 14 },
    { name: '结论', manual: 18, chat: 12 }
  ],
  // ④ 章节质量统计明细
  qualityTable: [
    { chapter: 'AI Summary',  count: 2456, manualEdit: 32, chatEdit: 18, totalEdit: 50, score: 3.8, status: 'warn'  },
    { chapter: '行业概述',    count: 1856, manualEdit: 28, chatEdit: 16, totalEdit: 44, score: 4.1, status: 'good'  },
    { chapter: '公司基本面',  count: 2120, manualEdit: 24, chatEdit: 18, totalEdit: 42, score: 4.2, status: 'good'  },
    { chapter: '行业生态',    count: 1450, manualEdit: 21, chatEdit: 17, totalEdit: 38, score: 4.0, status: 'good'  },
    { chapter: '财务分析',    count: 1968, manualEdit: 30, chatEdit: 20, totalEdit: 50, score: 3.7, status: 'warn'  },
    { chapter: '估值',        count: 1520, manualEdit: 26, chatEdit: 16, totalEdit: 42, score: 4.0, status: 'good'  },
    { chapter: '风险点',      count: 1380, manualEdit: 20, chatEdit: 12, totalEdit: 32, score: 4.3, status: 'good'  },
    { chapter: '结论',        count: 1620, manualEdit: 28, chatEdit: 22, totalEdit: 50, score: 3.9, status: 'warn'  },
    { chapter: '附录',        count:  890, manualEdit: 14, chatEdit:  8, totalEdit: 22, score: 4.5, status: 'good'  }
  ],
  // ⑤ 满意度信号（多维隐式 + 显式）
  satisfaction: [
    { name: '上传充分（≥3 文件）', value: 78 },
    { name: '对话满意（无重新生成）', value: 71 },
    { name: '对话调整后采纳', value: 65 },
    { name: '未修改直接下载', value: 42 },
    { name: '保存到信息库', value: 31 }
  ],
  // ⑦ 月度累计节省趋势（12 个月）
  savingTrend: [220, 280, 360, 450, 520, 610, 720, 800, 850, 920, 950, 967],
  // ⑦ 单次节省时长分布
  savingDist: [
    { name: '<1h', value: 28 },
    { name: '1-2h', value: 42 },
    { name: '2-3h', value: 56 },
    { name: '3-5h', value: 38 },
    { name: '>5h', value: 14 }
  ],
  // ⑧ Memo 类型分布
  byType: [
    { name: '投决备忘录', value: 38 },
    { name: '行业研究', value: 28 },
    { name: '公司分析', value: 22 },
    { name: '其他', value: 12 }
  ],
  // ⑧ 复用率分布
  reuse: [
    { name: '高复用 (>50%)', value: 32 },
    { name: '中复用 (20-50%)', value: 38 },
    { name: '低复用 (<20%)', value: 30 }
  ],
  // ⑧ 提交时段分布（24h）
  submitTime: (function() {
    var arr = [];
    for (var i = 0; i < 24; i++) {
      var v = 2;
      if (i >= 9 && i <= 11) v = 18 + Math.random() * 6;
      else if (i >= 14 && i <= 17) v = 22 + Math.random() * 8;
      else if (i >= 19 && i <= 22) v = 14 + Math.random() * 4;
      else if (i >= 7 && i <= 9) v = 8;
      arr.push(Math.round(v));
    }
    return arr;
  })(),
  // ⑨ 上下文利用率分布
  contextUsage: [
    { name: '<30%', value: 12 },
    { name: '30-50%', value: 22 },
    { name: '50-70%', value: 38 },
    { name: '70-90%', value: 24 },
    { name: '>90%', value: 4 }
  ],
  // ⑨ Top 高产作者
  topAuthors: [
    { name: '李明', dept: '投资组合管理组', count: 18, downloadRate: 89, editRate: 42 },
    { name: '王芳', dept: '消费组', count: 15, downloadRate: 87, editRate: 38 },
    { name: '陈伟', dept: '医疗健康组', count: 13, downloadRate: 85, editRate: 45 },
    { name: '赵雪', dept: '技术企业组', count: 11, downloadRate: 82, editRate: 40 },
    { name: '孙磊', dept: '内容金融组', count:  9, downloadRate: 78, editRate: 48 }
  ]
};

// === D5 记忆模块 ===
const MEMORY_MODULE = {
  // 类型分布（事实 vs 摘要）
  byType: [
    { name: '事实（结构化短条目）', value: 1934 },
    { name: '摘要（上下文段落）', value: 922 }
  ],
  // 来源分布（自动 vs 手动）
  bySource: [
    { name: '系统自动提取', value: 2247 },
    { name: '用户手动添加', value: 609 }
  ],
  // 30 天用户管理行为聚合
  actions: [
    { name: '查看记忆', value: 1280 },
    { name: '搜索记忆', value: 642 },
    { name: '编辑记忆', value: 285 },
    { name: '删除记忆', value: 198 },
    { name: '手动添加事实', value: 142 },
    { name: '导入/导出', value: 38 }
  ]
};

// === 1.7b 技能与连接器装配 ===
// Skill Hub vs 自定义技能 添加/启用/禁用情况
const SKILL_ASSEMBLY = [
  { source: 'Skill Hub', added: 186, enabled: 142, disabled: 44 },
  { source: '自定义技能', added: 52, enabled: 38, disabled: 14 }
];

// === 1.3b 会话行为分析 ===
// 续聊跨度分布：发生过续聊的会话，从首次到末次活跃的时间跨度
const SESSION_REVISIT_SPAN = [
  { name: '当天内', value: 42 },
  { name: '1-3 天', value: 28 },
  { name: '4-7 天', value: 16 },
  { name: '1-2 周', value: 9 },
  { name: '> 2 周', value: 5 }
];
// 每日新会话发起趋势（30 天）
function generateNewSessionTrend() {
  return DATES_30.map(function(d, i) {
    var weekday = new Date(d).getDay();
    var base = 100 + i * 1.5; // 缓慢上升
    var wkAdj = (weekday === 0 || weekday === 6) ? -35 : 0;
    return Math.round(base + wkAdj + (Math.random() * 14 - 7));
  });
}
const NEW_SESSION_TREND = generateNewSessionTrend();

// Home page flow distribution — 首页流量分发（每 100 次首页访问的去向）
// type: internal=平台内页面跳转, external=外部独立网站跳转
const HOME_FLOW = {
  totalPV: 850,
  totalUV: 76,
  bounceRate: 8, // 跳出率 %
  // 出口排序按 share 降序
  destinations: [
    { name: '发起对话', share: 42, type: 'internal', icon: '💬' },
    { name: 'IC Memo Agent', share: 18, type: 'internal', icon: '📝' },
    { name: '资讯助手', share: 12, type: 'external', icon: '📰' },
    { name: '信息库', share: 9, type: 'internal', icon: '📚' },
    { name: '历史会话', share: 7, type: 'internal', icon: '🕒' },
    { name: '工作台 / Artifact', share: 4, type: 'internal', icon: '🗂' }
    // 剩余 8% = 跳出率（已在顶部 metric 单独展示）
  ]
};

// Model distribution
const MODEL_DISTRIBUTION = {
  calls: { 'DeepSeek-V3.5': 38, '混元 Turbo': 25, 'GLM-4.6': 22, 'Kimi K2': 15 },
  tokens: { 'DeepSeek-V3.5': 42, '混元 Turbo': 24, 'GLM-4.6': 20, 'Kimi K2': 14 }
};

// 模型类型分布（全部为开源自部署 / 私有化）
const MODEL_TYPE_SPLIT = {
  reasoning: { name: '推理增强型', value: 45, models: 'DeepSeek-V3.5, GLM-4.6' },
  general: { name: '通用对话型', value: 55, models: '混元 Turbo, Kimi K2' }
};

// Model calls trend (daily, last 30 days)
function generateModelTrend() {
  return DATES_30.map(() => ({
    'DeepSeek-V3.5': Math.floor(Math.random() * 20) + 60,
    '混元 Turbo': Math.floor(Math.random() * 15) + 40,
    'GLM-4.6': Math.floor(Math.random() * 15) + 32,
    'Kimi K2': Math.floor(Math.random() * 10) + 22
  }));
}
const MODEL_TREND = generateModelTrend();

// Group x Model heatmap (calls)
const GROUP_MODEL_HEATMAP = GROUPS.map(group => ({
  group,
  'DeepSeek-V3.5': Math.floor(Math.random() * 40) + 35,
  '混元 Turbo': Math.floor(Math.random() * 30) + 22,
  'GLM-4.6': Math.floor(Math.random() * 25) + 18,
  'Kimi K2': Math.floor(Math.random() * 20) + 12
}));

// Group x Model heatmap (tokens, in K)
const GROUP_MODEL_HEATMAP_TOKENS = GROUPS.map(group => ({
  group,
  'DeepSeek-V3.5': Math.floor(Math.random() * 80) + 70,
  '混元 Turbo': Math.floor(Math.random() * 60) + 45,
  'GLM-4.6': Math.floor(Math.random() * 50) + 35,
  'Kimi K2': Math.floor(Math.random() * 40) + 25
}));

// Token consumption
const TOTAL_TOKENS = '2.4M';
const TOKEN_TREND = DATES_30.map(() => Math.floor(Math.random() * 30000) + 60000);

// Function distribution (功能维度，独立于模型)
const FUNCTION_DISTRIBUTION = [
  { name: '通用对话', value: 72 },
  { name: 'IC Memo Agent', value: 28 }
];

// === L2 Data ===

// Chat module
const CHAT_ROUND_DIST = [
  { range: '1-3轮', value: 42 },
  { range: '4-10轮', value: 38 },
  { range: '10+轮', value: 20 }
];

// Time distribution heatmap (hour x weekday)
function generateTimeHeatmap() {
  const data = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      let value = 0;
      if (day < 5) { // weekdays
        if (hour >= 9 && hour <= 12) value = Math.floor(Math.random() * 40) + 60;
        else if (hour >= 14 && hour <= 18) value = Math.floor(Math.random() * 35) + 50;
        else if (hour >= 7 && hour <= 21) value = Math.floor(Math.random() * 20) + 10;
      } else { // weekends
        if (hour >= 10 && hour <= 16) value = Math.floor(Math.random() * 15) + 5;
      }
      data.push([hour, day, value]);
    }
  }
  return data;
}
const TIME_HEATMAP = generateTimeHeatmap();

// DeepSeek module
const DEEPSEEK_FILE_TYPES = [
  { name: 'PDF', value: 42 },
  { name: 'Word', value: 28 },
  { name: 'Excel', value: 18 },
  { name: 'PPT', value: 8 },
  { name: '其他', value: 4 }
];

const DEEPSEEK_DAILY_FILES = DATES_30.map(() => Math.floor(Math.random() * 8) + 12);

const DEEPSEEK_SATISFACTION = { thumbsUp: 72, publicModelThumbsUp: 78 };

// IC Memo module legacy (旧字段保留以兼容部分老函数；新看板用顶部 IC_MEMO 对象)
const IC_MEMO_LEGACY = {
  editBehavior: [
    { name: '手动编辑', value: 45 },
    { name: '对话调整', value: 35 },
    { name: '未修改', value: 20 }
  ],
  sectionEditRate: [
    { section: '投资概要', rate: 62 },
    { section: '市场分析', rate: 45 },
    { section: '竞争格局', rate: 38 },
    { section: '财务分析', rate: 55 },
    { section: '风险评估', rate: 42 },
    { section: '投资建议', rate: 68 }
  ]
};

// User segmentation
const USER_SEGMENTS = {
  current: { high: 18, medium: 38, low: 22, silent: 15 },
  // Sankey flow data
  migration: [
    { source: '上月高频', target: '本月高频', value: 14 },
    { source: '上月高频', target: '本月中频', value: 3 },
    { source: '上月高频', target: '本月低频', value: 1 },
    { source: '上月中频', target: '本月高频', value: 4 },
    { source: '上月中频', target: '本月中频', value: 28 },
    { source: '上月中频', target: '本月低频', value: 5 },
    { source: '上月中频', target: '本月沉默', value: 2 },
    { source: '上月低频', target: '本月中频', value: 6 },
    { source: '上月低频', target: '本月低频', value: 12 },
    { source: '上月低频', target: '本月沉默', value: 4 },
    { source: '上月沉默', target: '本月低频', value: 3 },
    { source: '上月沉默', target: '本月沉默', value: 8 }
  ],
  funnel: [
    { stage: '注册', count: 100 },
    { stage: '首次使用', count: 88 },
    { stage: '第二次使用', count: 72 },
    { stage: '周活跃', count: 58 }
  ]
};

// === L3 Data ===

// Security & Compliance
const SECURITY = {
  totalBlocks: 47,
  blockTrend: DATES_30.map(() => Math.floor(Math.random() * 4)),
  blockByGroup: [
    { group: '内容金融组', count: 12 },
    { group: '投资组合管理组', count: 9 },
    { group: '医疗健康组', count: 8 },
    { group: '消费组', count: 6 },
    { group: '技术企业组', count: 5 },
    { group: '智能应用组', count: 3 },
    { group: '数字化平台组', count: 2 },
    { group: '全球娱乐组', count: 2 }
  ],
  blockScenario: [
    { name: '上传内部文件', value: 65 },
    { name: '调用内部数据源', value: 35 }
  ],
  contentModeration: 8,
  sensitiveFields: 23
};

// System observability
const SYSTEM = {
  availability: { 'DeepSeek-V3.5': 99.8, '混元 Turbo': 99.6, 'GLM-4.6': 99.7, 'Kimi K2': 99.5 },
  responseTime: {
    p50: DATES_30.map(() => (Math.random() * 0.5 + 0.8).toFixed(2)),
    p95: DATES_30.map(() => (Math.random() * 1.5 + 2.0).toFixed(2)),
    p99: DATES_30.map(() => (Math.random() * 2.0 + 4.0).toFixed(2))
  },
  ttft: {
    'DeepSeek-V3.5': 0.55, '混元 Turbo': 0.42, 'GLM-4.6': 0.48, 'Kimi K2': 0.62
  },
  errorRate: DATES_30.map(() => (Math.random() * 1.5 + 0.5).toFixed(2)),
  errorTypes: [
    { name: 'Rate Limit', value: 35 },
    { name: 'Timeout', value: 28 },
    { name: 'Model Error', value: 22 },
    { name: '解析失败', value: 15 }
  ],
  concurrentSessions: DATES_30.map(() => Math.floor(Math.random() * 10) + 8),
  tokenThroughput: DATES_30.map(() => Math.floor(Math.random() * 5000) + 3000)
};

// ==================== v2 NEW MOCK DATA ====================

// === L1.4 回答质量 - 新增 ===
const QUALITY_EXTRA = {
  citationClickRate: 42,    // 引用点击率 %
  exportRate: 11,           // 导出率 %
  exportFormatSplit: [      // 导出按格式拆分
    { name: 'PDF', value: 56 },
    { name: 'DOCX', value: 31 },
    { name: 'Markdown', value: 13 }
  ]
};

// === L1.5 智能体调用分布 ===
const AGENT_DISTRIBUTION = [
  { name: 'IC-Memo 撰写专家', value: 32 },
  { name: '资讯助手', value: 24 },
  { name: 'Deep Research', value: 18 },
  { name: 'M&A Agent', value: 11 },
  { name: '通用助手', value: 9 },
  { name: '其他', value: 6 }
];

// === L1.5 技能使用集中度 TOP5 ===
const SKILL_TOP5 = [
  { name: 'IC Memo 撰写', value: 128 },
  { name: '公司资讯追踪', value: 86 },
  { name: '财报分析', value: 64 },
  { name: '行业研究', value: 47 },
  { name: '估值建模', value: 32 }
];

// === L1.5 深度模式 / 联网渗透率 ===
const FEATURE_PENETRATION = {
  deepModeRate: 42,         // 深度模式渗透率 %
  webSearchRate: 65,        // 联网功能使用率 %
  deepModeRateChange: +3.5, // 环比
  webSearchRateChange: +1.8
};

// === L1.6 任务体验（核心新模块）===
const TASK_EXPERIENCE = {
  oneShotSuccessRate: 68,            // 任务一次成功率 %
  oneShotSuccessChange: +2.4,
  avgClarifications: 0.6,            // 平均澄清次数
  avgClarificationsChange: -0.1,
  clarificationCompleteRate: 78,     // 澄清完成率（vs 跳过）%
  taskAbandonRate: 9,                // 任务放弃率 %
  taskDurationP50: 38,               // 秒
  taskDurationP95: 156,
  // 澄清原因分布
  clarificationReasons: [
    { name: '缺文件', value: 48 },
    { name: 'MCP 授权', value: 22 },
    { name: '意图模糊', value: 18 },
    { name: '其他', value: 12 }
  ],
  // 任务一次成功率近 30 天趋势
  oneShotTrend: DATES_30.map((_, i) => {
    const base = 65 + Math.sin(i / 5) * 3 + i * 0.1;
    return Math.round(base + (Math.random() * 4 - 2));
  })
};

// === L2.5 技能表单完成度漏斗 ===
const SKILL_FORM_FUNNEL = [
  { stage: '打开表单', count: 142 },
  { stage: '填写≥1字段', count: 124 },
  { stage: '全部字段填写', count: 96 },
  { stage: '提交', count: 88 }
];

// === L2.5 表单字段填写率（IC Memo 三个核心字段）===
const SKILL_FIELD_FILL_RATE = [
  { field: '财务建模', rate: 92 },
  { field: '尽调文件', rate: 86 },
  { field: '其他材料', rate: 54 },
  { field: '其他需求(自由文本)', rate: 41 }
];

// === L2.5 资产复用率（信息库 vs 上传附件）— 核心 KPI ===
const ASSET_REUSE = {
  overall: { kb: 38, upload: 62 },   // 整体占比 %
  overallTrend: DATES_30.map((_, i) => {
    const base = 30 + i * 0.3;
    return Math.round(base + (Math.random() * 6 - 3));
  }),
  // 按字段拆分
  byField: [
    { field: '财务建模', kb: 45, upload: 55 },
    { field: '尽调文件', kb: 28, upload: 72 },
    { field: '其他材料', kb: 52, upload: 48 }
  ]
};

// === L2.5 MCP 授权漏斗 ===
const MCP_AUTH_FUNNEL = [
  { stage: '弹出授权', count: 68 },
  { stage: '点击授权', count: 52 },
  { stage: '授权完成', count: 41 },
  { stage: '任务继续', count: 38 }
];

// === L2.5 MCP 卡点 TOP（弹出但未授权率高的）===
const MCP_BLOCKERS = [
  { name: 'Notion', prompts: 28, completed: 11, blockRate: 61 },
  { name: '飞书云文档', prompts: 18, completed: 9, blockRate: 50 },
  { name: 'Crunchbase', prompts: 12, completed: 6, blockRate: 50 },
  { name: 'Bloomberg API', prompts: 6, completed: 2, blockRate: 67 },
  { name: '内部 CRM', prompts: 4, completed: 3, blockRate: 25 }
];

// === L2.6 Artifact 沉淀 ===
const ARTIFACT = {
  totalCreated: 384,
  // 按文件类型分布（md/pdf/docx/xlsx/pptx 等）
  byType: [
    { name: 'Markdown (.md)', value: 142 },
    { name: 'PDF (.pdf)', value: 96 },
    { name: 'Word (.docx)', value: 68 },
    { name: 'Excel (.xlsx)', value: 42 },
    { name: 'PPT (.pptx)', value: 24 },
    { name: '其他', value: 12 }
  ],
  // 沉淀漏斗
  funnel: [
    { stage: '生成', count: 384 },
    { stage: '保存', count: 312 },
    { stage: '存入信息库', count: 186 },
    { stage: '下载', count: 254 }
  ],
  kbSaveRate: 48,        // 存入信息库率 %
  kbSaveTrend: DATES_30.map((_, i) => 40 + Math.round(Math.sin(i / 4) * 5 + i * 0.2 + Math.random() * 4)),
  downloadRate: 66,         // 下载率 %
  workbenchSearchRate: 31   // 工作台搜索使用率 %
};

// === L2.7 入口与发现 ===
const ENTRY_DISCOVERY = {
  // 欢迎页推荐卡片转化
  welcomeCardConversion: [
    { card: '生成 IC Memo', clicks: 142, completedTasks: 88, rate: 62 },
    { card: '资讯助手', clicks: 96, completedTasks: 71, rate: 74 }
  ],
  // 全局搜索使用情况
  globalSearch: {
    usageRate: 34,             // 用户使用率 %
    targetSplit: [
      { name: '搜对话', value: 78 },
      { name: '搜记忆', value: 22 }
    ],
    avgQueryPerUser: 4.2
  },
  // 平台记忆采纳度
  memory: {
    adoptionRate: 28,          // 至少有 1 条 memory 的用户占比 %
    avgMemoriesPerUser: 6.4,
    distribution: [
      { range: '0 条', value: 72 },
      { range: '1-5 条', value: 14 },
      { range: '6-15 条', value: 9 },
      { range: '16+ 条', value: 5 }
    ]
  },
  // 侧栏入口 PV
  sidebarNavPV: [
    { name: '工作台', value: 1842 },
    { name: '技能库', value: 624 },
    { name: '智能体', value: 482 },
    { name: '连接器', value: 168 }
  ]
};

// === Langfuse 链接（占位）===
const LANGFUSE_URL = 'https://langfuse.example.com/project/mai-platform';

// === Sparkline trend data (7-day mock for metric cards) ===
const SPARKLINE_TRENDS = {
  positive: [[78,80,82,79,83,85,87],[72,75,74,78,77,80,82],[68,70,72,71,74,76,78]],
  neutral: [[45,48,50,52,49,53,52],[68,70,71,72,69,73,72],[80,82,81,84,83,85,85]],
  negative: [[12,11,10,11,9,8,8],[15,14,13,14,12,11,10]],
  warning: [[14,15,13,14,16,15,12],[18,17,16,18,15,14,13]]
};

// === Token 用量与费用 Mock 数据 ===
const TOKEN_USAGE_PRICING = {
  "Kimi K2.6":      { inputCacheHit: 1.1,  inputCacheMiss: 6.5, output: 27  },
  "DeepSeek-V4-Pro": { inputCacheHit: 0.025, inputCacheMiss: 3,  output: 6   },
  "GLM-5.1":         { inputCacheHit: 1.44, inputCacheMiss: 6.4, output: 24.8 }
};

const TOKEN_USAGE_TOTALS = {
  threeMonthCost: 407,
  threeMonthTokens: 77.5,
  avgMonthlyCostPerUser: 17,
  activeUsers: 8
};

const TOKEN_USAGE_DATA = [
  {
    "user": "张伟",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "Kimi K2.6",
    "inputM": 0.96,
    "cacheHitM": 0.37,
    "outputM": 0.17,
    "totalM": 1.13,
    "cost": 8.83
  },
  {
    "user": "张伟",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 1.41,
    "cacheHitM": 0.57,
    "outputM": 0.24,
    "totalM": 1.65,
    "cost": 3.97
  },
  {
    "user": "张伟",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "GLM-5.1",
    "inputM": 0.52,
    "cacheHitM": 0.2,
    "outputM": 0.08,
    "totalM": 0.6,
    "cost": 4.32
  },
  {
    "user": "张伟",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "Kimi K2.6",
    "inputM": 1.12,
    "cacheHitM": 0.42,
    "outputM": 0.17,
    "totalM": 1.29,
    "cost": 9.6
  },
  {
    "user": "张伟",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 1.47,
    "cacheHitM": 0.59,
    "outputM": 0.23,
    "totalM": 1.7,
    "cost": 4.03
  },
  {
    "user": "张伟",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "GLM-5.1",
    "inputM": 0.66,
    "cacheHitM": 0.28,
    "outputM": 0.09,
    "totalM": 0.75,
    "cost": 5.07
  },
  {
    "user": "张伟",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "Kimi K2.6",
    "inputM": 1.28,
    "cacheHitM": 0.5,
    "outputM": 0.19,
    "totalM": 1.47,
    "cost": 10.75
  },
  {
    "user": "张伟",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 1.68,
    "cacheHitM": 0.66,
    "outputM": 0.25,
    "totalM": 1.93,
    "cost": 4.58
  },
  {
    "user": "张伟",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "GLM-5.1",
    "inputM": 0.63,
    "cacheHitM": 0.27,
    "outputM": 0.12,
    "totalM": 0.75,
    "cost": 5.67
  },
  {
    "user": "李娜",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "Kimi K2.6",
    "inputM": 0.61,
    "cacheHitM": 0.22,
    "outputM": 0.11,
    "totalM": 0.72,
    "cost": 5.75
  },
  {
    "user": "李娜",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 0.87,
    "cacheHitM": 0.31,
    "outputM": 0.16,
    "totalM": 1.03,
    "cost": 2.65
  },
  {
    "user": "李娜",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "GLM-5.1",
    "inputM": 0.81,
    "cacheHitM": 0.31,
    "outputM": 0.13,
    "totalM": 0.94,
    "cost": 6.87
  },
  {
    "user": "李娜",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "Kimi K2.6",
    "inputM": 0.51,
    "cacheHitM": 0.16,
    "outputM": 0.09,
    "totalM": 0.6,
    "cost": 4.88
  },
  {
    "user": "李娜",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 0.88,
    "cacheHitM": 0.29,
    "outputM": 0.14,
    "totalM": 1.02,
    "cost": 2.62
  },
  {
    "user": "李娜",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "GLM-5.1",
    "inputM": 0.8,
    "cacheHitM": 0.29,
    "outputM": 0.13,
    "totalM": 0.93,
    "cost": 6.91
  },
  {
    "user": "李娜",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "Kimi K2.6",
    "inputM": 0.58,
    "cacheHitM": 0.19,
    "outputM": 0.12,
    "totalM": 0.7,
    "cost": 5.98
  },
  {
    "user": "李娜",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 1.04,
    "cacheHitM": 0.37,
    "outputM": 0.15,
    "totalM": 1.19,
    "cost": 2.92
  },
  {
    "user": "李娜",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "GLM-5.1",
    "inputM": 0.93,
    "cacheHitM": 0.31,
    "outputM": 0.14,
    "totalM": 1.07,
    "cost": 7.89
  },
  {
    "user": "王磊",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "Kimi K2.6",
    "inputM": 1.42,
    "cacheHitM": 0.64,
    "outputM": 0.22,
    "totalM": 1.64,
    "cost": 11.71
  },
  {
    "user": "王磊",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 2.38,
    "cacheHitM": 1.09,
    "outputM": 0.35,
    "totalM": 2.73,
    "cost": 6.0
  },
  {
    "user": "王磊",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "GLM-5.1",
    "inputM": 0.83,
    "cacheHitM": 0.36,
    "outputM": 0.13,
    "totalM": 0.96,
    "cost": 6.75
  },
  {
    "user": "王磊",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "Kimi K2.6",
    "inputM": 1.52,
    "cacheHitM": 0.71,
    "outputM": 0.22,
    "totalM": 1.74,
    "cost": 11.99
  },
  {
    "user": "王磊",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 2.42,
    "cacheHitM": 1.08,
    "outputM": 0.39,
    "totalM": 2.81,
    "cost": 6.39
  },
  {
    "user": "王磊",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "GLM-5.1",
    "inputM": 0.95,
    "cacheHitM": 0.41,
    "outputM": 0.14,
    "totalM": 1.09,
    "cost": 7.52
  },
  {
    "user": "王磊",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "Kimi K2.6",
    "inputM": 1.52,
    "cacheHitM": 0.69,
    "outputM": 0.26,
    "totalM": 1.78,
    "cost": 13.17
  },
  {
    "user": "王磊",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 2.6,
    "cacheHitM": 1.15,
    "outputM": 0.43,
    "totalM": 3.03,
    "cost": 6.96
  },
  {
    "user": "王磊",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "GLM-5.1",
    "inputM": 1.05,
    "cacheHitM": 0.45,
    "outputM": 0.14,
    "totalM": 1.19,
    "cost": 7.96
  },
  {
    "user": "陈静",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "Kimi K2.6",
    "inputM": 0.32,
    "cacheHitM": 0.11,
    "outputM": 0.05,
    "totalM": 0.37,
    "cost": 2.84
  },
  {
    "user": "陈静",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 0.43,
    "cacheHitM": 0.12,
    "outputM": 0.11,
    "totalM": 0.54,
    "cost": 1.59
  },
  {
    "user": "陈静",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "GLM-5.1",
    "inputM": 0.67,
    "cacheHitM": 0.23,
    "outputM": 0.12,
    "totalM": 0.79,
    "cost": 6.12
  },
  {
    "user": "陈静",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "Kimi K2.6",
    "inputM": 0.36,
    "cacheHitM": 0.12,
    "outputM": 0.05,
    "totalM": 0.41,
    "cost": 3.04
  },
  {
    "user": "陈静",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 0.5,
    "cacheHitM": 0.16,
    "outputM": 0.08,
    "totalM": 0.58,
    "cost": 1.5
  },
  {
    "user": "陈静",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "GLM-5.1",
    "inputM": 0.7,
    "cacheHitM": 0.21,
    "outputM": 0.14,
    "totalM": 0.84,
    "cost": 6.91
  },
  {
    "user": "陈静",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "Kimi K2.6",
    "inputM": 0.31,
    "cacheHitM": 0.09,
    "outputM": 0.05,
    "totalM": 0.36,
    "cost": 2.88
  },
  {
    "user": "陈静",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 0.7,
    "cacheHitM": 0.23,
    "outputM": 0.1,
    "totalM": 0.8,
    "cost": 2.02
  },
  {
    "user": "陈静",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "GLM-5.1",
    "inputM": 0.83,
    "cacheHitM": 0.26,
    "outputM": 0.12,
    "totalM": 0.95,
    "cost": 7.0
  },
  {
    "user": "刘洋",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "Kimi K2.6",
    "inputM": 1.55,
    "cacheHitM": 0.79,
    "outputM": 0.24,
    "totalM": 1.79,
    "cost": 12.29
  },
  {
    "user": "刘洋",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 1.44,
    "cacheHitM": 0.71,
    "outputM": 0.22,
    "totalM": 1.66,
    "cost": 3.53
  },
  {
    "user": "刘洋",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "GLM-5.1",
    "inputM": 0.86,
    "cacheHitM": 0.45,
    "outputM": 0.14,
    "totalM": 1.0,
    "cost": 6.74
  },
  {
    "user": "刘洋",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "Kimi K2.6",
    "inputM": 1.54,
    "cacheHitM": 0.79,
    "outputM": 0.27,
    "totalM": 1.81,
    "cost": 13.03
  },
  {
    "user": "刘洋",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 1.54,
    "cacheHitM": 0.77,
    "outputM": 0.24,
    "totalM": 1.78,
    "cost": 3.77
  },
  {
    "user": "刘洋",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "GLM-5.1",
    "inputM": 0.86,
    "cacheHitM": 0.45,
    "outputM": 0.11,
    "totalM": 0.97,
    "cost": 6.0
  },
  {
    "user": "刘洋",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "Kimi K2.6",
    "inputM": 1.77,
    "cacheHitM": 0.87,
    "outputM": 0.29,
    "totalM": 2.06,
    "cost": 14.64
  },
  {
    "user": "刘洋",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 1.75,
    "cacheHitM": 0.86,
    "outputM": 0.28,
    "totalM": 2.03,
    "cost": 4.37
  },
  {
    "user": "刘洋",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "GLM-5.1",
    "inputM": 0.93,
    "cacheHitM": 0.45,
    "outputM": 0.13,
    "totalM": 1.06,
    "cost": 6.94
  },
  {
    "user": "赵敏",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "Kimi K2.6",
    "inputM": 0.18,
    "cacheHitM": 0.04,
    "outputM": 0.02,
    "totalM": 0.2,
    "cost": 1.49
  },
  {
    "user": "赵敏",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 0.23,
    "cacheHitM": 0.04,
    "outputM": 0.04,
    "totalM": 0.27,
    "cost": 0.81
  },
  {
    "user": "赵敏",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "GLM-5.1",
    "inputM": 0.58,
    "cacheHitM": 0.13,
    "outputM": 0.07,
    "totalM": 0.65,
    "cost": 4.8
  },
  {
    "user": "赵敏",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "Kimi K2.6",
    "inputM": 0.18,
    "cacheHitM": 0.03,
    "outputM": 0.04,
    "totalM": 0.22,
    "cost": 2.09
  },
  {
    "user": "赵敏",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 0.39,
    "cacheHitM": 0.07,
    "outputM": 0.04,
    "totalM": 0.43,
    "cost": 1.2
  },
  {
    "user": "赵敏",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "GLM-5.1",
    "inputM": 0.61,
    "cacheHitM": 0.14,
    "outputM": 0.07,
    "totalM": 0.68,
    "cost": 4.95
  },
  {
    "user": "赵敏",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "Kimi K2.6",
    "inputM": 0.19,
    "cacheHitM": 0.05,
    "outputM": 0.04,
    "totalM": 0.23,
    "cost": 2.05
  },
  {
    "user": "赵敏",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 0.42,
    "cacheHitM": 0.09,
    "outputM": 0.04,
    "totalM": 0.46,
    "cost": 1.23
  },
  {
    "user": "赵敏",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "GLM-5.1",
    "inputM": 0.64,
    "cacheHitM": 0.16,
    "outputM": 0.1,
    "totalM": 0.74,
    "cost": 5.78
  },
  {
    "user": "黄凯",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "Kimi K2.6",
    "inputM": 0.89,
    "cacheHitM": 0.37,
    "outputM": 0.12,
    "totalM": 1.01,
    "cost": 7.03
  },
  {
    "user": "黄凯",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 1.12,
    "cacheHitM": 0.42,
    "outputM": 0.2,
    "totalM": 1.32,
    "cost": 3.31
  },
  {
    "user": "黄凯",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "GLM-5.1",
    "inputM": 0.8,
    "cacheHitM": 0.29,
    "outputM": 0.13,
    "totalM": 0.93,
    "cost": 6.91
  },
  {
    "user": "黄凯",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "Kimi K2.6",
    "inputM": 0.86,
    "cacheHitM": 0.31,
    "outputM": 0.16,
    "totalM": 1.02,
    "cost": 8.24
  },
  {
    "user": "黄凯",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 1.19,
    "cacheHitM": 0.47,
    "outputM": 0.2,
    "totalM": 1.39,
    "cost": 3.37
  },
  {
    "user": "黄凯",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "GLM-5.1",
    "inputM": 0.81,
    "cacheHitM": 0.34,
    "outputM": 0.16,
    "totalM": 0.97,
    "cost": 7.47
  },
  {
    "user": "黄凯",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "Kimi K2.6",
    "inputM": 1.08,
    "cacheHitM": 0.43,
    "outputM": 0.15,
    "totalM": 1.23,
    "cost": 8.75
  },
  {
    "user": "黄凯",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 1.33,
    "cacheHitM": 0.49,
    "outputM": 0.21,
    "totalM": 1.54,
    "cost": 3.79
  },
  {
    "user": "黄凯",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "GLM-5.1",
    "inputM": 0.91,
    "cacheHitM": 0.34,
    "outputM": 0.18,
    "totalM": 1.09,
    "cost": 8.6
  },
  {
    "user": "周婷",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "Kimi K2.6",
    "inputM": 0.5,
    "cacheHitM": 0.16,
    "outputM": 0.07,
    "totalM": 0.57,
    "cost": 4.28
  },
  {
    "user": "周婷",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 0.89,
    "cacheHitM": 0.32,
    "outputM": 0.14,
    "totalM": 1.03,
    "cost": 2.56
  },
  {
    "user": "周婷",
    "month": "2026-03",
    "monthLabel": "3月",
    "model": "GLM-5.1",
    "inputM": 0.58,
    "cacheHitM": 0.17,
    "outputM": 0.08,
    "totalM": 0.66,
    "cost": 4.85
  },
  {
    "user": "周婷",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "Kimi K2.6",
    "inputM": 0.51,
    "cacheHitM": 0.17,
    "outputM": 0.09,
    "totalM": 0.6,
    "cost": 4.83
  },
  {
    "user": "周婷",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 0.81,
    "cacheHitM": 0.27,
    "outputM": 0.15,
    "totalM": 0.96,
    "cost": 2.53
  },
  {
    "user": "周婷",
    "month": "2026-04",
    "monthLabel": "4月",
    "model": "GLM-5.1",
    "inputM": 0.67,
    "cacheHitM": 0.2,
    "outputM": 0.12,
    "totalM": 0.79,
    "cost": 6.27
  },
  {
    "user": "周婷",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "Kimi K2.6",
    "inputM": 0.45,
    "cacheHitM": 0.15,
    "outputM": 0.09,
    "totalM": 0.54,
    "cost": 4.54
  },
  {
    "user": "周婷",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "DeepSeek-V4-Pro",
    "inputM": 0.87,
    "cacheHitM": 0.26,
    "outputM": 0.17,
    "totalM": 1.04,
    "cost": 2.86
  },
  {
    "user": "周婷",
    "month": "2026-05",
    "monthLabel": "5月",
    "model": "GLM-5.1",
    "inputM": 0.56,
    "cacheHitM": 0.19,
    "outputM": 0.11,
    "totalM": 0.67,
    "cost": 5.37
  }
];

const TOKEN_USAGE_USER_TOTALS = [
  {
    "user": "张伟",
    "inputM": 9.7,
    "outputM": 1.5,
    "totalM": 11.3,
    "cost": 56.82
  },
  {
    "user": "李娜",
    "inputM": 7.0,
    "outputM": 1.2,
    "totalM": 8.2,
    "cost": 46.47
  },
  {
    "user": "王磊",
    "inputM": 14.7,
    "outputM": 2.3,
    "totalM": 17.0,
    "cost": 78.45
  },
  {
    "user": "陈静",
    "inputM": 4.8,
    "outputM": 0.8,
    "totalM": 5.6,
    "cost": 33.9
  },
  {
    "user": "刘洋",
    "inputM": 12.2,
    "outputM": 1.9,
    "totalM": 14.2,
    "cost": 71.31
  },
  {
    "user": "赵敏",
    "inputM": 3.4,
    "outputM": 0.5,
    "totalM": 3.9,
    "cost": 24.4
  },
  {
    "user": "黄凯",
    "inputM": 9.0,
    "outputM": 1.5,
    "totalM": 10.5,
    "cost": 57.47
  },
  {
    "user": "周婷",
    "inputM": 5.8,
    "outputM": 1.0,
    "totalM": 6.9,
    "cost": 38.09
  }
];

