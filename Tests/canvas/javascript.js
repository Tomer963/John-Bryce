function check_input() {
  var radius = document.getElementById('radius').value;
  let check = /[0-9]/;
  if (
    (check.test(radius) == true) &
    (radius <= document.getElementById('my-canvas').width / 2)
  ) {
    draw_ball(radius);
    document.getElementById('volume').value = check_volume(radius);
  } else {
    show_radius_error(
      "fix to valid radius(remember: radius can't be over 200)"
    );
    return;
  }
}

function check_volume(radius) {
  var volume = (4 * Math.PI * Math.pow(radius, 3)) / 3;
  return volume;
}

function show_radius_error(msg) {
  alert(msg);
  document.getElementById('radius').value = '';
  document.getElementById('radius').focus();
}

function draw_ball(r) {
  var canvas = document.getElementById('my-canvas');
  var context = canvas.getContext('2d');
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  context.beginPath();
  context.arc(canvasWidth / 2, canvasHeight / 2, r, 0, 2 * Math.PI);
  context.stroke();
}

function clear_all() {
  document.getElementById('radius').value = '';
  document.getElementById('volume').value = '';
  var canvas = document.getElementById('my-canvas');
  var context = canvas.getContext('2d');
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
}
