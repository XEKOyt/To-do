document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task));
}

document.getElementById('addTaskBtn').addEventListener('click', function() {
    addTask();
});

document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    const priority = document.getElementById('prioritySelect').value;

    if (taskText !== '') {
        const task = { text: taskText, priority, completed: false };
        addTaskToDOM(task);
        saveTaskToLocalStorage(task);
        taskInput.value = '';
        showNotification('Task added!', 'success');
    } else {
        showNotification('Please enter a task!', 'error');
    }
}

function addTaskToDOM(task) {
    const taskList = document.getElementById('taskList');

    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    li.style.opacity = '0';
    li.style.transform = 'translateX(100%)';
    setTimeout(() => {
        li.style.opacity = '1';
        li.style.transform = 'translateX(0)';
    }, 10);

    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    const taskSpan = document.createElement('span');
    taskSpan.textContent = task.text;

    const prioritySpan = document.createElement('span');
    prioritySpan.className = `priority ${task.priority}`;
    prioritySpan.textContent = task.priority.toUpperCase();

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.className = 'edit-btn';
    editBtn.addEventListener('click', () => editTask(li, taskSpan, prioritySpan));

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteTask(li));

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    taskContent.appendChild(taskSpan);
    taskContent.appendChild(prioritySpan);
    li.appendChild(taskContent);
    li.appendChild(actionsDiv);

    li.addEventListener('click', function() {
        li.classList.toggle('completed');
        task.completed = !task.completed;
        updateLocalStorage();
        showNotification('Task status updated!', 'info');
    });

    taskList.appendChild(li);

    taskList.scrollTop = taskList.scrollHeight;
}

function editTask(li, taskSpan, prioritySpan) {
    const newText = prompt('Edit your task:', taskSpan.textContent);
    if (newText !== null && newText.trim() !== '') {
        taskSpan.textContent = newText.trim();
        const newPriority = prompt('Edit priority (low, medium, high):', prioritySpan.textContent.toLowerCase());
        if (['low', 'medium', 'high'].includes(newPriority)) {
            prioritySpan.className = `priority ${newPriority}`;
            prioritySpan.textContent = newPriority.toUpperCase();
        }
        updateLocalStorage();
        showNotification('Task updated!', 'success');
    }
}

function deleteTask(li) {
    showConfirmation('Are you sure you want to delete this task?', (confirmed) => {
        if (confirmed) {
            li.remove();
            updateLocalStorage();
            showNotification('Task deleted!', 'success');
        }
    });
}

document.getElementById('clearAllBtn').addEventListener('click', function() {
    showConfirmation('Are you sure you want to clear all tasks?', (confirmed) => {
        if (confirmed) {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            localStorage.removeItem('tasks');
            showNotification('All tasks cleared!', 'success');
        }
    });
});

function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        const taskText = li.querySelector('.task-content span').textContent;
        const priority = li.querySelector('.priority').className.split(' ')[1];
        const completed = li.classList.contains('completed');
        tasks.push({ text: taskText, priority, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('customNotification');
    const notificationMessage = document.getElementById('notificationMessage');

    notificationMessage.textContent = message;
    notification.className = `custom-notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
    }, 3000);
}


function showConfirmation(message, callback) {
    const modal = document.getElementById('confirmationModal');
    const modalMessage = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    modalMessage.textContent = message;
    modal.classList.add('show');

    confirmBtn.onclick = () => {
        callback(true);
        modal.classList.remove('show');
    };

    cancelBtn.onclick = () => {
        callback(false);
        modal.classList.remove('show');
    };
}
