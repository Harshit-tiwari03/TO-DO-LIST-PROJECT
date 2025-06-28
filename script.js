// Utility functions for localStorage
function getTasks() {
  try {
    const data = localStorage.getItem('tasks');
    return Array.isArray(JSON.parse(data)) ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render all tasks
function renderTasks() {
  const tasks = getTasks();
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  tasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (task.completed ? ' completed' : '');
    li.dataset.index = idx;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleComplete(idx));

    // Task label or input (for editing)
    let label;
    if (task.editing) {
      label = document.createElement('input');
      label.type = 'text';
      label.value = task.text;
      label.className = 'edit-input';
      label.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishEdit(idx, label.value);
        if (e.key === 'Escape') cancelEdit(idx);
      });
      setTimeout(() => label.focus(), 0);
    } else {
      label = document.createElement('span');
      label.className = 'todo-label';
      label.textContent = task.text;
      label.addEventListener('dblclick', () => startEdit(idx));
    }

    // Actions (Edit, Delete)
    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    if (task.editing) {
      // Save button
      const saveBtn = document.createElement('button');
      saveBtn.title = 'Save';
      saveBtn.innerHTML = '💾';
      saveBtn.onclick = () => finishEdit(idx, label.value);
      actions.appendChild(saveBtn);

      // Cancel button
      const cancelBtn = document.createElement('button');
      cancelBtn.title = 'Cancel';
      cancelBtn.innerHTML = '✖️';
      cancelBtn.onclick = () => cancelEdit(idx);
      actions.appendChild(cancelBtn);

      li.classList.add('editing');
    } else {
      // Edit button
      const editBtn = document.createElement('button');
      editBtn.title = 'Edit';
      editBtn.innerHTML = '✏️';
      editBtn.onclick = () => startEdit(idx);
      actions.appendChild(editBtn);

      // Delete button
      const delBtn = document.createElement('button');
      delBtn.title = 'Delete';
      delBtn.innerHTML = '🗑️';
      delBtn.onclick = () => deleteTask(idx);
      actions.appendChild(delBtn);
    }

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(actions);

    taskList.appendChild(li);
  });
}

// Add a new task
function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) return;

  const tasks = getTasks();
  tasks.push({ text, completed: false, editing: false });
  saveTasks(tasks);
  input.value = '';
  renderTasks();
}

// Delete a task
function deleteTask(idx) {
  const tasks = getTasks();
  tasks.splice(idx, 1);
  saveTasks(tasks);
  renderTasks();
}

// Toggle complete status
function toggleComplete(idx) {
  const tasks = getTasks();
  tasks[idx].completed = !tasks[idx].completed;
  saveTasks(tasks);
  renderTasks();
}

// Start editing a task
function startEdit(idx) {
  const tasks = getTasks();
  tasks.forEach((t, i) => t.editing = i === idx);
  saveTasks(tasks);
  renderTasks();
}

// Finish editing a task
function finishEdit(idx, newText) {
  const tasks = getTasks();
  const text = newText.trim();
  if (text) {
    tasks[idx].text = text;
    tasks[idx].editing = false;
    saveTasks(tasks);
    renderTasks();
  }
}

// Cancel editing
function cancelEdit(idx) {
  const tasks = getTasks();
  tasks[idx].editing = false;
  saveTasks(tasks);
  renderTasks();
}

// Add event listeners after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('addBtn').addEventListener('click', addTask);
  document.getElementById('taskInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addTask();
  });
  renderTasks();
});
