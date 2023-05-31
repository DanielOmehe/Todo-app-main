const switchTheme = document.querySelector(".switch");
const tabSwitcher = document.querySelectorAll(".category");
const taskTabs = document.querySelectorAll(".taskList");
const taskInput = document.getElementById("task-input");
const todoForm = document.querySelector(".todo-form");

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

function getTodos(){
    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos
}

function setTodos(todos) {
    let todoJson = JSON.stringify(todos)
    localStorage.setItem("todos", todoJson);
}

function createNewTodo(task) {
    todoList.push({
        name: task,
        isCompleted: false,
        id: generateId()
    })

    setTodos(todoList);
    addTodos(todoList);
}

function addTodos(todos){
    document.querySelector('.no-task-added').style.display = 'none';
    const todoItems = document.querySelector(".all-tasks");
    for(let todo of todos){
        todoItems.innerHTML += `
            <div class="todo-item" id='${todo.id}'>
                <div class="check-box">
                    <img src="images/icon-check.svg" alt="" />
                </div>
                <p class="todo-name">${todo.name}</p>
            </div>
        `
    }

    document.querySelector('.all-todos').innerHTML = `${todoList.length}`
}

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if(taskInput.value !== ''){
        createNewTodo(taskInput.value);
    }
    taskInput.value = '';
})

function addActiveTodo(todos){
    document.querySelector('.no-active-task').style.display = 'none';
    const todoItems = document.querySelector(".active-tasks");
    for(let todo of todos){
        todoItems.innerHTML += `
            <div class="todo-item" id='${todo.id}'>
                <div class="check-box">
                    <img src="images/icon-check.svg" alt="" />
                </div>
                <p class="todo-name">${todo.name}</p>
            </div>
        `
    }
}

function setCompletedTodos(todos){
    document.querySelector('.no-task-added').style.display = 'none';
    const todoItems = document.querySelector(".completed-tasks");
    for(let todo of todos){
        if(todo.isCompleted){
            todoItems.innerHTML += `
                <div class="todo-item" id='${todo.id}'>
                    <div class="check-box">
                        <img src="images/icon-check.svg" alt="" />
                    </div>
                    <p class="todo-name">${todo.name}</p>
                </div>
            `
        }
    }
}

function toggleCompletedTodos(id, todos){
    todos.map((todo) => {
        if(todo.id === id){
            todo.isCompleted = !todo.isCompleted;
        }
    })

    setTodos(todos);
}


if(todoList){
    addTodos(todoList);
    addActiveTodo(todoList);
    setCompletedTodos(todoList);
}