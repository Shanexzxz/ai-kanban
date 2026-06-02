// L3 合规拦截 (用户使用情况 - 大类 A)
// 注：拦截功能尚未上线，本面板使用 mock 示例数据展示
function initL3ComplianceCharts() {
  initBlockTrend();
  initBlockScenario();
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
