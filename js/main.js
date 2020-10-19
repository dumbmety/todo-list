// Elements
const tasksList = document.getElementById('tasks-list')
const addTaskInput = document.getElementById('add-task-input')

// Total List Of Tasks
let list = JSON.parse(localStorage.getItem('tasks')) || []

// Show All Tasks From Local Storage In Page
function showTasksList() {
    tasksList.innerHTML = ''
    // Reverse Sort List
    const list = JSON.parse(localStorage.getItem('tasks')).reverse()

    if (list.length > 0) {
        for (const task of list) {
            // <li> tag
            const li = document.createElement('li')
            li.classList.add('flex')

            // <span> tag
            const span = document.createElement('span')
            span.setAttribute('onclick', `completeTask(${task.id})`)

            // <i> tag
            const i = document.createElement('i')
            if (task.completed === true) {
                li.appendChild(span)
                span.classList.add('completed')
                span.appendChild(i)
                i.classList.add('bx', 'bx-check')
            } else li.appendChild(span)

            // Check If Completed
            if (task.completed === true) {
                const del = document.createElement('del')
                del.textContent = task.text
                li.appendChild(del)
            } else {
                const div = document.createElement('div')
                div.classList.add('task')
                div.textContent = task.text
                li.appendChild(div)
            }

            // Edit Button
            const edit = document.createElement('i')
            edit.setAttribute('onclick', `editTask(${task.id})`)
            edit.classList.add('edit', 'bx', 'bxs-edit')
            li.appendChild(edit)

            // Remove Button
            const remove = document.createElement('i')
            remove.setAttribute('onclick', `removeTask(${task.id})`)
            remove.classList.add('remove', 'bx', 'bx-trash-alt')
            li.appendChild(remove)

            // Append Child <li>
            tasksList.appendChild(li)
        }
    } else {
        const div = document.createElement('div')
        div.classList.add('alert', 'alert-warning')
        div.innerHTML = 'You have nothing task today!<br />Enter your tasks today above'
        tasksList.appendChild(div)
    }
}

// Add New Task To Local Storage
function addTask(event) {
    if (event.keyCode == 13) {
        list.push({
            id: list.length + 1,
            text: event.target.value,
            completed: false
        })

        localStorage.setItem('tasks', JSON.stringify(list))

        Toastify({
            text: 'New task added',
            duration: 3000,
            close: true,
            gravity: 'bottom',
            position: 'left',
            backgroundColor: 'linear-gradient(to right, #525879, #181f47)',
            stopOnFocus: true
        }).showToast()

        event.target.value = ''
        showTasksList()
    }
}

// Change Complete State
function completeTask(id) {
    // Get Task
    const taskIndex = list.findIndex(t => t.id == id)
    const task = list[taskIndex]

    // Change State
    task.completed ? (task.completed = false) : (task.completed = true)
    list[taskIndex] = task

    // Save Changes
    localStorage.setItem('tasks', JSON.stringify(list))
    showTasksList()
}

// Remove Task
function removeTask(id) {
    // Change State
    list = list.filter(t => t.id !== id)
    localStorage.setItem('tasks', JSON.stringify(list))

    // Show Alert And Render List
    Toastify({
        text: 'Task removed',
        duration: 3000,
        close: true,
        gravity: 'bottom',
        position: 'left',
        backgroundColor: 'linear-gradient(to right, #e45757, #d44747)',
        stopOnFocus: true
    }).showToast()
    showTasksList()
}

// Edit Task
function editTask(id) {
    // Get Task
    const taskEdited = prompt('Edit your task here...')
    if (taskEdited == '' || taskEdited == null) return
    const taskIndex = list.findIndex(t => t.id == id)

    // Change State And Save Changes
    list[taskIndex].text = taskEdited
    localStorage.setItem('tasks', JSON.stringify(list))

    // Show Alert And Then Render List
    Toastify({
        text: 'Task edited',
        duration: 3000,
        close: true,
        gravity: 'bottom',
        position: 'left',
        backgroundColor: 'linear-gradient(to right, #47d453, #35ac3f)',
        stopOnFocus: true
    }).showToast()
    showTasksList()
}

// Clear All Tasks
function clearAllTasks() {
    if (list.length > 0) {
        if (confirm('Are you sure?')) {
            list = []
            localStorage.setItem('tasks', JSON.stringify(list))

            showTasksList()
        }
    } else {
        Toastify({
            text: 'There is no task to remove',
            duration: 3000,
            close: true,
            gravity: 'bottom',
            position: 'left',
            backgroundColor: 'linear-gradient(to right, #e45757, #d44747)',
            stopOnFocus: true
        }).showToast()
    }
}

// Clear Complete Tasks
function clearCompleteTasks() {
    if (list.length > 0) {
        if (confirm('Are you sure?')) {
            const filteredTasks = list.filter(t => t.completed !== true)
            localStorage.setItem('tasks', JSON.stringify(filteredTasks))
            showTasksList()
        }
    } else {
        Toastify({
            text: 'There is no task to remove',
            duration: 3000,
            close: true,
            gravity: 'bottom',
            position: 'left',
            backgroundColor: 'linear-gradient(to right, #e45757, #d44747)',
            stopOnFocus: true
        }).showToast()
    }
}

// Event Listeners
addTaskInput.addEventListener('keypress', addTask)
window.addEventListener('load', () => addTaskInput.focus())

showTasksList()
