
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

    }

    update() {
        let o = this.options
        let padding = o.padding || 20
        let t = {x:o.x, y:o.y}//target;
        this.x = t.x + o.offsetX + padding * (o.index + 1)
        this.y = t.y + o.offsetY + padding * (o.row + 1)
    }

    draw() {

        var x = this.x,
            y = this.y,
            a, b;

        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(x, y);

        var circle = new Path2D();
        circle.arc(x, y, 3, 0, 2 * Math.PI);
        // ctx.stroke(rectangle);
        // ctx.fillStyle = '#EEE'
        let index = this.options.index
        let row = this.options.row + index
        let h = Math.round(hue.value() + ( (row + index) * 5))
        ctx.fillStyle = 'hsla(' + h + ',90%,50%,0.5)';
        ctx.fill(circle);

        let r = 20 + Math.round(Math.random() * Math.sin(this.frame) + Math.cos(this.frame))
        if ((this.frame + this.options.index) % r == 0) {
            // this.options.offsetX = (Math.random() * 1) + Math.sin(this.frame)
            // this.options.offsetY = (Math.random() * 1) + Math.cos(this.frame)
        }

        let pulseStrength = 30
        let frequency = .05
        // if((this.frame + row) % 1 == 0) {
            let ind = row//this.options.index//row
            let [_x,_y] = infinity_loop_xy_func((this.frame+ind) * frequency)
            this.options.offsetX = this.computeOffset(_x ) * pulseStrength
            this.options.offsetY = this.computeOffset(_y ) * pulseStrength
        // }
    }

    computeOffset(v) {
        return v * v * v
    }
}

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
