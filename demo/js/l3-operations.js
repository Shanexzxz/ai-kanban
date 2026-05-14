// L3 Security & System Observability Charts
function initL3Charts() {
  initBlockTrend();
  initBlockScenario();
  initAvailability();
  initResponseTime();
  initErrorRate();
  initErrorTypes();
}

function initBlockTrend() {
  const chart = echarts.init(document.getElementById('chart-block-trend'));
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: DATES_30.map(d => d.slice(5)),
      axisLabel: { fontSize: 10, interval: 4 }
    },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{
      type: 'bar',
      data: SECURITY.blockTrend,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#f97316' },
          { offset: 1, color: '#fb923c' }
        ]),
        borderRadius: [3, 3, 0, 0]
      },
      barWidth: 10
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initBlockScenario() {
  const chart = echarts.init(document.getElementById('chart-block-scenario'));
  chart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['38%', '62%'],
      center: ['50%', '50%'],
      data: SECURITY.blockScenario.map((d, i) => ({
        ...d,
        itemStyle: { color: ['#f97316', '#fdba74'][i] }
      })),
      label: { formatter: '{b}\n{d}%', fontSize: 12 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initAvailability() {
  // Rendered as static HTML, no chart needed
}

function initResponseTime() {
  const chart = echarts.init(document.getElementById('chart-response-time'));
  chart.setOption({
    tooltip: { trigger: 'axis', formatter: (params) => {
      let html = params[0].axisValue + '<br/>';
      params.forEach(p => { html += `${p.marker} ${p.seriesName}: ${p.value}s<br/>`; });
      return html;
    }},
    legend: { data: ['P50', 'P95', 'P99'], bottom: 0, textStyle: { fontSize: 11 } },
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: {
      type: 'category',
      data: DATES_30.map(d => d.slice(5)),
      axisLabel: { fontSize: 10, interval: 4 }
    },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}s' } },
    series: [
      {
        name: 'P50', type: 'line', data: SYSTEM.responseTime.p50,
        smooth: true, symbol: 'none',
        lineStyle: { color: '#10b981', width: 2 },
        itemStyle: { color: '#10b981' }
      },
      {
        name: 'P95', type: 'line', data: SYSTEM.responseTime.p95,
        smooth: true, symbol: 'none',
        lineStyle: { color: '#f59e0b', width: 2 },
        itemStyle: { color: '#f59e0b' }
      },
      {
        name: 'P99', type: 'line', data: SYSTEM.responseTime.p99,
        smooth: true, symbol: 'none',
        lineStyle: { color: '#ef4444', width: 2, type: 'dashed' },
        itemStyle: { color: '#ef4444' }
      }
    ]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initErrorRate() {
  const chart = echarts.init(document.getElementById('chart-error-rate'));
  chart.setOption({
    tooltip: { trigger: 'axis', formatter: (p) => `${p[0].axisValue}<br/>错误率: ${p[0].value}%` },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: DATES_30.map(d => d.slice(5)),
      axisLabel: { fontSize: 10, interval: 4 }
    },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [{
      type: 'line',
      data: SYSTEM.errorRate,
      smooth: true,
      symbol: 'none',
      lineStyle: { color: '#ef4444', width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(239,68,68,0.2)' },
          { offset: 1, color: 'rgba(239,68,68,0.01)' }
        ])
      },
      markLine: {
        data: [{ yAxis: 2, name: 'Warning', lineStyle: { color: '#f59e0b', type: 'dashed' } }],
        label: { formatter: 'Warning: 2%', fontSize: 10 }
      }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}

function initErrorTypes() {
  const chart = echarts.init(document.getElementById('chart-error-types'));
  chart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['35%', '60%'],
      center: ['50%', '50%'],
      data: SYSTEM.errorTypes.map((d, i) => ({
        ...d,
        itemStyle: { color: ['#ef4444', '#f97316', '#f59e0b', '#a3a3a3'][i] }
      })),
      label: { formatter: '{b}\n{d}%', fontSize: 11 }
    }]
  });
  window.addEventListener('resize', () => chart.resize());
}
