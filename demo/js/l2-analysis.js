// L2 Behavior Analysis Charts
function initL2Charts() {
  initChatModelDist();
  initChatRoundDist();
  initTimeHeatmap();
  initDeepseekTrend();
  initDeepseekFileTypes();
  initDeepseekSatisfaction();
  initMemoEditBehavior();
  initMemoSectionEdit();
  initUserMigration();
  initActivationFunnel();
}

function initChatModelDist() {
  const chart = echarts.init(document.getElementById('chart-chat-model'));
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '42%'],
      data: [
        { value: 45, name: 'Claude', itemStyle: { color: '#4f6ef7' } },
        { value: 30, name: 'ChatGPT', itemStyle: { color: '#10b981' } }
      ],
      label: { formatter: '{b}\n{d}%', fontSize: 12 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initChatRoundDist() {
  const chart = echarts.init(document.getElementById('chart-chat-rounds'));
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: CHAT_ROUND_DIST.map(d => d.range) },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [{
      type: 'bar',
      data: CHAT_ROUND_DIST.map(d => d.value),
      itemStyle: {
        color: (params) => ['#4f6ef7', '#818cf8', '#c7d2fe'][params.dataIndex],
        borderRadius: [6, 6, 0, 0]
      },
      barWidth: 48,
      label: { show: true, position: 'top', formatter: '{c}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initTimeHeatmap() {
  const chart = echarts.init(document.getElementById('chart-time-heatmap'));
  const hours = Array.from({ length: 24 }, (_, i) => i + ':00');
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  chart.setOption({
    tooltip: {
      formatter: (p) => `${days[p.value[1]]} ${hours[p.value[0]]}<br/>调用次数: ${p.value[2]}`
    },
    grid: { left: 50, right: 60, top: 10, bottom: 30 },
    xAxis: {
      type: 'category',
      data: hours,
      axisLabel: { fontSize: 9, interval: 2 },
      splitArea: { show: true }
    },
    yAxis: {
      type: 'category',
      data: days,
      axisLabel: { fontSize: 11 }
    },
    visualMap: {
      min: 0, max: 100, calculable: true, orient: 'vertical', right: 0, top: 'center',
      inRange: { color: ['#f8fafc', '#c7d2fe', '#818cf8', '#4f6ef7', '#3730a3'] },
      textStyle: { fontSize: 10 }
    },
    series: [{
      type: 'heatmap',
      data: TIME_HEATMAP,
      label: { show: false },
      itemStyle: { borderColor: '#fff', borderWidth: 1, borderRadius: 2 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initDeepseekTrend() {
  const chart = echarts.init(document.getElementById('chart-deepseek-trend'));
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: DATES_30.map(d => d.slice(5)),
      axisLabel: { fontSize: 10, interval: 4 }
    },
    yAxis: { type: 'value' },
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
  window.addEventListener('resize', () => chart.resize());
}

function initDeepseekFileTypes() {
  const chart = echarts.init(document.getElementById('chart-deepseek-files'));
  chart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['35%', '60%'],
      center: ['50%', '50%'],
      data: DEEPSEEK_FILE_TYPES.map((d, i) => ({
        ...d,
        itemStyle: { color: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'][i] }
      })),
      label: { formatter: '{b} {d}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initDeepseekSatisfaction() {
  const chart = echarts.init(document.getElementById('chart-deepseek-satisfaction'));
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 80, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    yAxis: { type: 'category', data: ['公有模型(Claude/GPT)', 'DeepSeek(私有化)'] },
    series: [{
      type: 'bar',
      data: [
        { value: DEEPSEEK_SATISFACTION.publicModelThumbsUp, itemStyle: { color: '#4f6ef7' } },
        { value: DEEPSEEK_SATISFACTION.thumbsUp, itemStyle: { color: '#10b981' } }
      ],
      barWidth: 24,
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 12 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initMemoEditBehavior() {
  const chart = echarts.init(document.getElementById('chart-memo-edit'));
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['38%', '62%'],
      center: ['50%', '42%'],
      data: IC_MEMO.editBehavior.map((d, i) => ({
        ...d,
        itemStyle: { color: ['#f59e0b', '#fbbf24', '#fde68a'][i] }
      })),
      label: { formatter: '{b}\n{d}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initMemoSectionEdit() {
  const chart = echarts.init(document.getElementById('chart-memo-sections'));
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 80, right: 30, top: 20, bottom: 30 },
    xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    yAxis: {
      type: 'category',
      data: IC_MEMO.sectionEditRate.map(d => d.section).reverse(),
      axisLabel: { fontSize: 11 }
    },
    series: [{
      type: 'bar',
      data: IC_MEMO.sectionEditRate.map(d => d.rate).reverse(),
      itemStyle: {
        color: (params) => {
          const rate = params.value;
          if (rate >= 60) return '#ef4444';
          if (rate >= 45) return '#f59e0b';
          return '#10b981';
        },
        borderRadius: [0, 4, 4, 0]
      },
      barWidth: 16,
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initUserMigration() {
  const chart = echarts.init(document.getElementById('chart-migration'));
  chart.setOption({
    tooltip: { trigger: 'item' },
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
        color: (params) => {
          const colors = {
            '上月高频': '#4f6ef7', '上月中频': '#818cf8', '上月低频': '#c7d2fe', '上月沉默': '#e2e8f0',
            '本月高频': '#4f6ef7', '本月中频': '#818cf8', '本月低频': '#c7d2fe', '本月沉默': '#e2e8f0'
          };
          return colors[params.name] || '#999';
        }
      },
      label: { fontSize: 11 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initActivationFunnel() {
  const chart = echarts.init(document.getElementById('chart-funnel'));
  chart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}人' },
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
      data: USER_SEGMENTS.funnel.map((d, i) => ({
        value: d.count,
        name: d.stage,
        itemStyle: { color: ['#4f6ef7', '#6366f1', '#818cf8', '#a5b4fc'][i] }
      }))
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}
