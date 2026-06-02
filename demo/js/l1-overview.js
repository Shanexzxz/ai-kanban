// L1 Overview Charts
function initL1Charts() {
  initPenetrationChart();
  initDAUTrend();
  initRetentionChart();
  initSessionLengthDist();
  initFrequencyDist();
  initExportFormat();
  initFunctionDist();
  initModelDist();
  initModelTypeSplit();
  initAgentDist();
  initSkillTop5();
  initFeatureTrend();
  initModelTrend();
  initGroupModelHeatmap();
  initTokenTrend();
  initOneShotTrend();
  initClarificationReasons();
}

function initPenetrationChart() {
  const chart = echarts.init(document.getElementById('chart-group-penetration'));
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 100, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    yAxis: {
      type: 'category',
      data: Object.keys(GROUP_PENETRATION).reverse(),
      axisLabel: { fontSize: 11 }
    },
    series: [{
      type: 'bar',
      data: Object.values(GROUP_PENETRATION).reverse(),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#4f6ef7' },
          { offset: 1, color: '#818cf8' }
        ]),
        borderRadius: [0, 4, 4, 0]
      },
      barWidth: 18,
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initDAUTrend() {
  const chart = echarts.init(document.getElementById('chart-dau-trend'));
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: DATES_30.map(d => d.slice(5)),
      axisLabel: { fontSize: 10, interval: 4 }
    },
    yAxis: { type: 'value', min: 15 },
    series: [{
      type: 'line',
      data: DAU_DATA,
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(79,110,247,0.3)' },
          { offset: 1, color: 'rgba(79,110,247,0.02)' }
        ])
      },
      lineStyle: { color: '#4f6ef7', width: 2 },
      itemStyle: { color: '#4f6ef7' },
      symbol: 'none'
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initRetentionChart() {
  const chart = echarts.init(document.getElementById('chart-retention'));
  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];
  // Simulate decay curve
  const overallData = weeks.map((_, i) => Math.round(100 * Math.pow(0.92, i + 1)));
  chart.setOption({
    tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
    grid: { left: 50, right: 20, top: 30, bottom: 30 },
    xAxis: { type: 'category', data: weeks },
    yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    series: [{
      type: 'line',
      data: overallData,
      smooth: true,
      lineStyle: { color: '#4f6ef7', width: 2 },
      itemStyle: { color: '#4f6ef7' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(79,110,247,0.15)' },
          { offset: 1, color: 'rgba(79,110,247,0.01)' }
        ])
      },
      markPoint: {
        symbol: 'circle',
        symbolSize: 10,
        data: [
          { name: 'W1', coord: [0, overallData[0]], value: overallData[0], itemStyle: { color: '#10b981' } },
          { name: 'W4', coord: [3, overallData[3]], value: overallData[3], itemStyle: { color: '#f59e0b' } },
          { name: 'W12', coord: [11, overallData[11]], value: overallData[11], itemStyle: { color: '#ef4444' } }
        ],
        label: { formatter: (p) => p.value + '%', fontSize: 11, position: 'top' }
      }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initSessionLengthDist() {
  const chart = echarts.init(document.getElementById('chart-session-length'));
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: SESSION_LENGTH_DIST.map(d => d.range) },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: SESSION_LENGTH_DIST.map(d => d.count),
      itemStyle: {
        color: (params) => {
          const colors = ['#4f6ef7', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];
          return colors[params.dataIndex] || colors[0];
        },
        borderRadius: [4, 4, 0, 0]
      },
      barWidth: 32
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initFrequencyDist() {
  const chart = echarts.init(document.getElementById('chart-frequency'));
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '45%'],
      data: [
        { value: USAGE_DEPTH.userFrequency.high, name: '高频(每日)', itemStyle: { color: '#4f6ef7' } },
        { value: USAGE_DEPTH.userFrequency.medium, name: '中频(每周)', itemStyle: { color: '#818cf8' } },
        { value: USAGE_DEPTH.userFrequency.low, name: '低频(<每周)', itemStyle: { color: '#c7d2fe' } }
      ],
      label: { formatter: '{b}\n{d}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initThumbsDownReasons() {
  // 已废弃：当前平台只有 👍/👎，无点踩原因采集
}

function initFunctionDist() {
  const chart = echarts.init(document.getElementById('chart-function-dist'));
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '42%'],
      data: FUNCTION_DISTRIBUTION.map((d, i) => ({
        ...d,
        itemStyle: { color: ['#4f6ef7', '#f59e0b'][i] }
      })),
      label: { formatter: '{b}\n{d}%', fontSize: 12 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initModelDist() {
  const chart = echarts.init(document.getElementById('chart-model-dist'));
  const colors = ['#4f6ef7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  const data = Object.entries(MODEL_DISTRIBUTION.calls).map(([name, value], i) => ({
    name, value, itemStyle: { color: colors[i] }
  }));
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '40%'],
      data: data,
      label: { formatter: '{b}\n{d}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initModelTypeSplit() {
  const chart = echarts.init(document.getElementById('chart-model-type'));
  chart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['45%', '68%'],
      center: ['50%', '45%'],
      data: [
        { value: MODEL_TYPE_SPLIT.public.value, name: '公有模型', itemStyle: { color: '#4f6ef7' } },
        { value: MODEL_TYPE_SPLIT.private.value, name: '私有化模型', itemStyle: { color: '#10b981' } }
      ],
      label: { formatter: '{b}\n{d}%', fontSize: 12 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initModelTrend() {
  const chart = echarts.init(document.getElementById('chart-model-trend'));
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: MODELS, bottom: 0, textStyle: { fontSize: 11 } },
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: {
      type: 'category',
      data: DATES_30.map(d => d.slice(5)),
      axisLabel: { fontSize: 10, interval: 4 }
    },
    yAxis: { type: 'value' },
    series: MODELS.map((model, i) => ({
      name: model,
      type: 'line',
      stack: 'total',
      smooth: true,
      areaStyle: { opacity: 0.4 },
      data: MODEL_TREND.map(d => d[model]),
      lineStyle: { width: 1.5 },
      itemStyle: { color: ['#4f6ef7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][i] },
      symbol: 'none'
    }))
  });
  window.addEventListener('resize', () => chart.resize());
}

function initGroupModelHeatmap() {
  const chart = echarts.init(document.getElementById('chart-group-model'));
  window._heatmapChart = chart;
  window._heatmapMode = 'calls';
  renderHeatmap(chart, 'calls');
  window.addEventListener('resize', () => chart.resize());
}

function renderHeatmap(chart, mode) {
  const source = mode === 'calls' ? GROUP_MODEL_HEATMAP : GROUP_MODEL_HEATMAP_TOKENS;
  const unit = mode === 'calls' ? '次' : 'K tokens';
  const maxVal = mode === 'calls' ? 70 : 140;
  const data = [];
  GROUPS.forEach((group, gi) => {
    MODELS.forEach((model, mi) => {
      data.push([mi, gi, source[gi][model]]);
    });
  });
  chart.setOption({
    tooltip: {
      formatter: (p) => `${GROUPS[p.value[1]]} - ${MODELS[p.value[0]]}: ${p.value[2]}${unit}`
    },
    grid: { left: 100, right: 60, top: 10, bottom: 30 },
    xAxis: { type: 'category', data: MODELS, position: 'bottom', axisLabel: { fontSize: 10 } },
    yAxis: { type: 'category', data: GROUPS, axisLabel: { fontSize: 11 } },
    visualMap: {
      min: 0, max: maxVal, calculable: true, orient: 'vertical', right: 0, top: 'center',
      inRange: { color: ['#e0e7ff', '#818cf8', '#4f6ef7', '#3730a3'] },
      textStyle: { fontSize: 10 }
    },
    series: [{
      type: 'heatmap',
      data: data,
      label: { show: true, fontSize: 10 },
      itemStyle: { borderColor: '#fff', borderWidth: 2, borderRadius: 3 }
    }]
  }, true);
}

function switchHeatmapMode(mode) {
  window._heatmapMode = mode;
  document.querySelectorAll('.heatmap-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  renderHeatmap(window._heatmapChart, mode);
}

function initTokenTrend() {
  const chart = echarts.init(document.getElementById('chart-token-trend'));
  chart.setOption({
    tooltip: { trigger: 'axis', formatter: (p) => `${p[0].axisValue}<br/>Token: ${(p[0].value / 1000).toFixed(1)}K` },
    grid: { left: 60, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: DATES_30.map(d => d.slice(5)),
      axisLabel: { fontSize: 10, interval: 4 }
    },
    yAxis: { type: 'value', axisLabel: { formatter: (v) => (v / 1000) + 'K' } },
    series: [{
      type: 'bar',
      data: TOKEN_TREND,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#818cf8' },
          { offset: 1, color: '#4f6ef7' }
        ]),
        borderRadius: [3, 3, 0, 0]
      },
      barWidth: 10
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

// ==================== v2 NEW CHARTS ====================

function initExportFormat() {
  const chart = echarts.init(document.getElementById('chart-export-format'));
  chart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    grid: { left: 60, right: 20, top: 8, bottom: 4 },
    xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%', fontSize: 9 } },
    yAxis: {
      type: 'category',
      data: QUALITY_EXTRA.exportFormatSplit.map(d => d.name).reverse(),
      axisLabel: { fontSize: 11 }
    },
    series: [{
      type: 'bar',
      data: QUALITY_EXTRA.exportFormatSplit.map(d => d.value).reverse(),
      itemStyle: {
        color: (params) => ['#a3a3a3', '#4f6ef7', '#10b981'][params.dataIndex],
        borderRadius: [0, 4, 4, 0]
      },
      barWidth: 14,
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 10 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initAgentDist() {
  const chart = echarts.init(document.getElementById('chart-agent-dist'));
  const colors = ['#4f6ef7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#a3a3a3'];
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { fontSize: 10 }, type: 'scroll' },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '42%'],
      data: AGENT_DISTRIBUTION.map((d, i) => ({
        ...d,
        itemStyle: { color: colors[i] }
      })),
      label: { formatter: '{b}\n{d}%', fontSize: 10 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initSkillTop5() {
  const chart = echarts.init(document.getElementById('chart-skill-top5'));
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 100, right: 30, top: 20, bottom: 20 },
    xAxis: { type: 'value', axisLabel: { fontSize: 10 } },
    yAxis: {
      type: 'category',
      data: SKILL_TOP5.map(d => d.name).reverse(),
      axisLabel: { fontSize: 11 }
    },
    series: [{
      type: 'bar',
      data: SKILL_TOP5.map(d => d.value).reverse(),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#10b981' },
          { offset: 1, color: '#34d399' }
        ]),
        borderRadius: [0, 4, 4, 0]
      },
      barWidth: 18,
      label: { show: true, position: 'right', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initFeatureTrend() {
  const chart = echarts.init(document.getElementById('chart-feature-trend'));
  // 模拟近 14 天深度模式 + 联网渗透率趋势
  const days = DATES_30.slice(-14).map(d => d.slice(5));
  const deepTrend = days.map((_, i) => 36 + Math.round(Math.sin(i / 3) * 3 + i * 0.4 + Math.random() * 3));
  const webTrend = days.map((_, i) => 60 + Math.round(Math.cos(i / 4) * 3 + i * 0.2 + Math.random() * 3));
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['深度模式', '联网'], textStyle: { fontSize: 10 }, top: 0, right: 4 },
    grid: { left: 35, right: 10, top: 24, bottom: 18 },
    xAxis: { type: 'category', data: days, axisLabel: { fontSize: 9, interval: 2 } },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%', fontSize: 9 } },
    series: [
      { name: '深度模式', type: 'line', data: deepTrend, smooth: true, symbol: 'none', lineStyle: { color: '#4f6ef7', width: 2 }, itemStyle: { color: '#4f6ef7' } },
      { name: '联网', type: 'line', data: webTrend, smooth: true, symbol: 'none', lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' } }
    ]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initOneShotTrend() {
  const chart = echarts.init(document.getElementById('chart-oneshot-trend'));
  chart.setOption({
    tooltip: { trigger: 'axis', formatter: (p) => `${p[0].axisValue}<br/>一次成功率: ${p[0].value}%` },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: DATES_30.map(d => d.slice(5)),
      axisLabel: { fontSize: 10, interval: 4 }
    },
    yAxis: { type: 'value', min: 50, max: 90, axisLabel: { formatter: '{value}%' } },
    series: [{
      type: 'line',
      data: TASK_EXPERIENCE.oneShotTrend,
      smooth: true,
      symbol: 'none',
      lineStyle: { color: '#4f6ef7', width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(79,110,247,0.3)' },
          { offset: 1, color: 'rgba(79,110,247,0.02)' }
        ])
      },
      markLine: {
        symbol: 'none',
        data: [{ yAxis: 70, name: '目标', lineStyle: { color: '#10b981', type: 'dashed' } }],
        label: { formatter: '目标 70%', fontSize: 10, color: '#10b981' }
      }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initClarificationReasons() {
  const chart = echarts.init(document.getElementById('chart-clarification-reasons'));
  chart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    series: [{
      type: 'pie',
      radius: ['38%', '62%'],
      center: ['50%', '50%'],
      data: TASK_EXPERIENCE.clarificationReasons.map((d, i) => ({
        ...d,
        itemStyle: { color: ['#ef4444', '#f59e0b', '#8b5cf6', '#a3a3a3'][i] }
      })),
      label: { formatter: '{b}\n{d}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}
