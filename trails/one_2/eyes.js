document.addEventListener("click", function(event) {
  eyes(event.clientX, event.clientY, 20 + Math.random() * 50, event);
});


function eyes(x, y, size, event) {
  var canvas = document.createElement("canvas"),
      context = canvas.getContext("2d");
  document.body.appendChild(canvas);
  canvas.style.position = "absolute";
  canvas.style.left = (x - size - 5) + "px";
  canvas.style.top = (y - size  / 2 - 5) + "px";

  var rect = canvas.getBoundingClientRect();
  canvas.width = size * 2 + 10;
  canvas.height = size + 10;

  onMouseMove(event);

  document.addEventListener("mousemove", onMouseMove);

  function onMouseMove(event) {
    var x = event.clientX - rect.left,
        y = event.clientY - rect.top;
    context.clearRect(0, 0, size * 2 + 10, size + 10);
    drawEye(x, y, size / 2 + 5, size / 2 + 5);
    drawEye(x, y, size * 1.5 + 5, size / 2 + 5);
  }

  function drawEye(x, y, cx, cy) {
    var dx = x - cx,
        dy = y - cy,
        angle = Math.atan2(dy, dx);
    context.save();
    context.translate(cx, cy);
    context.rotate(angle);
    context.beginPath();
    context.arc(0, 0, size / 2, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.arc(size * 0.4, 0, size * 0.1, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}document.addEventListener("click", function(event) {
  eyes(event.clientX, event.clientY, 20 + Math.random() * 50, event);
});




function onMouseMove(event) {
  var x = event.clientX - rect.left,
      y = event.clientY - rect.top;
  context.clearRect(0, 0, size * 2 + 10, size + 10);
  drawEye(x, y, size / 2 + 5, size / 2 + 5);
  drawEye(x, y, size * 1.5 + 5, size / 2 + 5);
}

function eyes(x, y, size, event) {


  // document.addEventListener("mousemove", onMouseMove);

onMouseMove(event);

  function drawEye(x, y, cx, cy) {
    var dx = x - cx,
        dy = y - cy,
        angle = Math.atan2(dy, dx);
    context.save();
    context.translate(cx, cy);
    context.rotate(angle);
    context.beginPath();
    context.arc(0, 0, size / 2, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.arc(size * 0.4, 0, size * 0.1, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

var canvas = document.createElement("canvas"),
    context = canvas.getContext("2d");

document.body.appendChild(canvas);

canvas.style.position = "absolute";
// canvas.style.left = (x - size - 5) + "px";
// canvas.style.top = (y - size  / 2 - 5) + "px";
var size = 1000
var rect = canvas.getBoundingClientRect();
canvas.width = size * 2 + 10;
canvas.height = size + 10;

