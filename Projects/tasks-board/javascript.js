// this function take the values from the HTML form
function add_task_to_board() {
  let task = document.getElementById('task-to-do').value;
  let date = document.getElementById('date').value;
  let time = document.getElementById('time').value;
  let tasks = getTasks();

  // Object in JSON format
  let note = {
    task: task,
    date: formatted_date(date),
    time: time,
  };

  /*this check there are not empty values in form inputs. if empty inputs exist the correct
  message will save to the variable alertMsg(could be different messgae,depending on user mistake)*/
  let alertMsg = '';

  Object.keys(note).forEach(function (key) {
    if (note[key] === '') {
      alertMsg += `❎ ${key.toUpperCase()} is required\n`;
    }
  });

  /*if error/s create/s(alertMsg isn't empty) its will not draw the note.
  else it's take and push the note to the local storage array.
  after that it's will draw the task/s (from local storage)to the screen and clear the form.*/
  if (alertMsg !== '') {
    alert(`${alertMsg}`);
    draw_notes(tasks, false);
  } else {
    pushToStorageTasks(note);
    draw_notes(getTasks());
  }

  clear_form();
}

draw_notes(getTasks(), false);

/* this function will return empty array if the local storage is empty
and if not it will return the local storage that already create(after it's change the
string back to Object in JSON format)*/
function getTasks() {
  if (localStorage.getItem('tasks') === null) {
    return [];
  } else {
    return JSON.parse(localStorage.getItem('tasks'));
  }
}

// the function push and set the note to local storage
function pushToStorageTasks(note) {
  let tasks = getTasks();
  tasks.push(note);
  setStorageTasks(tasks);
}

// this function takes the array of note/s and then set the array in the local storage
function setStorageTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/*if all of the inputs are not empty the function will draw the note/s task/s from the
local storage to screen by using create createElement,appendChild,classList and more*/
function draw_notes(tasks, isAdding = true) {
  // note/s task/s area
  let placeOfNotes = document.querySelector('#notePlace');
  placeOfNotes.classList.add('boardPlace');
  placeOfNotes.innerHTML = '';

  for (let i = 0; i < tasks.length; i++) {
    let createDiv = document.createElement('div');
    createDiv.id = `note-${i}`;
    createDiv.classList.add('div-style');
    if (i === tasks.length - 1 && isAdding) {
      createDiv.classList.add('fade-in');
    }
    placeOfNotes.appendChild(createDiv);

    let deleteNote = document.createElement('span');
    deleteNote.innerHTML =
      '<i class="fa fa-times-circle fa-2x" style="visibility: hidden;" onClick="delete_this_node(' +
      i +
      ')">';
    deleteNote.id = `close-button-${i}`;
    deleteNote.classList.add('deleteNotea-style');
    createDiv.appendChild(deleteNote);

    let paragraphDiv = document.createElement('div');
    paragraphDiv.classList.add('paragraphDiv-style');
    paragraphDiv.classList.add('overflow-auto');
    paragraphDiv.innerText = tasks[i].task;
    createDiv.appendChild(paragraphDiv);

    let dateAndTimeArea = document.createElement('div');
    dateAndTimeArea.classList.add('dateAndTimeArea');
    createDiv.appendChild(dateAndTimeArea);

    let dateArea = document.createElement('span');
    dateArea.innerText = tasks[i].date;
    dateAndTimeArea.appendChild(dateArea);

    let timeArea = document.createElement('span');
    timeArea.innerText = tasks[i].time;
    timeArea.classList.add('timeArea');
    dateAndTimeArea.appendChild(timeArea);

    /*when the mouse fly over the note the option to delete only this specific
    note will be visible, otherwise it's will be hidden*/
    createDiv.addEventListener('mouseover', function () {
      deleteNote.firstElementChild.style.visibility = 'visible';
    });

    createDiv.addEventListener('mouseout', function () {
      deleteNote.firstElementChild.style.visibility = 'hidden';
    });
  }
}

// this will clear the inputs and after refresh the page
function clear_form() {
  document.getElementById('task-to-do').value = '';
  document.getElementById('date').value = '';
  document.getElementById('time').value = '';
}

/*if the local storage array undefined or empty, alert will show ,otherwise another
alert show so the user decide if delete all or cancel*/
function check_before_delete() {
  let tasks = getTasks();
  if (tasks == undefined || tasks.length < 1) {
    alert('NO TASKS EXIST IN BOARD! 😅');
  } else {
    delete_all_tasks();
  }
}

/*if the decision was true all the tasks exist on the board will delete.
if the decision was false nothing will happen.*/
function delete_all_tasks() {
  let decision = confirm('Are You Sure You Want To Delete All Your Tasks? 🤔');
  if (decision == true) {
    setStorageTasks([]);
    draw_notes([]);
  } else {
    return;
  }
}

/*the function delete specific note from the local storage note's array.
after the delete it's set new array to local storage and then draw to screen.*/
function delete_this_node(the_key) {
  let tasks = getTasks();
  tasks.splice(the_key, 1);
  setStorageTasks(tasks);
  draw_notes(getTasks(), false);
}

/*this function return the date in new format if its not empty.
if empty it's will return "" */
function formatted_date(dateToFormat) {
  if (dateToFormat === '') {
    return '';
  } else {
    let month = String(dateToFormat.slice(5, 7));
    let day = String(dateToFormat.slice(8, 10));
    let year = String(dateToFormat.slice(0, 4));
    return `${day}/${month}/${year}`;
  }
}
