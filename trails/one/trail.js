
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

        this.spring = options.spring + (Math.random() * 0.1) - 0.05;
        this.friction = options.friction + (Math.random() * 0.01) - 0.005;
        this.nodes = [];
        this.lineWidth = options.lineWidth || settings.lineWidth || 1;

        for (var i = 0, node; i < settings.size; i++) {

            node = new Node();
            node.x = target.x;
            node.y = target.y;

            this.nodes.push(node);
        }
    }

    update() {

        var spring = this.spring,
            node = this.nodes[0];


        node.vx += (target.x - node.x) * spring;
        node.vy += (target.y - node.y) * spring;


        let _speed = Math.abs(speed[0]) + Math.abs(speed[1]) * .03
        let sd = settings.dampening

        for (var prev, i = 0, n = this.nodes.length; i < n; i++) {

            node = this.nodes[i];

            if (i > 0) {

                prev = this.nodes[i - 1];

                node.vx += (prev.x - node.x) * spring;
                node.vy += (prev.y - node.y) * spring;
                node.vx += prev.vx * sd;
                node.vy += prev.vy * sd;
            }

            node.vx *= this.friction;
            node.vy *= this.friction;
            node.x += node.vx;
            node.y += node.vy;

            spring *= settings.tension;
        }
    }

    draw() {

        var x = this.nodes[0].x,
            y = this.nodes[0].y,
            a, b;

        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (var i = 1, n = this.nodes.length - 2; i < n; i++) {

            a = this.nodes[i];
            b = this.nodes[i + 1];
            x = (a.x + b.x) * 0.5;
            y = (a.y + b.y) * 0.5;


            // var circle = new Path2D();
            // circle.arc(x, y, 1, 0, 2 * Math.PI);
            // // ctx.stroke(rectangle);
            // ctx.fillStyle = '#EEE'
            // ctx.fill(circle);

            ctx.quadraticCurveTo(a.x, a.y, x, y);
        }

        a = this.nodes[i];
        b = this.nodes[i + 1];

        ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
        ctx.stroke();
        ctx.closePath();
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
