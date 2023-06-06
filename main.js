const switchTheme = document.querySelector(".switch");
const tabSwitcher = document.querySelectorAll(".category");
const taskTabs = document.querySelectorAll(".taskList");
const taskInput = document.getElementById("task-input");
const todoForm = document.querySelector(".todo-form");
const clearCompleted = document.querySelector(".clear-completed");
let toggle = false

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

  const deleteIcon = document.querySelectorAll(".delete");
  deleteIcon.forEach((icon, index) => {
    icon.addEventListener("click", (e) => deleteTodo(e.target, index, todoItems));
  });

  const checkBox = document.querySelectorAll(".check-box");
  checkBox.forEach((box, index) => {
    box.addEventListener("click", (e) => toggleCompletedTodos(e.target, index, todos));
  });
}

function addActiveTodo(todos) {
  if(todos.length > 0) document.querySelector(".no-active-task").style.display = "none";

  const todoItems = document.querySelector(".active-tasks");
  todos.map((todo) => {
    if (!todo.isCompleted) {
      todoItems.innerHTML += `
                <div class="todo-item" id='${todo.id}'>
                    <div class="check-box"></div>
                    <p class="todo-name">${todo.name}</p>
                    <div class='delete'>
                      <img src='images/icon-cross.svg' />
                    </div>
                </div>
            `;
    }
  });

  const deleteIcon = document.querySelectorAll(".delete");
  deleteIcon.forEach((icon, index) => {
    icon.addEventListener("click", (e) => deleteTodo(e.target, index, todoItems));
  });

};

function setCompletedTodos(todos) {
  if(todos.length > 0) document.querySelector(".no-completed-task").style.display = "none";
  const todoItems = document.querySelector(".completed-tasks");
  todos.map((todo, index)=>{
    if (todo.isCompleted) {
      todoItems.innerHTML += `
                <div class="todo-item" id='${todo.id}'>
                    <div class="check-box"></div>
                    <p class="todo-name">${todo.name}</p>
                    <div class='delete'>
                      <img src='images/icon-cross.svg' />
                    </div>
                </div>
            `;
    }
  });

  const deleteIcon = document.querySelectorAll(".delete");
  deleteIcon.forEach((icon, index) => {
    icon.addEventListener("click", (e) => deleteTodo(e.target, index, todoItems));
  });
}

function deleteTodo(node, index, items){
  let parent = node.parentElement.parentElement;

  let todos = todoList.filter((item) => item.id !== parent.id);
  localStorage.removeItem(todoList[index]);
  items.removeChild(parent);
  if(items.length === 0){
    items.parentElement.querySelector('div').style.display = 'block';
  }

  setTodos(todos);
  refreshTodoList()
}

function toggleCompletedTodos(node, index, todos){
  const parent = node.parentElement;
  parent.querySelector('.todo-name').classList.toggle('completed')

  todos.map((todo)=>{
    if(todo.id === parent.id){
      todo.isCompleted = !todo.isCompleted;
    }
  })

  if(!todos[index].isCompleted){
    node.innerHTML = `<img src='images/icon-check.svg' alt='check' />`;
    // todoList[index].isCompleted = true;
    console.log(node.innerHTML);
  }else{
    node.innerHTML = '';
    // todoList[index].isCompleted = false;
    console.log(node.innerHTML);
  }
  setTodos(todos);
  node.classList.toggle('checked');
  refreshTodoList(todos)
}

function refreshTodoList(todos){
  setTodos(todos);
  setCompletedTodos(todos.filter(todo => todo.isCompleted))
}

clearCompleted.addEventListener("click", clearCompletedTodos);

function clearCompletedTodos() {
  todoList.filter((todo) => !todo.isCompleted);
  const completedTask = document.querySelector(".completed-tasks");

  let count = completedTask.children.length;
  while(count > 0){
    count--;
    completedTask.removeChild(completedTask.children[count]);
    completedTask.parentElement.querySelector('.no-completed-tasks').style.display = 'block';
  }
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

(function(){
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
