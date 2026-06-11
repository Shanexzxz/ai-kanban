// L1 Overview Charts (v3 Enhanced)
// Common tooltip & axis styles are defined in index.html inline script

function initL1Charts() {
  // 1.1-1.3 活跃 / 留存 / 深度
  initPenetrationChart();
  initDAUTrend();
  initRetentionChart();
  initSessionLengthDist();
  initFrequencyDist();
  // 1.3b 会话行为
  initNewSessionTrend();
  initSessionRevisitSpan();
  // 1.5b 首页流量分发
  initHomeFlow();
  // 1.6 用户主观体验
  initQualityTrend();
  initModelSatisfaction();
  // 1.7 模型与智能体使用（含原 L2.1 时段热力图）
  // 功能使用占比饼图已删除（与智能体调用分布语义重叠）
  initModelDist();
  initAgentDist();
  initSkillTop5();
  initFeatureTrend();
  initModelTrend();
  initGroupModelHeatmap();
  if (typeof initTimeHeatmap === 'function') initTimeHeatmap();
  // 1.7b 技能与连接器装配
  initSkillSourceChart();
  // D5 记忆模块
  initMemoryType();
  initMemorySource();
  initMemoryActions();
  // 1.8 用户输入形态（迁自 L2.2）
  if (typeof initDeepseekFileTypes === 'function') initDeepseekFileTypes();
  if (typeof initInputFormDist === 'function') initInputFormDist();
  // 1.9 信息库使用情况
  if (typeof initKbTrend === 'function') initKbTrend();
  // 1.11 Artifact 沉淀
  if (typeof initArtifactType === 'function') initArtifactType();
  if (typeof initKbSaveTrend === 'function') initKbSaveTrend();
  // 已下线但函数仍存在 — null guard 内部安全 return
  initExportFormat();
  initTokenTrend();
  initTokenGauge();
  initOneShotTrend();
  initClarificationReasons();
  // 4.5 Token 用量与费用
  initTokenUsage();
  // 4.6 分组 Token 预算看板
  initTokenBudget();
}

// D5 记忆模块：类型分布（事实 vs 摘要）
function initMemoryType() {
  const __el = document.getElementById('chart-memory-type');
  if (!__el) return;
  const chart = echarts.init(__el);
  const total = MEMORY_MODULE.byType.reduce(function(s, d){ return s + d.value; }, 0);
  const colors = ['#4f6ef7', '#10b981'];
  chart.setOption({
    tooltip: Object.assign({
      trigger: 'item',
      formatter: function(p) {
        var pct = ((p.value / total) * 100).toFixed(1);
        return p.name + '<br/>' + p.value + ' 条 · ' + pct + '%';
      }
    }, COMMON_TOOLTIP),
    legend: Object.assign({ bottom: 0 }, getChartLegendStyle()),
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      data: MEMORY_MODULE.byType.map(function(d, i){
        return Object.assign({}, d, { itemStyle: { color: colors[i] } });
      }),
      label: { formatter: '{b}\n{d}%', fontSize: 11, color: '#334155' }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// D5 记忆模块：来源分布（自动 vs 手动）
function initMemorySource() {
  const __el = document.getElementById('chart-memory-source');
  if (!__el) return;
  const chart = echarts.init(__el);
  const total = MEMORY_MODULE.bySource.reduce(function(s, d){ return s + d.value; }, 0);
  const colors = ['#10b981', '#f59e0b'];
  chart.setOption({
    tooltip: Object.assign({
      trigger: 'item',
      formatter: function(p) {
        var pct = ((p.value / total) * 100).toFixed(1);
        return p.name + '<br/>' + p.value + ' 条 · ' + pct + '%';
      }
    }, COMMON_TOOLTIP),
    legend: Object.assign({ bottom: 0 }, getChartLegendStyle()),
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      data: MEMORY_MODULE.bySource.map(function(d, i){
        return Object.assign({}, d, { itemStyle: { color: colors[i] } });
      }),
      label: { formatter: '{b}\n{d}%', fontSize: 11, color: '#334155' }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// D5 记忆模块：用户管理行为分布（横向条形图）
function initMemoryActions() {
  const __el = document.getElementById('chart-memory-actions');
  if (!__el) return;
  const chart = echarts.init(__el);
  const axisStyle = getChartAxisStyle();
  const sorted = MEMORY_MODULE.actions.slice().sort(function(a, b){ return a.value - b.value; });
  const colorMap = {
    '查看记忆': '#4f6ef7',
    '搜索记忆': '#818cf8',
    '编辑记忆': '#f59e0b',
    '删除记忆': '#ef4444',
    '手动添加事实': '#10b981',
    '导入/导出': '#94a3b8'
  };
  chart.setOption({
    tooltip: Object.assign({
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      valueFormatter: function(v){ return v + ' 次'; }
    }, COMMON_TOOLTIP),
    grid: { left: 130, right: 60, top: 10, bottom: 30 },
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

// 1.7b 技能装配：Skill Hub vs 自定义 启用/禁用 堆叠条
function initSkillSourceChart() {
  const __el = document.getElementById('chart-skill-source');
  if (!__el) return;
  const chart = echarts.init(__el);
  const axisStyle = getChartAxisStyle();
  const sources = SKILL_ASSEMBLY.map(function(d){ return d.source; });
  const enabledData = SKILL_ASSEMBLY.map(function(d){ return d.enabled; });
  const disabledData = SKILL_ASSEMBLY.map(function(d){ return d.disabled; });
  chart.setOption({
    tooltip: Object.assign({
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        var idx = params[0].dataIndex;
        var item = SKILL_ASSEMBLY[idx];
        var rate = ((item.enabled / item.added) * 100).toFixed(0);
        return '<b>' + item.source + '</b><br/>' +
               '添加: ' + item.added + '<br/>' +
               '<span style="color:#10b981">●</span> 启用: ' + item.enabled + ' (' + rate + '%)<br/>' +
               '<span style="color:#94a3b8">●</span> 禁用: ' + item.disabled;
      }
    }, COMMON_TOOLTIP),
    legend: Object.assign({ top: 0, data: ['启用', '禁用'] }, getChartLegendStyle()),
    grid: { left: 90, right: 50, top: 40, bottom: 30 },
    xAxis: Object.assign({ type: 'value', axisLabel: { fontSize: 11, color: '#334155', fontWeight: 500 } }, axisStyle),
    yAxis: {
      type: 'category',
      data: sources,
      axisLabel: { fontSize: 12, color: '#1e293b', fontWeight: 500 },
      axisLine: axisStyle.axisLine,
      splitLine: { show: false }
    },
    series: [
      {
        name: '启用',
        type: 'bar',
        stack: 'total',
        data: enabledData,
        itemStyle: { color: '#10b981', borderRadius: [4, 0, 0, 4] },
        label: { show: true, position: 'inside', fontSize: 11, color: '#fff', fontWeight: 600 },
        barWidth: 26
      },
      {
        name: '禁用',
        type: 'bar',
        stack: 'total',
        data: disabledData,
        itemStyle: { color: '#cbd5e1', borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'inside', fontSize: 11, color: '#475569', fontWeight: 600 }
      }
    ]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// 1.3b 会话行为：每日新会话发起趋势
function initNewSessionTrend() {
  const __el = document.getElementById('chart-new-session-trend');
  if (!__el) return;
  const chart = echarts.init(__el);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', valueFormatter: function(v){ return v + ' 个新会话'; } }, COMMON_TOOLTIP),
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: Object.assign({
      type: 'category',
      data: DATES_30.map(function(d){ return d.slice(5); }),
      axisLabel: { fontSize: 10, interval: 4, color: '#334155', fontWeight: 500 }
    }, axisStyle),
    yAxis: Object.assign({ type: 'value', name: '新会话数', nameTextStyle: { fontSize: 11, color: '#64748b' } }, axisStyle),
    series: [{
      type: 'line',
      data: NEW_SESSION_TREND,
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0,0,0,1,[
          {offset:0,color:'rgba(79,110,247,0.3)'},{offset:1,color:'rgba(79,110,247,0.02)'}
        ])
      },
      lineStyle: { color: '#4f6ef7', width: 2 },
      itemStyle: { color: '#4f6ef7' },
      symbol: 'none'
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// 1.3b 会话行为：续聊跨度分布
function initSessionRevisitSpan() {
  const __el = document.getElementById('chart-session-revisit-span');
  if (!__el) return;
  const chart = echarts.init(__el);
  const axisStyle = getChartAxisStyle();
  const colors = ['#4f6ef7', '#818cf8', '#a78bfa', '#c4b5fd', '#cbd5e1'];
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: function(v){ return v + '%'; } }, COMMON_TOOLTIP),
    grid: { left: 50, right: 30, top: 20, bottom: 40 },
    xAxis: Object.assign({
      type: 'category',
      data: SESSION_REVISIT_SPAN.map(function(d){ return d.name; }),
      axisLabel: { fontSize: 11, color: '#334155', fontWeight: 500, interval: 0 }
    }, axisStyle),
    yAxis: Object.assign({ type: 'value', max: 50, axisLabel: { formatter: '{value}%' } }, axisStyle),
    series: [{
      type: 'bar',
      data: SESSION_REVISIT_SPAN.map(function(d, i){
        return { value: d.value, itemStyle: { color: colors[i], borderRadius: [4, 4, 0, 0] } };
      }),
      barWidth: 36,
      label: { show: true, position: 'top', formatter: '{c}%', fontSize: 11, color: '#334155', fontWeight: 600 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// 首页流量分发（每 100 次首页访问的去向占比）
function initHomeFlow() {
  const __el = document.getElementById('chart-home-flow');
  if (!__el) return;
  const chart = echarts.init(__el);
  const axisStyle = getChartAxisStyle();
  // 按 share 升序（横向条形图从下到上）
  const sorted = HOME_FLOW.destinations.slice().sort(function(a, b){ return a.share - b.share; });
  // 内部 vs 外部 配色：内部蓝色渐变，外部紫色渐变 + 标记
  const internalColor = new echarts.graphic.LinearGradient(0,0,1,0,[
    {offset:0,color:'#4f6ef7'},{offset:1,color:'#818cf8'}
  ]);
  const externalColor = new echarts.graphic.LinearGradient(0,0,1,0,[
    {offset:0,color:'#a78bfa'},{offset:1,color:'#c4b5fd'}
  ]);
  chart.setOption({
    tooltip: Object.assign({
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function(p) {
        var item = p[0];
        var d = sorted[item.dataIndex];
        var typeLabel = d.type === 'external' ? '↗ 外部跳转' : '内部页面';
        return d.icon + ' ' + d.name + '<br/>' +
               '占比: <b>' + d.share + '%</b><br/>' +
               '类型: ' + typeLabel;
      }
    }, COMMON_TOOLTIP),
    grid: { left: 170, right: 70, top: 10, bottom: 30 },
    xAxis: Object.assign({
      type: 'value',
      max: 50,
      axisLabel: { formatter: '{value}%', fontSize: 11, color: '#334155', fontWeight: 500 }
    }, axisStyle),
    yAxis: {
      type: 'category',
      data: sorted.map(function(d){
        var arrow = d.type === 'external' ? ' ↗' : '';
        return d.icon + ' ' + d.name + arrow;
      }),
      axisLabel: { fontSize: 12, color: '#1e293b', fontWeight: 500 },
      axisLine: axisStyle.axisLine,
      splitLine: { show: false }
    },
    series: [{
      type: 'bar',
      data: sorted.map(function(d){
        return {
          value: d.share,
          itemStyle: {
            color: d.type === 'external' ? externalColor : internalColor,
            borderRadius: [0, 4, 4, 0]
          }
        };
      }),
      barWidth: 20,
      label: {
        show: true,
        position: 'right',
        formatter: '{c}%',
        fontSize: 12,
        color: '#334155',
        fontWeight: 600
      }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// 4 模型好评率横向对比（原 L2.2 满意度对比挪过来）
function initModelSatisfaction() {
  if (typeof initDeepseekSatisfaction === 'function') initDeepseekSatisfaction();
}

// 好评率趋势（30 天日度）
function initQualityTrend() {
  const __el = document.getElementById('chart-quality-trend');
  if (!__el) return;
  const chart = echarts.init(__el);
  const axisStyle = getChartAxisStyle();
  const data = DATES_30.map(function(){ return (Math.random() * 6 + 75).toFixed(1); });
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', valueFormatter: function(v){ return v + '%'; } }, COMMON_TOOLTIP),
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: Object.assign({
      type: 'category',
      data: DATES_30.map(function(d){ return d.slice(5); }),
      axisLabel: { fontSize: 10, interval: 4, color: '#334155', fontWeight: 500 }
    }, axisStyle),
    yAxis: Object.assign({ type: 'value', min: 60, max: 90, axisLabel: { formatter: '{value}%' } }, axisStyle),
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

function initPenetrationChart() {
  const __el_chart_group_penetration = document.getElementById('chart-group-penetration');
  if (!__el_chart_group_penetration) return;
  const chart = echarts.init(__el_chart_group_penetration);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' } }, COMMON_TOOLTIP),
    grid: { left: 110, right: 30, top: 20, bottom: 30 },
    xAxis: Object.assign({ type: 'value', max: 100, axisLabel: { formatter: '{value}%' } }, axisStyle),
    yAxis: {
      type: 'category',
      data: Object.keys(GROUP_PENETRATION).reverse(),
      axisLabel: { fontSize: 12, color: '#1e293b', fontWeight: 500 },
      axisLine: axisStyle.axisLine,
      splitLine: { show: false }
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
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 12, color: '#334155', fontWeight: 600 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initDAUTrend() {
  const __el_chart_dau_trend = document.getElementById('chart-dau-trend');
  if (!__el_chart_dau_trend) return;
  const chart = echarts.init(__el_chart_dau_trend);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis' }, COMMON_TOOLTIP),
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: Object.assign({
      type: 'category',
      data: DATES_30.map(function(d) { return d.slice(5); }),
      axisLabel: { fontSize: 10, interval: 4, color: '#334155', fontWeight: 500 }
    }, axisStyle),
    yAxis: Object.assign({ type: 'value', min: 15 }, axisStyle),
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
  window.addEventListener('resize', function() { chart.resize(); });
}

function initRetentionChart() {
  const __el_chart_retention = document.getElementById('chart-retention');
  if (!__el_chart_retention) return;
  const chart = echarts.init(__el_chart_retention);
  const axisStyle = getChartAxisStyle();
  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];
  const overallData = weeks.map(function(_, i) { return Math.round(100 * Math.pow(0.92, i + 1)); });
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', formatter: '{b}: {c}%' }, COMMON_TOOLTIP),
    grid: { left: 50, right: 20, top: 30, bottom: 30 },
    xAxis: Object.assign({ type: 'category', data: weeks }, axisStyle),
    yAxis: Object.assign({ type: 'value', max: 100, axisLabel: { formatter: '{value}%' } }, axisStyle),
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
        label: { formatter: function(p) { return p.value + '%'; }, fontSize: 11, position: 'top' }
      }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initSessionLengthDist() {
  const __el_chart_session_length = document.getElementById('chart-session-length');
  if (!__el_chart_session_length) return;
  const chart = echarts.init(__el_chart_session_length);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis' }, COMMON_TOOLTIP),
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: Object.assign({ type: 'category', data: SESSION_LENGTH_DIST.map(function(d) { return d.range; }) }, axisStyle),
    yAxis: Object.assign({ type: 'value' }, axisStyle),
    series: [{
      type: 'bar',
      data: SESSION_LENGTH_DIST.map(function(d) { return d.count; }),
      itemStyle: {
        color: function(params) {
          var colors = ['#4f6ef7', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];
          return colors[params.dataIndex] || colors[0];
        },
        borderRadius: [4, 4, 0, 0]
      },
      barWidth: 32
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// Changed from pie to horizontal bar chart
function initFrequencyDist() {
  const __el_chart_frequency = document.getElementById('chart-frequency');
  if (!__el_chart_frequency) return;
  const chart = echarts.init(__el_chart_frequency);
  const axisStyle = getChartAxisStyle();
  const freqData = USAGE_DEPTH.userFrequency;
  const names = ['低频(<每周)', '中频(每周)', '高频(每日)'];
  const values = [freqData.low, freqData.medium, freqData.high];
  const colors = ['#c7d2fe', '#818cf8', '#4f6ef7'];

  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function(p) { return p[0].name + ': ' + p[0].value + '%'; } }, COMMON_TOOLTIP),
    grid: { left: 90, right: 30, top: 20, bottom: 20 },
    xAxis: Object.assign({ type: 'value', max: 60, axisLabel: { formatter: '{value}%' } }, axisStyle),
    yAxis: {
      type: 'category',
      data: names,
      axisLabel: { fontSize: 12, color: '#334155', fontWeight: 500 },
      axisLine: axisStyle.axisLine,
      splitLine: { show: false }
    },
    series: [{
      type: 'bar',
      data: values.map(function(v, i) {
        return { value: v, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: colors[i] },
          { offset: 1, color: colors[i].replace('fe', 'ff').replace('cf', 'ef') }
        ]), borderRadius: [0, 4, 4, 0] } };
      }),
      barWidth: 22,
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 11, color: '#64748b' }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initExportFormat() {
  const __el_chart_export_format = document.getElementById('chart-export-format');
  if (!__el_chart_export_format) return;
  const chart = echarts.init(__el_chart_export_format);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'item', formatter: '{b}: {c}%' }, COMMON_TOOLTIP),
    grid: { left: 60, right: 20, top: 8, bottom: 4 },
    xAxis: Object.assign({ type: 'value', max: 100, axisLabel: { formatter: '{value}%', fontSize: 9 } }, axisStyle),
    yAxis: {
      type: 'category',
      data: QUALITY_EXTRA.exportFormatSplit.map(function(d) { return d.name; }).reverse(),
      axisLabel: { fontSize: 11, color: '#334155', fontWeight: 500 },
      axisLine: axisStyle.axisLine,
      splitLine: { show: false }
    },
    series: [{
      type: 'bar',
      data: QUALITY_EXTRA.exportFormatSplit.map(function(d) { return d.value; }).reverse(),
      itemStyle: {
        color: function(params) { return ['#a3a3a3', '#4f6ef7', '#10b981'][params.dataIndex]; },
        borderRadius: [0, 4, 4, 0]
      },
      barWidth: 14,
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 10, color: '#64748b' }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initFunctionDist() {
  const __el_chart_function_dist = document.getElementById('chart-function-dist');
  if (!__el_chart_function_dist) return;
  const chart = echarts.init(__el_chart_function_dist);
  const legendStyle = getChartLegendStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'item' }, COMMON_TOOLTIP),
    legend: Object.assign({ bottom: 0 }, legendStyle),
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '42%'],
      data: FUNCTION_DISTRIBUTION.map(function(d, i) {
        return Object.assign({}, d, { itemStyle: { color: ['#4f6ef7', '#f59e0b'][i] } });
      }),
      label: { formatter: '{b}\n{d}%', fontSize: 12 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initModelDist() {
  const __el_chart_model_dist = document.getElementById('chart-model-dist');
  if (!__el_chart_model_dist) return;
  const chart = echarts.init(__el_chart_model_dist);
  const colors = ['#4f6ef7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  const legendStyle = getChartLegendStyle();
  const data = Object.entries(MODEL_DISTRIBUTION.calls).map(function(entry, i) {
    return { name: entry[0], value: entry[1], itemStyle: { color: colors[i] } };
  });
  chart.setOption({
    tooltip: Object.assign({ trigger: 'item' }, COMMON_TOOLTIP),
    legend: Object.assign({ bottom: 0 }, legendStyle),
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '40%'],
      data: data,
      label: { formatter: '{b}\n{d}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initModelTypeSplit() {
  const __el_chart_model_type = document.getElementById('chart-model-type');
  if (!__el_chart_model_type) return;
  const chart = echarts.init(__el_chart_model_type);
  chart.setOption({
    tooltip: Object.assign({ trigger: 'item' }, COMMON_TOOLTIP),
    series: [{
      type: 'pie',
      radius: ['45%', '68%'],
      center: ['50%', '45%'],
      data: [
        { value: MODEL_TYPE_SPLIT.reasoning.value, name: '推理增强型', itemStyle: { color: '#4f6ef7' } },
        { value: MODEL_TYPE_SPLIT.general.value, name: '通用对话型', itemStyle: { color: '#10b981' } }
      ],
      label: { formatter: '{b}\n{d}%', fontSize: 12 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initModelTrend() {
  const __el_chart_model_trend = document.getElementById('chart-model-trend');
  if (!__el_chart_model_trend) return;
  const chart = echarts.init(__el_chart_model_trend);
  const axisStyle = getChartAxisStyle();
  const legendStyle = getChartLegendStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis' }, COMMON_TOOLTIP),
    legend: Object.assign({ data: MODELS, bottom: 0 }, legendStyle),
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: Object.assign({
      type: 'category',
      data: DATES_30.map(function(d) { return d.slice(5); }),
      axisLabel: { fontSize: 10, interval: 4, color: '#334155', fontWeight: 500 }
    }, axisStyle),
    yAxis: Object.assign({ type: 'value' }, axisStyle),
    series: MODELS.map(function(model, i) {
      return {
        name: model,
        type: 'line',
        stack: 'total',
        smooth: true,
        areaStyle: { opacity: 0.4 },
        data: MODEL_TREND.map(function(d) { return d[model]; }),
        lineStyle: { width: 1.5 },
        itemStyle: { color: ['#4f6ef7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][i] },
        symbol: 'none'
      };
    })
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initGroupModelHeatmap() {
  const __el_chart_group_model = document.getElementById('chart-group-model');
  if (!__el_chart_group_model) return;
  const chart = echarts.init(__el_chart_group_model);
  window._heatmapChart = chart;
  window._heatmapMode = 'calls';
  renderHeatmap(chart, 'calls');
  window.addEventListener('resize', function() { chart.resize(); });
}

function renderHeatmap(chart, mode) {
  const source = mode === 'calls' ? GROUP_MODEL_HEATMAP : GROUP_MODEL_HEATMAP_TOKENS;
  const unit = mode === 'calls' ? '次' : 'K tokens';
  const maxVal = mode === 'calls' ? 70 : 140;
  const data = [];
  const axisStyle = getChartAxisStyle();
  GROUPS.forEach(function(group, gi) {
    MODELS.forEach(function(model, mi) {
      data.push([mi, gi, source[gi][model]]);
    });
  });
  chart.setOption({
    tooltip: Object.assign({
      formatter: function(p) { return GROUPS[p.value[1]] + ' - ' + MODELS[p.value[0]] + ': ' + p.value[2] + unit; }
    }, COMMON_TOOLTIP),
    grid: { left: 100, right: 60, top: 10, bottom: 30 },
    xAxis: { type: 'category', data: MODELS, position: 'bottom', axisLabel: { fontSize: 10, color: axisStyle.axisLabel.color } },
    yAxis: { type: 'category', data: GROUPS, axisLabel: { fontSize: 11, color: axisStyle.axisLabel.color } },
    visualMap: {
      min: 0, max: maxVal, calculable: true, orient: 'vertical', right: 0, top: 'center',
      inRange: { color: ['#e0e7ff', '#818cf8', '#4f6ef7', '#3730a3'] },
      textStyle: { fontSize: 10, color: axisStyle.axisLabel.color }
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
  document.querySelectorAll('.heatmap-toggle-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  renderHeatmap(window._heatmapChart, mode);
}

function initTokenTrend() {
  const __el_chart_token_trend = document.getElementById('chart-token-trend');
  if (!__el_chart_token_trend) return;
  const chart = echarts.init(__el_chart_token_trend);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', formatter: function(p) { return p[0].axisValue + '<br/>Token: ' + (p[0].value / 1000).toFixed(1) + 'K'; } }, COMMON_TOOLTIP),
    grid: { left: 60, right: 20, top: 20, bottom: 30 },
    xAxis: Object.assign({
      type: 'category',
      data: DATES_30.map(function(d) { return d.slice(5); }),
      axisLabel: { fontSize: 10, interval: 4, color: '#334155', fontWeight: 500 }
    }, axisStyle),
    yAxis: Object.assign({ type: 'value', axisLabel: { formatter: function(v) { return (v / 1000) + 'K'; } } }, axisStyle),
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
  window.addEventListener('resize', function() { chart.resize(); });
}

// NEW: Token consumption gauge chart (replaces static HTML)
function initTokenGauge() {
  const el = document.getElementById('chart-token-gauge');
  if (!el) return; // P1 后续：Token 拆分已迁出 L1
  const chart = echarts.init(el);
  const totalTokens = 2400; // 2.4M in K
  const modelData = [
    { name: 'DeepSeek-V3.5', value: 42, color: '#4f6ef7' },
    { name: '混元 Turbo', value: 24, color: '#10b981' },
    { name: 'GLM-4.6', value: 20, color: '#f59e0b' },
    { name: 'Kimi K2', value: 14, color: '#8b5cf6' }
  ];

  chart.setOption({
    tooltip: Object.assign({
      formatter: function(p) {
        if (p.seriesType === 'gauge') {
          return 'Token 总消耗: 2.4M';
        }
        return p.name + ': ' + p.value + '%';
      }
    }, COMMON_TOOLTIP),
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        center: ['50%', '55%'],
        radius: '85%',
        min: 0,
        max: 100,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 20,
            color: modelData.map(function(d) {
              return [(modelData.slice(0, modelData.indexOf(d) + 1).reduce(function(s, m) { return s + m.value; }, 0)) / 100, d.color];
            })
          }
        },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          offsetCenter: [0, '-10%'],
          formatter: '2.4M',
          fontSize: 36,
          fontWeight: 700,
          color: '#4f6ef7'
        },
        title: {
          offsetCenter: [0, '15%'],
          fontSize: 13,
          color: '#64748b'
        },
        data: [{ value: 100, name: '近30天 Token 总消耗' }]
      }
    ],
    // Add model legend below
    graphic: modelData.map(function(d, i) {
      var col = i < 3 ? 0 : 1;
      var row = i < 3 ? i : i - 3;
      var xBase = col === 0 ? 20 : 52;
      var yBase = 82;
      return {
        type: 'group',
        left: xBase + '%',
        top: (yBase + row * 8) + '%',
        children: [
          {
            type: 'rect',
            shape: { width: 10, height: 10, r: 2 },
            style: { fill: d.color }
          },
          {
            type: 'text',
            style: {
              text: d.name + ' ' + d.value + '%',
              x: 16,
              y: 8,
              fontSize: 11,
              fontWeight: 500,
              fill: '#64748b',
              textAlign: 'left'
            }
          }
        ]
      };
    })
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// ==================== v2 NEW CHARTS ====================

function initAgentDist() {
  const __el_chart_agent_dist = document.getElementById('chart-agent-dist');
  if (!__el_chart_agent_dist) return;
  const chart = echarts.init(__el_chart_agent_dist);
  const colors = ['#4f6ef7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#a3a3a3'];
  const legendStyle = getChartLegendStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'item' }, COMMON_TOOLTIP),
    legend: Object.assign({ bottom: 0, textStyle: { fontSize: 10 }, type: 'scroll' }, legendStyle),
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '42%'],
      data: AGENT_DISTRIBUTION.map(function(d, i) {
        return Object.assign({}, d, { itemStyle: { color: colors[i] } });
      }),
      label: { formatter: '{b}\n{d}%', fontSize: 10 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initSkillTop5() {
  const __el_chart_skill_top5 = document.getElementById('chart-skill-top5');
  if (!__el_chart_skill_top5) return;
  const chart = echarts.init(__el_chart_skill_top5);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' } }, COMMON_TOOLTIP),
    grid: { left: 110, right: 40, top: 20, bottom: 20 },
    xAxis: Object.assign({ type: 'value', axisLabel: { fontSize: 11, color: '#334155', fontWeight: 500 } }, axisStyle),
    yAxis: {
      type: 'category',
      data: SKILL_TOP5.map(function(d) { return d.name; }).reverse(),
      axisLabel: { fontSize: 12, color: '#1e293b', fontWeight: 500 },
      axisLine: axisStyle.axisLine,
      splitLine: { show: false }
    },
    series: [{
      type: 'bar',
      data: SKILL_TOP5.map(function(d) { return d.value; }).reverse(),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#10b981' },
          { offset: 1, color: '#34d399' }
        ]),
        borderRadius: [0, 4, 4, 0]
      },
      barWidth: 18,
      label: { show: true, position: 'right', fontSize: 12, color: '#334155', fontWeight: 600 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initFeatureTrend() {
  const __el_chart_feature_trend = document.getElementById('chart-feature-trend');
  if (!__el_chart_feature_trend) return;
  const chart = echarts.init(__el_chart_feature_trend);
  const axisStyle = getChartAxisStyle();
  const legendStyle = getChartLegendStyle();
  const days = DATES_30.slice(-14).map(function(d) { return d.slice(5); });
  const deepTrend = days.map(function(_, i) { return 36 + Math.round(Math.sin(i / 3) * 3 + i * 0.4 + Math.random() * 3); });
  const webTrend = days.map(function(_, i) { return 60 + Math.round(Math.cos(i / 4) * 3 + i * 0.2 + Math.random() * 3); });
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis' }, COMMON_TOOLTIP),
    legend: Object.assign({ data: ['深度模式', '联网'], top: 0, right: 4 }, legendStyle),
    grid: { left: 35, right: 10, top: 24, bottom: 18 },
    xAxis: Object.assign({ type: 'category', data: days, axisLabel: { fontSize: 9, interval: 2, color: '#334155', fontWeight: 500 } }, axisStyle),
    yAxis: Object.assign({ type: 'value', axisLabel: { formatter: '{value}%', fontSize: 9 } }, axisStyle),
    series: [
      { name: '深度模式', type: 'line', data: deepTrend, smooth: true, symbol: 'none', lineStyle: { color: '#4f6ef7', width: 2 }, itemStyle: { color: '#4f6ef7' } },
      { name: '联网', type: 'line', data: webTrend, smooth: true, symbol: 'none', lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' } }
    ]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

function initOneShotTrend() {
  const __el_chart_oneshot_trend = document.getElementById('chart-oneshot-trend');
  if (!__el_chart_oneshot_trend) return;
  const chart = echarts.init(__el_chart_oneshot_trend);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', formatter: function(p) { return p[0].axisValue + '<br/>一次成功率: ' + p[0].value + '%'; } }, COMMON_TOOLTIP),
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: Object.assign({
      type: 'category',
      data: DATES_30.map(function(d) { return d.slice(5); }),
      axisLabel: { fontSize: 10, interval: 4, color: '#334155', fontWeight: 500 }
    }, axisStyle),
    yAxis: Object.assign({ type: 'value', min: 50, max: 90, axisLabel: { formatter: '{value}%' } }, axisStyle),
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
  window.addEventListener('resize', function() { chart.resize(); });
}

function initClarificationReasons() {
  const __el_chart_clarification_reasons = document.getElementById('chart-clarification-reasons');
  if (!__el_chart_clarification_reasons) return;
  const chart = echarts.init(__el_chart_clarification_reasons);
  chart.setOption({
    tooltip: Object.assign({ trigger: 'item', formatter: '{b}: {c}%' }, COMMON_TOOLTIP),
    series: [{
      type: 'pie',
      radius: ['38%', '62%'],
      center: ['50%', '50%'],
      data: TASK_EXPERIENCE.clarificationReasons.map(function(d, i) {
        return Object.assign({}, d, { itemStyle: { color: ['#ef4444', '#f59e0b', '#8b5cf6', '#a3a3a3'][i] } });
      }),
      label: { formatter: '{b}\n{d}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}

// 4.5 Token 用量与费用表格渲染
function initTokenUsage() {
  // 概览指标卡
  var elCost = document.getElementById('token-total-cost');
  var elTokens = document.getElementById('token-total-tokens');
  var elAvgCost = document.getElementById('token-avg-cost');
  var elAvgTokens = document.getElementById('token-avg-tokens');
  if (!elCost || !elTokens) return;

  // 默认窗口 = 3 月，渲染表格 + 同步指标卡
  renderTokenDetailTable(3);
}

// 切换月度明细窗口（1 / 3 / 6 月）
function switchTokenDetailWindow(months) {
  // 切按钮态
  var sw = document.getElementById('token-detail-window');
  if (sw) {
    sw.querySelectorAll('.card-window-btn').forEach(function(b) {
      b.classList.toggle('active', String(b.dataset.window) === String(months));
    });
  }
  renderTokenDetailTable(months);
}

// 月度明细表（宽表 + 时间窗口）+ 同步顶部 4 个指标卡
function renderTokenDetailTable(windowMonths) {
  var data = TOKEN_USAGE_DATA || [];
  if (!data.length) return;
  var allMonths = data[0].months || [];
  var n = Math.min(windowMonths, allMonths.length);
  var sliceStart = allMonths.length - n;

  // 同步顶部指标卡（按窗口聚合）
  var totalCost = 0, totalTokens = 0;
  data.forEach(function(d) {
    d.months.slice(sliceStart).forEach(function(m) {
      totalCost += m.cost;
      totalTokens += m.tokensM;
    });
  });
  var users = data.length;
  var elCost = document.getElementById('token-total-cost');
  var elTokens = document.getElementById('token-total-tokens');
  var elAvgCost = document.getElementById('token-avg-cost');
  var elAvgTokens = document.getElementById('token-avg-tokens');
  if (elCost) elCost.textContent = '\u00a5' + Math.round(totalCost).toLocaleString();
  if (elTokens) elTokens.textContent = totalTokens.toFixed(1) + 'M';
  if (elAvgCost) elAvgCost.textContent = '\u00a5' + Math.round(totalCost / users / n);
  if (elAvgTokens) elAvgTokens.textContent = (totalTokens / users / n).toFixed(1) + 'M';

  // 同步标签上的窗口文字
  var windowText = '近 ' + n + ' 月';
  var lbl1 = document.getElementById('token-window-label-1');
  var lbl2 = document.getElementById('token-window-label-2');
  if (lbl1) lbl1.textContent = windowText;
  if (lbl2) lbl2.textContent = windowText;

  // 表头
  var thead = document.getElementById('token-detail-thead');
  if (thead) {
    var th = '<tr><th>用户</th>';
    allMonths.slice(sliceStart).forEach(function(m) {
      th += '<th style="text-align: right;">' + m.label + ' Token<span class="info-tip"><span class="info-icon">i</span><span class="info-bubble">sum(input_tokens + output_tokens) by user_id × month</span></span></th>';
      th += '<th style="text-align: right;">' + m.label + ' 费用<span class="info-tip"><span class="info-icon">i</span><span class="info-bubble">sum(token_cost) by user_id × month，token_cost 按模型定价逐请求计算</span></span></th>';
    });
    if (n > 1) {
      th += '<th style="text-align: right;">合计 Token<span class="info-tip"><span class="info-icon">i</span><span class="info-bubble">当前窗口内各月 Token 合计</span></span></th>';
      th += '<th style="text-align: right;">合计费用<span class="info-tip"><span class="info-icon">i</span><span class="info-bubble">当前窗口内各月费用合计</span></span></th>';
    }
    th += '</tr>';
    thead.innerHTML = th;
  }

  // 表体
  var tbody = document.getElementById('token-detail-tbody');
  if (!tbody) return;
  var rows = '';
  data.forEach(function(d) {
    var months = d.months.slice(sliceStart);
    var sumT = 0, sumC = 0;
    rows += '<tr>';
    rows += '<td><strong>' + d.user + '</strong></td>';
    months.forEach(function(m) {
      rows += '<td style="text-align: right;">' + m.tokensM.toFixed(1) + ' M</td>';
      rows += '<td style="text-align: right; color: var(--danger);">\u00a5' + m.cost + '</td>';
      sumT += m.tokensM;
      sumC += m.cost;
    });
    if (n > 1) {
      rows += '<td style="text-align: right; font-weight: 600;">' + sumT.toFixed(1) + ' M</td>';
      rows += '<td style="text-align: right; font-weight: 600; color: var(--danger);">\u00a5' + sumC + '</td>';
    }
    rows += '</tr>';
  });
  tbody.innerHTML = rows;
}

// 4.6 分组 Token 预算看板
function initTokenBudget() {
  var tbody = document.getElementById('token-budget-tbody');
  if (!tbody) return;
  var data = TOKEN_BUDGET_DATA;
  if (!data || !data.length) return;

  var rows = '';
  data.forEach(function(d) {
    var isHeader = d.isHeader;
    var isSubHeader = d.isSubHeader;

    // Compute remain/gap styling
    var perRemainStr = '', totalRemainStr = '';
    var perStyle = '', totalStyle = '';
    if (d.perRemain !== null && d.perRemain !== undefined) {
      var isSurplus = d.perRemain >= 0;
      perRemainStr = (isSurplus ? '+' : '') + '\u00a5' + Math.abs(d.perRemain).toFixed(1);
      perStyle = 'color: ' + (isSurplus ? 'var(--success)' : 'var(--danger)') + '; font-weight: 600;';
    }
    if (d.totalRemain !== null && d.totalRemain !== undefined) {
      var isSurplusT = d.totalRemain >= 0;
      totalRemainStr = (isSurplusT ? '+' : '') + '\u00a5' + Math.abs(d.totalRemain).toFixed(1);
      totalStyle = 'color: ' + (isSurplusT ? 'var(--success)' : 'var(--danger)') + '; font-weight: 600;';
    }

    if (isHeader) {
      rows += '<tr style="background: var(--primary-light); border-top: 2px solid var(--primary);">';
    } else if (isSubHeader) {
      rows += '<tr style="background: #f1f5f9;">';
    } else {
      rows += '<tr>';
    }

    rows += '<td><strong>' + d.group + '</strong></td>';
    rows += '<td style="text-align: right; font-weight: 600;">' + d.headcount + '</td>';
    rows += '<td style="text-align: right;">\u00a5' + d.apr.toLocaleString() + '</td>';
    rows += '<td style="text-align: right;">\u00a5' + d.may.toLocaleString() + '</td>';
    rows += '<td style="text-align: right;">\u00a5' + d.mayMax.toLocaleString() + '</td>';
    rows += '<td style="text-align: right;">\u00a5' + d.futureEst.toLocaleString() + '</td>';
    rows += '<td style="text-align: right; font-weight: 600;">\u00a5' + d.maInit.toLocaleString() + '</td>';
    rows += '<td style="text-align: right; ' + perStyle + '">' + perRemainStr + '</td>';
    rows += '<td style="text-align: right; ' + totalStyle + '">' + totalRemainStr + '</td>';
    rows += '</tr>';
  });

  tbody.innerHTML = rows;
}
