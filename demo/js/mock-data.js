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

const MODELS = ['Claude', 'ChatGPT', 'DeepSeek', 'Hunyuan 3.0', 'Kimi 2.6'];

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
  highRoundRate: 14, // % sessions > 10 rounds
  avgRating: 4.1 // out of 5
};

const THUMBS_DOWN_REASONS = [
  { name: '不准确', value: 35 },
  { name: '不相关', value: 25 },
  { name: '太长/啰嗦', value: 18 },
  { name: '格式差', value: 12 },
  { name: '其他', value: 10 }
];

// Model distribution
const MODEL_DISTRIBUTION = {
  calls: { Claude: 32, ChatGPT: 22, DeepSeek: 20, 'Hunyuan 3.0': 15, 'Kimi 2.6': 11 },
  tokens: { Claude: 35, ChatGPT: 23, DeepSeek: 19, 'Hunyuan 3.0': 13, 'Kimi 2.6': 10 }
};

// Public vs Private model split
const MODEL_TYPE_SPLIT = {
  public: { name: '公有模型', value: 54, models: 'Claude, ChatGPT' },
  private: { name: '私有化模型', value: 46, models: 'DeepSeek, Hunyuan 3.0, Kimi 2.6' }
};

// Model calls trend (daily, last 30 days)
function generateModelTrend() {
  return DATES_30.map(() => ({
    Claude: Math.floor(Math.random() * 20) + 55,
    ChatGPT: Math.floor(Math.random() * 15) + 38,
    DeepSeek: Math.floor(Math.random() * 15) + 32,
    'Hunyuan 3.0': Math.floor(Math.random() * 10) + 22,
    'Kimi 2.6': Math.floor(Math.random() * 8) + 16
  }));
}
const MODEL_TREND = generateModelTrend();

// Group x Model heatmap (calls)
const GROUP_MODEL_HEATMAP = GROUPS.map(group => ({
  group,
  Claude: Math.floor(Math.random() * 40) + 30,
  ChatGPT: Math.floor(Math.random() * 30) + 20,
  DeepSeek: Math.floor(Math.random() * 25) + 15,
  'Hunyuan 3.0': Math.floor(Math.random() * 20) + 10,
  'Kimi 2.6': Math.floor(Math.random() * 15) + 8
}));

// Group x Model heatmap (tokens, in K)
const GROUP_MODEL_HEATMAP_TOKENS = GROUPS.map(group => ({
  group,
  Claude: Math.floor(Math.random() * 80) + 60,
  ChatGPT: Math.floor(Math.random() * 60) + 40,
  DeepSeek: Math.floor(Math.random() * 50) + 30,
  'Hunyuan 3.0': Math.floor(Math.random() * 40) + 20,
  'Kimi 2.6': Math.floor(Math.random() * 30) + 15
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

// IC Memo module
const IC_MEMO = {
  activeUsers: 32,
  totalMemos: 128,
  avgPerUser: 4.0,
  parseSuccessRate: 94,
  avgGenerateTime: 45, // seconds
  downloadRate: 82, // %
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
  availability: { Claude: 99.7, ChatGPT: 99.5, DeepSeek: 99.9 },
  responseTime: {
    p50: DATES_30.map(() => (Math.random() * 0.5 + 0.8).toFixed(2)),
    p95: DATES_30.map(() => (Math.random() * 1.5 + 2.0).toFixed(2)),
    p99: DATES_30.map(() => (Math.random() * 2.0 + 4.0).toFixed(2))
  },
  ttft: {
    Claude: 0.42, ChatGPT: 0.38, DeepSeek: 0.65
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
