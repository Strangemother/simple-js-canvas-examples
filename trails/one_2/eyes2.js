document.addEventListener("click", function(event) {
  eyes(event.clientX, event.clientY, 20 + Math.random() * 50, event);
});




function onMouseMove(event) {

var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left,
      y = event.clientY - rect.top;
    // console.log(x,y)

  ctx.clearRect(0, 0, 800, 600)//size * 2 + 10, size + 10);
  drawEye(x, y, 0, 0, [x,y] )//size / 2 + 5, size / 2 + 5);
  // drawEye(x, y, size * 1.5 + 5, size / 2 + 5);
}


function eyes(x, y, size, event) {
    onMouseMove(event);
}


function drawEye(x, y, cx, cy, origPoint) {
    var dx = x - cx,
        dy = y - cy
        ;
    let s_2 = size/2;
    let distance = 50;
    let padding = 40;

    if(dx > s_2) {
        cx = dx - distance
    }

      if(cx < s_2 + padding) {
          cx = s_2 + padding
      }

    if(dy > s_2) {
        cy = dy - distance
    }
    if(cy < s_2 + padding) {
        cy = s_2 + padding
    }

    let angle = Math.atan2(dy, dx);


    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();

    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'red'
    ctx.fillStyle = 'red'
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(size * 0.4, 0, size * 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();

    ctx.moveTo(origPoint[0], origPoint[1])
    ctx.lineTo(dx, dy);
    ctx.stroke();

    ctx.restore();
}

// var canvas = document.createElement("canvas"),
ctx = document.getElementById('canvas').getContext("2d");

// document.body.appendChild(canvas);

// canvas.style.position = "absolute";
// canvas.style.left = (x - size - 5) + "px";
// canvas.style.top = (y - size  / 2 - 5) + "px";
var size = 100
document.addEventListener("mousemove", onMouseMove);
// canvas.width = size * 2 + 10;
// canvas.height = size + 10;

