const switchTheme = document.querySelector(".switch");
const tabSwitcher = document.querySelectorAll(".category");
const taskTabs = document.querySelectorAll(".taskList");
const taskInput = document.getElementById("task-input");
const todoForm = document.querySelector(".todo-form");
const clearCompleted = document.querySelector(".clear-completed");

tabSwitcher.forEach((tab, index) => {
  tab.addEventListener("click", (e) => {
    tabSwitcher.forEach((tab) => tab.classList.remove("active"));
    tab.classList.add("active");
    taskTabs.forEach((tab) => {
      tab.classList.remove("active");
      taskTabs[index].classList.add("active");
    });
  });
});

const generateId = () => {
  const string = "abcdef1234567890";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += string[Math.floor(Math.random() * string.length)];
  }
  return id;
};

let todoList = getTodos();

function getTodos() {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos;
}

function setTodos(todos) {
  let todoJson = JSON.stringify(todos);
  localStorage.setItem("todos", todoJson);
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (taskInput.value !== "") {
    createNewTodo(taskInput.value);
  }
  taskInput.value = "";
});

function createNewTodo(task) {
  todoList.push({
    name: task,
    isCompleted: false,
    id: generateId(),
  });
  setTodos(todoList);
  addTodos(todoList);
}

function addTodos(todos) {
  if(todos.length > 0) document.querySelector(".no-task-added").style.display = "none";

  const todoItems = document.querySelector(".all-tasks");
  todos.map((todo, index) => {
    todoItems.innerHTML += `
      <div class="todo-item" id='${todo.id}'>
        <div class="check-box"></div>
        <p class="todo-name">${todo.name}</p>
        <div class='delete'>
          <img src='images/icon-cross.svg' />
        </div>
      </div>
    `;
  });
  document.querySelector(".all-todos").innerHTML = `${todoList.length}`;

  const todoItem = document.querySelectorAll('.todo-item');
  todoItem.forEach((item)=>{
    item.addEventListener('hover', ()=>{
      const deleteIcon = document.querySelectorAll('.delete');
      deleteIcon.forEach((icon, index)=>{
        icon.innerHTML = '';
      })
    })
  })

  const deleteIcon = document.querySelectorAll(".delete");
  deleteIcon.forEach((icon, index) => {
    icon.addEventListener("click", (e) => deleteTodo(e, index));
  });

  const checkBox = document.querySelectorAll(".check-box");
  checkBox.forEach((box, index) => {
    box.addEventListener("click", (e) => toggleCompletedTodos(e, index));
  });
}

function addActiveTodo(todos) {
  if(todos.length > 0) document.querySelector(".no-active-task").style.display = "none";

  const todoItems = document.querySelector(".active-tasks");
  todos.map((todo, index) => {
    if (!todo.isCompleted) {
      todoItems.innerHTML += `
                <div class="todo-item" id='${todo.id}'>
                    <div class="check-box"></div>
                    <p class="todo-name">${todo.name}</p>
                    <div class='delete'></div>
                </div>
            `;
    }
  });
}

function setCompletedTodos(todos) {
  if(todos.length > 0) document.querySelector(".no-completed-task").style.display = "none";
  const todoItems = document.querySelector(".completed-tasks");
  todos.map((todo, index) => {
    if (todo.isCompleted) {
      todoItems.innerHTML += `
                <div class="todo-item" id='${todo.id}'>
                    <div class="check-box"></div>
                    <p class="todo-name">${todo.name}</p>
                    <div class='delete'></div>
                </div>
            `;
    }
  });
}

function deleteTodo(node, index) {
  let mainparent = node.target.parentElement;
  let parent = mainparent.parentElement;

  let todos = todoList.filter((item) => item.id !== parent.id);
  setTodos(todos);
  localStorage.removeItem(todoList[index]);

  const allTasks = document.querySelector(".all-tasks");
  allTasks.removeChild(parent);
}

clearCompleted.addEventListener("click", clearCompletedTodos);

function clearCompletedTodos() {
  todoList.filter((todo) => !todo.isCompleted);
  console.log(todoList);
  const completedTask = document.querySelector(".completed-tasks");
  console.log(completedTask.children);
}

let theme = 'light';
const themeSwitcher = document.querySelector('.switch');

themeSwitcher.addEventListener('click', ()=>toggleTheme(theme))

function setTheme(theme){
  localStorage.setItem('theme',  theme);
}

function toggleTheme(theme){
  if(localStorage.getItem('theme') === 'light'){
    setTheme('dark');
    theme = 'dark';
    document.documentElement.setAttribute('data-theme', theme)
    themeSwitcher.innerHTML = `<img src="images/icon-sun.svg" alt="moon">`;
  }else{
    setTheme('light');
    theme = 'light';
    document.documentElement.setAttribute('data-theme', theme)
    themeSwitcher.innerHTML = `<img src="images/icon-moon.svg" alt="moon">`;
  }
}

(function () {
  addTodos(todoList);
  addActiveTodo(todoList);
  setCompletedTodos(todoList);
  document.querySelector(".all-todos").innerHTML = `${todoList.length}`;

  theme = localStorage.getItem('theme');
  if(theme === 'light'){
    setTheme('dark');
    document.documentElement.setAttribute('data-theme', theme);
    themeSwitcher.innerHTML = `<img src="images/icon-moon.svg" alt="moon">`;
  }else{
    setTheme('light');
    document.documentElement.setAttribute('data-theme', theme);
    themeSwitcher.innerHTML = `<img src="images/icon-sun.svg" alt="moon">`;
  }
})();