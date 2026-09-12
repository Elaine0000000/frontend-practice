const form = document.querySelector('#add-form');
const input = document.querySelector('#task-input');
const tip = document.querySelector('#tip');
const list = document.querySelector('#task-list');

let tasks = [];

const render = () => {
  list.innerHTML = '';
  if (tasks.length === 0) {
    const card = document.createElement('div');
    card.textContent = '暂无记录';
    list.appendChild(card);
    return;
  }
  tasks.forEach(task => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <span class="card-title">${task.text}</span>
    `;
    if (task.done) card.classList.add('done');
    list.appendChild(card);
  });
};


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text === '') {
    tip.textContent = '书名不能为空';
    return;
  }
  tasks.push({ text: text, done: false });
  tip.textContent = '';
  input.value = '';
  render();
});

render();
