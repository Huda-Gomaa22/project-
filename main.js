document.addEventListener('DOMContentLoaded', () => {
    let columns = {
        todo: [],
        doing: [],
        done: []
    };

    const addTaskBtn = document.querySelector('.add-task-btn');
    const modal = document.getElementById('task-form');
    const closeBtn = document.querySelector('.close');
    const taskForm = document.getElementById('taskForm');
    const toggleThemeBtn = document.getElementById("toggleTheme");

    const taskDetailsModal = document.getElementById('task-details-modal');
    const detailTitle = document.getElementById('detail-title');
    const detailDescription = document.getElementById('detail-description');
    const detailDate = document.getElementById('detail-date');

    // Check for stored theme preference
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    toggleThemeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
        } else {
            localStorage.setItem("darkMode", "disabled");
        }
    });

    // Open Task Form
    addTaskBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });



    // Close Task Details Modal
    taskDetailsModal.addEventListener('click', () => {
        taskDetailsModal.style.display = 'none';
    });

    // Handle Task Submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;
        const status = document.getElementById('status').value;

        // Create task object
        const newTask = {
            title: title,
            description: description,
            date: date,
            id: Date.now()
        };

        // Add new task to the correct column in 'columns'
        columns[status].push(newTask);

        // Save the task to localStorage
        saveTasks();

        // Render tasks
        renderTasks();

        // Clear the form and close the modal
        taskForm.reset();
        modal.style.display = 'none';
    });

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem("kanbanTasks", JSON.stringify(columns));
    }

    // Load tasks from localStorage
    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem("kanbanTasks"));
        if (savedTasks) {
            columns = savedTasks; // Set the loaded tasks to the columns
            renderTasks(); // Render tasks after loading
        }
    }

    // Render tasks to the UI
    function renderTasks() {
        // Clear existing tasks
        document.getElementById('todo-tasks').innerHTML = '';
        document.getElementById('doing-tasks').innerHTML = '';
        document.getElementById('done-tasks').innerHTML = '';

        // Render tasks in each column
        Object.keys(columns).forEach(column => {
            columns[column].forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('task');
                taskElement.innerHTML = `
                            <h3>${task.title}</h3>
                            <p>${task.description}</p>
                            <p>${task.date}</p>
                        `;

                // Add click event to view task details
                taskElement.addEventListener('click', () => {
                    detailTitle.textContent = task.title;
                    detailDescription.textContent = task.description;
                    detailDate.textContent = task.date;
                    taskDetailsModal.style.display = 'flex';
                });

                const removeBtn = document.createElement('button');
                removeBtn.innerText = 'Delete';
                removeBtn.classList.add('remove-task');
                removeBtn.onclick = () => {
                    // Remove task from UI and localStorage
                    columns[column] = columns[column].filter(t => t.id !== task.id);
                    saveTasks();
                    renderTasks();
                };
                taskElement.appendChild(removeBtn);

                // Append the task to the corresponding column
                document.getElementById(`${column}-tasks`).appendChild(taskElement);
            });
        });
    }

    // Initial load of tasks when the page is loaded
    loadTasks();
});