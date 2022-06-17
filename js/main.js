// Elements
const tasksList = document.querySelector("#tasks-list")
const addTaskInput = document.querySelector("#add-task-input")

// Total List Of Tasks
let list = JSON.parse(localStorage.getItem("tasks")) || []

/**
 * Show All Tasks From Local Storage In Page
 */
function showTasksList() {
  tasksList.innerHTML = ""
  const list = JSON.parse(localStorage.getItem("tasks"))

  if (!Array.isArray(list) || list?.length === 0) {
    const element = String.raw`
			<div class="ui icon warning message">
				<i class="inbox icon"></i>
				<div class="content">
					<div class="header">You have nothing task today!</div>
					<div>Enter your tasks today above.</div>
				</div>
			</div>
		`

    tasksList.style.border = "none"
    return tasksList.insertAdjacentHTML("beforeend", element)
  }

  tasksList.style.border = "1px solid rgba(34,36,38,.15)"
  list.reverse().forEach(task => {
    const element = String.raw`
				<li class="ui segment grid equal width">
					<div class="ui checkbox column">
						<input type="checkbox" ${task.completed ? "checked" : ""}>
						<label>${task.text}</label>
					</div>
					<div class="column">
						<i class="edit outline icon" onclick="showEditModal(${task.id})"></i>
						<i class="trash alternate outline remove icon" onclick="showRemoveModal(${
              task.id
            })"></i>
					</div>
				</li>
			`

    tasksList.insertAdjacentHTML("beforeend", element)
  })
}

// Add New Task To Local Storage
function addTask(event) {
  if (event.keyCode == 13) {
    list.push({
      id: list.length + 1,
      text: event.target.value,
      completed: false,
    })

    localStorage.setItem("tasks", JSON.stringify(list))

    new Noty({
      text: '<i class="check icon"></i> Task was successfully added.',
      layout: "bottomRight",
      timeout: 2000,
      progressBar: true,
      closeWith: ["click"],
      theme: "metroui",
    }).show()

    event.target.value = ""
    showTasksList()
  }
}

// Change Complete State
function completeTask(id) {
  // Get Task
  const taskIndex = list.findIndex(t => t.id == id)
  const task = list[taskIndex]

  // Change State
  task.completed = !task.completed
  list[taskIndex] = task

  // Save Changes
  localStorage.setItem("tasks", JSON.stringify(list))
  showTasksList()
}

// Remove Task
function removeTask(id) {
  // Change State
  list = list.filter(t => t.id !== id)
  localStorage.setItem("tasks", JSON.stringify(list))

  // Show Alert And Render List
  new Noty({
    text: '<i class="trash icon"></i> Task was successfully deleted.',
    type: "error",
    layout: "bottomRight",
    timeout: 2000,
    progressBar: true,
    closeWith: ["click"],
    theme: "metroui",
  }).show()
  showTasksList()
}

// Edit Task
function editTask(id) {
  const taskText = document.querySelector("#task-text").value

  // Get Task
  if (taskText == "" || taskText == null) return
  const taskIndex = list.findIndex(t => t.id == id)

  // Change State And Save Changes
  list[taskIndex].text = taskText
  localStorage.setItem("tasks", JSON.stringify(list))

  // Show Alert And Then Render List
  new Noty({
    text: '<i class="edit icon"></i> Task was successfully updated.',
    layout: "bottomRight",
    timeout: 2000,
    progressBar: true,
    closeWith: ["click"],
    theme: "metroui",
  }).show()
  showTasksList()
}

// Clear All Tasks
function clearAllTasks() {
  if (list.length > 0) {
    list = []
    localStorage.setItem("tasks", JSON.stringify(list))
    return showTasksList()
  }

  new Noty({
    type: "error",
    text: '<i class="close icon"></i> There is no task to remove.',
    layout: "bottomRight",
    timeout: 2000,
    progressBar: true,
    closeWith: ["click"],
    theme: "metroui",
  }).show()
}

// Clear Complete Tasks
function clearCompleteTasks() {
  if (list.length > 0) {
    if (confirm("Are you sure?")) {
      const filteredTasks = list.filter(t => t.completed !== true)
      localStorage.setItem("tasks", JSON.stringify(filteredTasks))
      return showTasksList()
    }
  }

  Toastify({
    text: "There is no task to remove",
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "left",
    backgroundColor: "linear-gradient(to right, #e45757, #d44747)",
    stopOnFocus: true,
  }).showToast()
}

// Show Edit Modal And Pass Data
function showEditModal(id) {
  const taskIndex = list.findIndex(t => t.id == id)
  const { text } = list[taskIndex]

  document.querySelector("#edit-modal .content #task-id").value = id
  document.querySelector("#edit-modal .content #task-text").value = text
  document
    .querySelector("#update-button")
    .setAttribute("onclick", `editTask(${id})`)

  $("#edit-modal.modal").modal("show")
}

// Show Remove Modal
function showRemoveModal(id) {
  document
    .querySelector("#remove-button")
    .setAttribute("onclick", `removeTask(${id})`)

  $("#remove-modal.modal").modal("show")
}

// Show Clear All Tasks Modal
function showClearAllTasksModal() {
  if (list.length > 0) {
    return $("#clear-all-tasks-modal.modal").modal("show")
  }

  new Noty({
    type: "error",
    text: '<i class="close icon"></i> There is no task to remove.',
    layout: "bottomRight",
    timeout: 2000,
    progressBar: true,
    closeWith: ["click"],
    theme: "metroui",
  }).show()
}

// Event Listeners
addTaskInput.addEventListener("keypress", addTask)
window.addEventListener("load", () => addTaskInput.focus())

showTasksList()
