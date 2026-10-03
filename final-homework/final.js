const CANTEENS = [
  { name: '知味堂一楼', building: '知味堂', floor: 1, status: '开放', hours: '06:30-22:00' },
  { name: '知味堂二楼', building: '知味堂', floor: 2, status: '开放', hours: '06:30-22:00' },
  { name: '知味堂三楼', building: '知味堂', floor: 3, status: '开放', hours: '06:30-22:00' },
  { name: '余味堂一楼', building: '余味堂', floor: 1, status: '开放', hours: '06:30-22:00' },
  { name: '余味堂二楼', building: '余味堂', floor: 2, status: '开放', hours: '06:30-22:00' },
  { name: '余味堂三楼', building: '余味堂', floor: 3, status: '维修', hours: '暂停开放' },
  { name: '品味堂一楼', building: '品味堂', floor: 1, status: '开放', hours: '06:30-22:00' },
  { name: '品味堂二楼', building: '品味堂', floor: 2, status: '开放', hours: '06:30-22:00' },
  { name: '品味堂三楼', building: '品味堂', floor: 3, status: '开放', hours: '06:30-22:00' }
];

const statusEl = document.querySelector('#status');

const renderSummary = () => {
  const open = CANTEENS.filter(r => r.status === '开放').length;
  const cards = [
    { label: '食堂', value: CANTEENS.length },
    { label: '当前开放', value: open }
  ];
  const box = document.querySelector('#summary-cards');
  if (!box) return;
  box.innerHTML = '';
  cards.forEach(c => {
    box.insertAdjacentHTML('beforeend', `
      <div class="col-6 col-md-3">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title h6">${c.label}</h3>
            <p class="card-text fs-4">${c.value}</p>
          </div>
        </div>
      </div>
    `);
  });
};

const badgeClass = { '开放': 'text-bg-success', '关闭': 'text-bg-secondary', '维修': 'text-bg-warning' };

const renderRooms = () => {
  const list = document.querySelector('#room-list');
  const floorEl = document.querySelector('#floor-filter');
  const statusFilterEl = document.querySelector('#status-filter');
  if (!list || !floorEl || !statusFilterEl) return;

  const floor = floorEl.value;
  const status = statusFilterEl.value;
  const shown = CANTEENS.filter(r =>
    (floor === 'all' || r.floor === Number(floor)) &&
    (status === 'all' || r.status === status)
  );
  list.innerHTML = '';
  if (shown.length === 0) {
    list.innerHTML = '<li class="list-group-item">没有符合条件的食堂</li>';
    return;
  }
  shown.forEach(r => {
    list.insertAdjacentHTML('beforeend', `
      <li class="list-group-item">
        <span>${r.name} · ${r.building}${r.floor}层</span>
        <span class="badge ${badgeClass[r.status]}">${r.status} · ${r.hours}</span>
      </li>
    `);
  });
};

const floorEl = document.querySelector('#floor-filter');
const statusFilterEl = document.querySelector('#status-filter');
if (floorEl) floorEl.addEventListener('change', renderRooms);
if (statusFilterEl) statusFilterEl.addEventListener('change', renderRooms);

let chart = null;

const renderChart = (data) => {
  const el = document.querySelector('#usage-chart');
  if (!el) return;
  if (chart === null) {
    chart = echarts.init(el);
  }
  chart.setOption({
    title: { text: data.title, left: 'center' },
    tooltip: { trigger: 'axis' },
    grid: { left: 56, right: 24, bottom: 90 },
    xAxis: {
      type: 'category',
      data: data.dishes.map(d => d.name),
      axisLabel: { rotate: 38, interval: 0, fontSize: 11 }
    },
    yAxis: { type: 'value', name: '份' },
    series: [{
      name: '剩余份数',
      type: 'bar',
      data: data.dishes.map(d => d.remaining),
      itemStyle: { color: '#0d6efd' }
    }]
  });
};

const loadChart = async () => {
  if (statusEl) {
    statusEl.textContent = '加载中...';
    statusEl.style.display = 'block';
  }
  try {
    const response = await fetch('./data.json');
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    const data = await response.json();
    if (!Array.isArray(data.dishes) || data.dishes.length === 0) {
      if (statusEl) statusEl.textContent = '暂无数据';
      return;
    }
    if (statusEl) statusEl.style.display = 'none';
    renderChart(data);
  } catch (error) {
    if (statusEl) statusEl.textContent = '加载失败：' + error.message;
  }
};

window.addEventListener('resize', () => {
  if (chart) chart.resize();
});

renderSummary();
renderRooms();
loadChart();
