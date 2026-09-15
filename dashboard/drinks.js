const state = { data: null };

const loadData = async () => {
  $('#status').text('加载中...').show();
  try {
    const response = await fetch('./drinks.json');
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    const data = await response.json();
    if (data.series.length === 0) {
      $('#status').text('暂无数据').show();
      return;
    }
    state.data = data;
    $('#sub-title').text(data.title + ' · 数据来源：不完全统计（完全不统计）');
    $('#status').hide();
    renderCards(data);
    renderBarChart(data);
    renderLineChart(data);
    renderPieChart(data);
  } catch (error) {
    $('#status').text('加载失败：' + error.message).show();
  }
};
let barChart = null;

const renderBarChart = (data) => {
  if (barChart === null) {
    barChart = echarts.init(document.querySelector('#bar-chart'));
  }
  barChart.setOption({
    title: { text: '各月饮料购买量', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    xAxis: { data: data.months },
    yAxis: { name: '杯' },
    series: data.series.map(s => ({
      name: s.category,
      type: 'bar',
      data: s.counts
    }))
  });
};
let lineChart = null;

const renderLineChart = (data) => {
  if (lineChart !== null) {
    lineChart.destroy();
  }
  const ctx = document.querySelector('#line-chart');
  lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.months,
      datasets: data.series.map(s => ({
        label: s.category,
        data: s.counts,
        borderWidth: 1
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: '购买趋势' }
      }
    }
  });
};
let pieChart = null;

const renderPieChart = (data) => {
  const pieData = data.series.map(s => {
    return {
      name: s.category,
      value: s.counts.reduce((sum, n) => sum + n, 0)
    };
  });

  if (pieChart === null) {
    pieChart = echarts.init(document.querySelector('#pie-chart'));
  }

  pieChart.setOption({
    title: { text: '购买占比', left: 'center' },
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
    legend: { bottom: 0 },
    series: [
      {
        name: '购买量',
        type: 'pie',
        radius: '60%', 
        center: ['50%', '50%'], 
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });
};


window.addEventListener('resize', () => {
  if (barChart) barChart.resize();
  if (pieChart) pieChart.resize();
});

const renderCards = (data) => {
  const months = data.months;
  data.series.forEach(s => {
    const total = s.counts.reduce((sum, n) => sum + n, 0);
    $('#cards').append(`
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title h6">${s.category}</h3>
            <p class="card-text fs-4">${total}</p>
          </div>
        </div>
      </div>
    `);
  });
};

loadData();