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
  // v2 新模块
  initFormFieldRate();
  initArtifactType();
  initLensTrend();
  initWelcomeCard();
  initSidebarNav();
  initSearchTarget();
  initMemoryDist();
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

// ==================== v2 NEW CHARTS ====================

function initFormFieldRate() {
  const chart = echarts.init(document.getElementById('chart-form-field-rate'));
  chart.setOption({
    tooltip: { trigger: 'axis', formatter: (p) => `${p[0].name}: ${p[0].value}%` },
    grid: { left: 130, right: 30, top: 20, bottom: 30 },
    xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    yAxis: {
      type: 'category',
      data: SKILL_FIELD_FILL_RATE.map(d => d.field).reverse(),
      axisLabel: { fontSize: 11 }
    },
    series: [{
      type: 'bar',
      data: SKILL_FIELD_FILL_RATE.map(d => d.rate).reverse(),
      itemStyle: {
        color: (params) => {
          const v = params.value;
          if (v >= 80) return '#10b981';
          if (v >= 60) return '#4f6ef7';
          if (v >= 40) return '#f59e0b';
          return '#ef4444';
        },
        borderRadius: [0, 4, 4, 0]
      },
      barWidth: 18,
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initArtifactType() {
  const chart = echarts.init(document.getElementById('chart-artifact-type'));
  const colors = ['#4f6ef7', '#10b981', '#f59e0b', '#8b5cf6', '#a3a3a3'];
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '42%'],
      data: ARTIFACT.byType.map((d, i) => ({
        ...d,
        itemStyle: { color: colors[i] }
      })),
      label: { formatter: '{b}\n{d}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initLensTrend() {
  const chart = echarts.init(document.getElementById('chart-lens-trend'));
  chart.setOption({
    tooltip: { trigger: 'axis', formatter: (p) => `${p[0].axisValue}<br/>存入 Lens 率: ${p[0].value}%` },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: DATES_30.map(d => d.slice(5)),
      axisLabel: { fontSize: 10, interval: 4 }
    },
    yAxis: { type: 'value', min: 30, max: 70, axisLabel: { formatter: '{value}%' } },
    series: [{
      type: 'line',
      data: ARTIFACT.lensSaveTrend,
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
  window.addEventListener('resize', () => chart.resize());
}

function initWelcomeCard() {
  const chart = echarts.init(document.getElementById('chart-welcome-card'));
  const data = ENTRY_DISCOVERY.welcomeCardConversion;
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['点击数', '完成任务数'], textStyle: { fontSize: 11 }, top: 0 },
    grid: { left: 100, right: 60, top: 30, bottom: 20 },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: data.map(d => d.card), axisLabel: { fontSize: 11 } },
    series: [
      {
        name: '点击数', type: 'bar',
        data: data.map(d => d.clicks),
        itemStyle: { color: '#c7d2fe', borderRadius: [0, 4, 4, 0] },
        barWidth: 14, barGap: '20%'
      },
      {
        name: '完成任务数', type: 'bar',
        data: data.map(d => d.completedTasks),
        itemStyle: { color: '#4f6ef7', borderRadius: [0, 4, 4, 0] },
        barWidth: 14,
        label: {
          show: true, position: 'right', fontSize: 11,
          formatter: (p) => {
            const item = data[p.dataIndex];
            return `${item.completedTasks} (${item.rate}%)`;
          }
        }
      }
    ]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initSidebarNav() {
  const chart = echarts.init(document.getElementById('chart-sidebar-nav'));
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 90, right: 50, top: 20, bottom: 20 },
    xAxis: { type: 'value' },
    yAxis: {
      type: 'category',
      data: ENTRY_DISCOVERY.sidebarNavPV.map(d => d.name).reverse(),
      axisLabel: { fontSize: 11 }
    },
    series: [{
      type: 'bar',
      data: ENTRY_DISCOVERY.sidebarNavPV.map(d => d.value).reverse(),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#4f6ef7' },
          { offset: 1, color: '#818cf8' }
        ]),
        borderRadius: [0, 4, 4, 0]
      },
      barWidth: 18,
      label: { show: true, position: 'right', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initSearchTarget() {
  const chart = echarts.init(document.getElementById('chart-search-target'));
  chart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '50%'],
      data: ENTRY_DISCOVERY.globalSearch.targetSplit.map((d, i) => ({
        ...d,
        itemStyle: { color: ['#4f6ef7', '#10b981'][i] }
      })),
      label: { formatter: '{b}\n{d}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initMemoryDist() {
  const chart = echarts.init(document.getElementById('chart-memory-dist'));
  chart.setOption({
    tooltip: { trigger: 'axis', formatter: (p) => `${p[0].name}: ${p[0].value}% 用户` },
    grid: { left: 30, right: 10, top: 12, bottom: 22 },
    xAxis: {
      type: 'category',
      data: ENTRY_DISCOVERY.memory.distribution.map(d => d.range),
      axisLabel: { fontSize: 9 }
    },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%', fontSize: 9 } },
    series: [{
      type: 'bar',
      data: ENTRY_DISCOVERY.memory.distribution.map(d => d.value),
      itemStyle: {
        color: (params) => ['#e2e8f0', '#a7f3d0', '#34d399', '#10b981'][params.dataIndex],
        borderRadius: [3, 3, 0, 0]
      },
      barWidth: 22
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

// ==================== v2 HTML / Table 渲染 ====================

function renderL2Extras() {
  renderHtmlFunnel('funnel-skill-form', SKILL_FORM_FUNNEL, 'count', { showConv: true });
  renderHtmlFunnel('funnel-mcp-auth', MCP_AUTH_FUNNEL, 'count', { showConv: true, color: 'warning' });
  renderHtmlFunnel('funnel-artifact', ARTIFACT.funnel, 'count', { showConv: true, color: 'success' });
  renderRatioByField();
  renderMcpBlockers();
}

function renderHtmlFunnel(containerId, data, valueKey, opts) {
  const container = document.getElementById(containerId);
  if (!container) return;
  opts = opts || {};
  const max = Math.max(...data.map(d => d[valueKey]));
  const colorClass = opts.color === 'success' ? 'success' : opts.color === 'warning' ? 'warning' : '';
  container.innerHTML = data.map((d, i) => {
    const pct = Math.round((d[valueKey] / max) * 100);
    const conv = i === 0 ? '—' : `${Math.round((d[valueKey] / data[i - 1][valueKey]) * 100)}%`;
    return `
      <div class="step">
        <span class="step-label">${d.stage}</span>
        <div class="step-bar-wrap">
          <div class="step-bar ${colorClass}" style="width: ${pct}%"></div>
          <span class="step-value">${d[valueKey]}</span>
        </div>
        ${opts.showConv ? `<span class="step-conv">${conv}</span>` : ''}
      </div>
    `;
  }).join('');
}

function renderRatioByField() {
  const container = document.getElementById('ratio-by-field');
  if (!container) return;
  container.innerHTML = ASSET_REUSE.byField.map(row => `
    <div class="field-row">
      <span class="field-name">${row.field}</span>
      <div class="field-bar">
        <div class="ratio-segment kb" style="flex: ${row.kb};">${row.kb}%</div>
        <div class="ratio-segment upload" style="flex: ${row.upload};">${row.upload}%</div>
      </div>
    </div>
  `).join('');
}

function renderMcpBlockers() {
  const tbody = document.getElementById('mcp-blockers-tbody');
  if (!tbody) return;
  tbody.innerHTML = MCP_BLOCKERS.map(m => {
    const cls = m.blockRate >= 60 ? 'high' : m.blockRate >= 40 ? 'mid' : 'low';
    return `
      <tr>
        <td class="mcp-name">${m.name}</td>
        <td style="text-align: right;">${m.prompts}</td>
        <td style="text-align: right;">${m.completed}</td>
        <td style="text-align: right;" class="block-rate ${cls}">${m.blockRate}%</td>
      </tr>
    `;
  }).join('');
}
