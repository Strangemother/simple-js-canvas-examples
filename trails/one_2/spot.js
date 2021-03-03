
function Node() {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.vx = 0;
}


class Spot {

    constructor(options){

        this.init(options || {});
    }

    init(options) {
        this.options = options
        this.frame = 0
        this.deleted = false
    }

    update() {
        let o = this.options
        let padding = o.padding || 20
        let t = {x:o.x, y:o.y}//target;
        this.x = t.x + o.offsetX + padding * (o.index + 1)
        this.y = t.y + o.offsetY + padding * (o.row + 1)

        if(!this.neighbours) {
            let nbs = this.neighbours = getNearest(this.x, this.y, 5)
            nbs.each(function(e){
                if(e[0] < 20)  {
                    e[1].deleted=true
                }
            })
        }document.addEventListener("click", function(event) {
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
}
        //debugger
    }

    draw() {

        var x = this.x,
            y = this.y,
            a, b;

        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(x, y);

        this.drawSpot(ctx)

        if(this.neighbours.length > 0){
             this.drawLine(ctx)
         }

        let r = 20 + Math.round(Math.random() * Math.sin(this.frame) + Math.cos(this.frame))
        if( (this.frame + this.options.index) % 60 == 0) {
            // this.neighbours = getNearest(this.x, this.y, 5, true, this.neighbours)
            // this.neighbours = undefined; //rebuildDistances(this, this.neighbours)
        }

        this.pulseOffset()
    }

    pulseOffset(){
        let pulseStrength = 1.3
        let frequency = .05
        // if((this.frame + row) % 1 == 0) {
            let row = this.options.row + this.options.index
            let ind = row//this.options.index//row
            let [_x,_y] = infinity_loop_xy_func((this.frame+ind) * frequency)
            this.options.offsetX += this.computeOffset(_x ) * -pulseStrength
            this.options.offsetY += this.computeOffset(_y ) * pulseStrength * Math.cos(_y)
        // }
    }

    drawSpot(ctx) {
        var circle = new Path2D();
        circle.arc(this.x, this.y, 3, 0, 2 * Math.PI);
        // ctx.stroke(rectangle);
        // ctx.fillStyle = '#EEE'
        //
        let index = this.options.index
        let row = this.options.row + index

        if(this.deleted) {
            ctx.fillStyle = 'red';
        } else {
            let h = Math.round(hue.value() + ( (row + index) * 5))
            ctx.fillStyle = 'hsla(' + h + ',90%,50%,0.5)';
        }

        ctx.fill(circle);
    }

    drawLine(ctx) {
        // var line = new Path2D();
        // ctx.lineTo(this.x + 20, this.y + 10);
        ctx.lineWidth = 2

        if(!this.deleted) {

        // if(this.options.position == 0) {
            drawLines(ctx, this)
        // }
        }
        ctx.strokeStyle = 'green';


        // let index = this.options.index
        // let row = this.options.row + index

        // let h = Math.round(hue.value() + ( (row + index) * 5))
        ctx.fillStyle = 'hsla(200,90%,50%,0.5)';
        ctx.color = 'white';
        ctx.stroke();
        // ctx.fill(line);
    }

    computeOffset(v) {
        return v * v * v
    }
}

let drawLines = function(ctx, spot) {
    let [x,y] = [spot.x, spot.y]

    for(let i=0; i < spot.neighbours.length; i++) {
        let a = spot.neighbours[i][1]
        if (a.deleted) {
            continue
        }

        ctx.strokeStyle = 'green'
        ctx.moveTo(x, y);
        // ctx.quadraticCurveTo(a.x, a.y, a.x, a.y);
        ctx.lineTo(a.x , a.y);

        var circle = new Path2D();
        circle.arc(a.x, a.y, 5, 0, 2 * Math.PI);

        ctx.strokeStyle = 'green'
        ctx.lineWidth = 1
        ctx.stroke(circle)
        break
    }
    // let a = spot.neighbours[0][1]

    // if(spot.neighbours[1] == undefined)  return
    // ctx.moveTo(x, y);
    // a = spot.neighbours[1][1]
    // ctx.lineTo(a.x, a.y);


}

stash = {}
// function _Spot(options) {
    //     this.init(options || {});
    // }

    // _Spot.prototype = (function () {

    //     function Node() {
    //         this.x = 0;
    //         this.y = 0;
    //         this.vy = 0;
    //         this.vx = 0;
    //     }

    //     return {

    //         init: function (options) {

    //             this.spring = options.spring + (Math.random() * 0.1) - 0.05;
    //             this.friction = options.friction + (Math.random() * 0.01) - 0.005;
    //             this.nodes = [];
    //             this.lineWidth = options.lineWidth || settings.lineWidth || 1;

    //             for (var i = 0, node; i < settings.size; i++) {

    //                 node = new Node();
    //                 node.x = target.x;
    //                 node.y = target.y;

    //                 this.nodes.push(node);
    //             }
    //         },

    //         update: function () {

    //             var spring = this.spring,
    //                 node = this.nodes[0];


    //             node.vx += (target.x - node.x) * spring;
    //             node.vy += (target.y - node.y) * spring;


    //             let _speed = Math.abs(speed[0]) + Math.abs(speed[1]) * .03
    //             let sd = settings.dampening

    //             for (var prev, i = 0, n = this.nodes.length; i < n; i++) {

    //                 node = this.nodes[i];

    //                 if (i > 0) {

    //                     prev = this.nodes[i - 1];

    //                     node.vx += (prev.x - node.x) * spring;
    //                     node.vy += (prev.y - node.y) * spring;
    //                     node.vx += prev.vx * sd;
    //                     node.vy += prev.vy * sd;
    //                 }

    //                 node.vx *= this.friction;
    //                 node.vy *= this.friction;
    //                 node.x += node.vx;
    //                 node.y += node.vy;

    //                 spring *= settings.tension;
    //             }
    //         },

    //         draw: function () {

    //             var x = this.nodes[0].x,
    //                 y = this.nodes[0].y,
    //                 a, b;

    //             ctx.lineWidth = this.lineWidth;
    //             ctx.beginPath();
    //             ctx.moveTo(x, y);
    //             for (var i = 1, n = this.nodes.length - 2; i < n; i++) {

    //                 a = this.nodes[i];
    //                 b = this.nodes[i + 1];
    //                 x = (a.x + b.x) * 0.5;
    //                 y = (a.y + b.y) * 0.5;


    //                 // var circle = new Path2D();
    //                 // circle.arc(x, y, 1, 0, 2 * Math.PI);
    //                 // // ctx.stroke(rectangle);
    //                 // ctx.fillStyle = '#EEE'
    //                 // ctx.fill(circle);

    //                 ctx.quadraticCurveTo(a.x, a.y, x, y);
    //             }

    //             a = this.nodes[i];
    //             b = this.nodes[i + 1];

    //             ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
    //             ctx.stroke();
    //             ctx.closePath();
    //         }
    //     };

    // })();
