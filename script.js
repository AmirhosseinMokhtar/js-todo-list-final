const body = document.querySelector("#body");
const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const todoList = document.querySelector("#todoList");
const filterButtons = document.querySelectorAll(".filter-btn");
const statsText = document.querySelector("#statsText");
const clearCompletedBtn = document.querySelector("#clearCompletedBtn");
const darkModeBtn = document.querySelector("#darkModeBtn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

const saveTodos = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const saveDarkMode = () => {
  localStorage.setItem("darkMode", JSON.stringify(darkMode));
};

const renderStats = () => {
  const completedCount = todos.reduce(
    (count, todo) => (todo.completed ? count + 1 : count),
    0
  );

  statsText.textContent = `${completedCount} / ${todos.length} completed`;
};

const renderTodos = () => {
  todoList.innerHTML = "";

  let filteredTodos = todos;

  if (currentFilter === "active") {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (currentFilter === "completed") {
    filteredTodos = todos.filter(todo => todo.completed);
  }

  filteredTodos.forEach(todo => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    if (todo.completed) {
      li.classList.add("completed");
    }

    const span = document.createElement("span");
    span.textContent = todo.text;

    const btnGroup = document.createElement("div");

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.className = "btn btn-success btn-sm me-2";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "btn btn-danger btn-sm";

    doneBtn.addEventListener("click", () => {
      todos = todos.map(t =>
        t.id === todo.id ? { ...t, completed: !t.completed } : t
      );
      saveTodos();
      renderTodos();
    });

    deleteBtn.addEventListener("click", () => {
      todos = todos.filter(t => t.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    btnGroup.appendChild(doneBtn);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(btnGroup);

    todoList.appendChild(li);
  });

  renderStats();
};

const addTodo = () => {
  const text = todoInput.value.trim();
  if (!text) return;

  const newTodo = {
    id: Date.now(),
    text,
    completed: false
  };

  todos = [...todos, newTodo];
  saveTodos();
  renderTodos();

  todoInput.value = "";
};

addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keypress", event => {
  if (event.key === "Enter") {
    addTodo();
  }
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  renderTodos();
});

if (darkMode) {
  body.classList.add("dark");
}

darkModeBtn.addEventListener("click", () => {
  darkMode = !darkMode;
  body.classList.toggle("dark");
  saveDarkMode();
});

renderTodos();
