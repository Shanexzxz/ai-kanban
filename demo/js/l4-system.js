// 系统观测 (v3 Enhanced)
// 精简到核心 4 指标 + Langfuse 跳转
function initSysCharts() {
  initResponseTime();
  initErrorRate();
  initErrorTypes();
}

function initResponseTime() {
  const __el_chart_response_time = document.getElementById('chart-response-time');
  if (!__el_chart_response_time) return;
  const chart = echarts.init(__el_chart_response_time);
  const axisStyle = getChartAxisStyle();
  const legendStyle = getChartLegendStyle();
  chart.setOption({
    tooltip: Object.assign({
      trigger: 'axis',
      formatter: function(params) {
        var html = params[0].axisValue + '<br/>';
        params.forEach(function(p) { html += p.marker + ' ' + p.seriesName + ': ' + p.value + 's<br/>'; });
        return html;
      }
    }, COMMON_TOOLTIP),
    legend: Object.assign({ data: ['P50', 'P95', 'P99'], bottom: 0 }, legendStyle),
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: Object.assign({
      type: 'category',
      data: DATES_30.map(function(d) { return d.slice(5); }),
      axisLabel: { fontSize: 10, interval: 4, color: '#334155', fontWeight: 500 }
    }, axisStyle),
    yAxis: Object.assign({ type: 'value', axisLabel: { formatter: '{value}s' } }, axisStyle),
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
  window.addEventListener('resize', function() { chart.resize(); });
}

function initErrorRate() {
  const __el_chart_error_rate = document.getElementById('chart-error-rate');
  if (!__el_chart_error_rate) return;
  const chart = echarts.init(__el_chart_error_rate);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', formatter: function(p) { return p[0].axisValue + '<br/>错误率: ' + p[0].value + '%'; } }, COMMON_TOOLTIP),
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: Object.assign({
      type: 'category',
      data: DATES_30.map(function(d) { return d.slice(5); }),
      axisLabel: { fontSize: 10, interval: 4, color: '#334155', fontWeight: 500 }
    }, axisStyle),
    yAxis: Object.assign({ type: 'value', axisLabel: { formatter: '{value}%' } }, axisStyle),
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
  window.addEventListener('resize', function() { chart.resize(); });
}

// Changed from pie to horizontal bar chart
function initErrorTypes() {
  const __el_chart_error_types = document.getElementById('chart-error-types');
  if (!__el_chart_error_types) return;
  const chart = echarts.init(__el_chart_error_types);
  const axisStyle = getChartAxisStyle();
  const colors = ['#ef4444', '#f97316', '#f59e0b', '#a3a3a3'];

  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function(p) { return p[0].name + ': ' + p[0].value + '%'; } }, COMMON_TOOLTIP),
    grid: { left: 80, right: 40, top: 20, bottom: 20 },
    xAxis: Object.assign({ type: 'value', axisLabel: { formatter: '{value}%' } }, axisStyle),
    yAxis: {
      type: 'category',
      data: SYSTEM.errorTypes.map(function(d) { return d.name; }).reverse(),
      axisLabel: { fontSize: 12, color: '#334155', fontWeight: 500 },
      axisLine: axisStyle.axisLine,
      splitLine: { show: false }
    },
    series: [{
      type: 'bar',
      data: SYSTEM.errorTypes.map(function(d, i) {
        var ci = SYSTEM.errorTypes.length - 1 - i;
        return {
          value: d.value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: colors[ci] },
              { offset: 1, color: colors[ci] + 'cc' }
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
