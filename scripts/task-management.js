const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

// Load tasks from localStorage or start with empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Sort tasks by isCompleted (incomplete first)
const sortTasks = () => {
  tasks.sort((a, b) => {
    if (a.isCompleted && !b.isCompleted) return 1;
    if (!a.isCompleted && b.isCompleted) return -1;
    return 0;
  });
};

// Save to localStorage
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Render all tasks
const renderTasks = () => {
  sortTasks();
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    if (task.isCompleted) {
      taskItem.classList.add("completed");
    }

    const taskName = document.createElement("p");
    taskName.classList.add("task-name");
    taskName.textContent = task.name;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-task");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    const completeButton = document.createElement("button");
    completeButton.classList.add("complete-task");
    completeButton.textContent = task.isCompleted ? "Undo" : "Complete";
    completeButton.addEventListener("click", () => {
      tasks[index].isCompleted = !tasks[index].isCompleted;
      saveTasks();
      renderTasks();
    });

    taskItem.appendChild(taskName);
    taskItem.appendChild(deleteButton);
    taskItem.appendChild(completeButton);
    taskList.appendChild(taskItem);
  });
};

// Handle task form submission
const handleTaskFormSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(taskForm);
  const taskData = {
    name: formData.get("task-name"),
    isCompleted: false,
  };

  tasks.push(taskData);
  saveTasks();
  renderTasks();
  taskForm.reset();
};

// Initial setup
taskForm.addEventListener("submit", handleTaskFormSubmit);
renderTasks();