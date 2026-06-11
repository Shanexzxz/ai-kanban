// L3 合规拦截 (v3 Enhanced)
// 注：拦截功能尚未上线，本面板使用 mock 示例数据展示
function initL3ComplianceCharts() {
  initBlockTrend();
  initBlockScenario();
}

function initBlockTrend() {
  const __el_chart_block_trend = document.getElementById('chart-block-trend');
  if (!__el_chart_block_trend) return;
  const chart = echarts.init(__el_chart_block_trend);
  const axisStyle = getChartAxisStyle();
  chart.setOption({
    tooltip: Object.assign({ trigger: 'axis' }, COMMON_TOOLTIP),
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: Object.assign({
      type: 'category',
      data: DATES_30.map(function(d) { return d.slice(5); }),
      axisLabel: { fontSize: 10, interval: 4, color: '#334155', fontWeight: 500 }
    }, axisStyle),
    yAxis: Object.assign({ type: 'value', minInterval: 1 }, axisStyle),
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
  window.addEventListener('resize', function() { chart.resize(); });
}

function initBlockScenario() {
  const __el_chart_block_scenario = document.getElementById('chart-block-scenario');
  if (!__el_chart_block_scenario) return;
  const chart = echarts.init(__el_chart_block_scenario);
  chart.setOption({
    tooltip: Object.assign({ trigger: 'item' }, COMMON_TOOLTIP),
    series: [{
      type: 'pie',
      radius: ['38%', '62%'],
      center: ['50%', '50%'],
      data: SECURITY.blockScenario.map(function(d, i) {
        return Object.assign({}, d, { itemStyle: { color: ['#f97316', '#fdba74'][i] } });
      }),
      label: { formatter: '{b}\n{d}%', fontSize: 12 }
    }]
  });
  window.addEventListener('resize', function() { chart.resize(); });
}
