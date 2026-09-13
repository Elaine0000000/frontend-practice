const form = document.querySelector('#add-form');
const input = document.querySelector('#task-input');
const tip = document.querySelector('#tip');
const list = document.querySelector('#task-list');
const filters = document.querySelector('.filters');
const addCardButton = document.querySelector('#add-card');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter = 'all'; // all / active / done
const save = () => localStorage.setItem('tasks', JSON.stringify(tasks));

const render = () => {
  list.innerHTML = '';
  const shown = tasks.filter(t =>
    currentFilter === 'all' ? true :
    currentFilter === 'active' ? !t.done : t.done
  );
  if (shown.length === 0) {
    const li = document.createElement('li');
    li.textContent = '没有符合条件的卡片';
    list.appendChild(li);
    return;
  }
  if (tasks.length === 0) {
    const li = document.createElement('li');
    li.textContent = '暂无卡片';
    list.appendChild(li);
    return;
  }
 shown.forEach(task => {
    const li = document.createElement('li');
    li.className = 'card';
    if (task.done) li.classList.add('done');
    const cardInput = document.createElement('input');
    cardInput.type = 'text';
    cardInput.className = 'card-input';
    cardInput.value = task.text;
    cardInput.addEventListener('input', (e) => {
      task.text = e.target.value;
      save();

};
    const cardInput = document.createElement('input');
    cardInput.type = 'text';
    cardInput.className = 'card-input';
    cardInput.value = task.text;
    cardInput.addEventListener('input', (e) => {
      task.text = e.target.value;
      save();
      render();
    });
    cardInput.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    const doneBtn = document.createElement('button');
    doneBtn.className = 'card-btn';
    doneBtn.textContent = task.done ? '撤销' : '完成';
    doneBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      task.done = !task.done;
      save();
      render();
    });

    const delBtn = document.createElement('button');
    delBtn.className = 'card-btn';
    delBtn.textContent = '删除';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tasks = tasks.filter(t => t !== task);
      save();
      render();
    });

    li.appendChild(cardInput);
    li.appendChild(doneBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}
addCardBtn.addEventListener('click', () => {
  tasks.push({ text: '', done: false });
  save();
  render();
  const inputs = list.querySelectorAll('.card-input');
  if (inputs.length) inputs[inputs.length - 1].focus();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text === '') {
    tip.textContent = '任务名不能为空';
    return;
  }
  tasks.push({ text: text, done: false });
  tip.textContent = '';
  input.value = '';
  save();
  render();
});

filters.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  currentFilter = e.target.dataset.filter; 
  render();
});

render();


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
  save();
  render();
});
filters.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  currentFilter = e.target.dataset.filter;
  render();
});

render();
