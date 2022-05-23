//initial empty object to hold tasks
var tasks = {};

//Constructs a task. pass in the text, date, and which list the task belongs
var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

//loads existing tasks objects from local storage
var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties. list = the name of the task list (e.g. toDo, inProgress, etc). arr = the array of task objects contained in that list
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array, the task object containing the text, date, and list value
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

//saves the current tasks array to localStorage
var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};



// modal refers to the item displayed when the Add Task button is clicked
// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values from the input fields when the modal is first shown to user
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  // basic validation, if text is present in both inputs, then run the createTask function
  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    //updates localStorage with new tasks
    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  //updates local storage with new empty task arrays
  saveTasks();
});

// load tasks for the first time
loadTasks();


