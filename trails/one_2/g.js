
// accelerate = function(item, delta){
//     item.x += item.ax * delta * delta;
//     item.y += item.ay * delta * delta;
//     item.ax = 0;
//     item.ay = 0;
// }

// step = function(){
//     this.delta += 1
//     for (var i = this.bodies.length - 1; i >= 0; i--) {
//         this.accelerate(this.bodies[i], this.delta)
//     }
// }
//


function animate(){
    t=0;v = window.setInterval(function(){
    t+=.06

    scale = 2 / (3 - Math.cos(2*t));
    x = scale * Math.cos(t);
    y = scale * Math.sin(2*t) / 2;
    s = 100

    mousemove({
    clientX: 200 + (Math.random() * 10) + x * s, // Math.cos(t)*50,
    clientY: 200 + (Math.random() * 10) + y * s,// Math.sin(t)*50,
    preventDefault(){}
    })

    }, 16)
}


        // ; (function (window) {

            var ctx,
                hue,
                logo,
                form,
                buffer,
                target = {},
                tendrils = [],
                settings = {};

            settings.debug = true;
            settings.friction = 0.5;
            settings.trails = 3;
            // settings.size = 3;
            settings.dampening = 0.25;
            settings.tension = 0.98;
            settings.minor = 1;
            settings.lineWidth = 3;

            Math.TWO_PI = Math.PI * 2;

            // ========================================================================================
             // Oscillator 何问起
            // ----------------------------------------------------------------------------------------

            function Oscillator(options) {
                this.init(options || {});
            }

            Oscillator.prototype = (function () {

                var value = 0;

                return {

                    init: function (options) {
                        this.phase = options.phase || 0;
                        this.offset = options.offset || 0;
                        this.frequency = options.frequency || 0.001;
                        this.amplitude = options.amplitude || 1;
                        this.minor = options.minor || 1;
                    },

                    update: function () {
                        this.phase += this.frequency;
                        value = this.offset + ((Math.sin(this.phase) * this.amplitude) * this.minor);
                        return value;
                    },

                    value: function () {
                        return value;
                    }
                };

            })();

            // ========================================================================================
            // Tendril hovertree.com
            // ----------------------------------------------------------------------------------------

            function Tendril(options) {
                this.init(options || {});
            }

            Tendril.prototype = (function () {

                function Node() {
                    this.x = 0;
                    this.y = 0;
                    this.vy = 0;
                    this.vx = 0;

                }

                return {

                    init: function (options) {

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
                    },

                    update: function () {

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
                    },

                    draw: function () {

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
                };

            })();

            // ----------------------------------------------------------------------------------------

            function init(event) {

                document.removeEventListener('mousemove', init);
                document.removeEventListener('touchstart', init);

                document.addEventListener('mousemove', mousemove);
                document.addEventListener('touchmove', mousemove);
                document.addEventListener('touchstart', touchstart);

                mousemove(event);
                reset();
                loop();
            }

            function reset(count) {

                tendrils = [];
                count = count || settings.trails;

                for (var i = 0; i < count; i++) {

                    tendrils.push(new Tendril({
                        spring: 0.5 + 0.025 * (i / count)
                        , friction: settings.friction
                    }));
                }
            }

            function loop() {

                if (!ctx.running) return;

                ctx.globalCompositeOperation = 'source-over';
                ctx.fillStyle = 'rgba(8,5,16,0.4)';
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.globalCompositeOperation = 'lighter';
                // ctx.strokeStyle = 'hsla(170,90%,50%,0.25)';
                ctx.strokeStyle = 'hsla(' + Math.round(hue.value()) + ',90%,50%,0.25)';
                ctx.lineWidth = 1;

                if (ctx.frame % 60 == 0) {
                    // console.log(hue.update(), Math.round(hue.update()), hue.phase, hue.offset, hue.frequency, hue.amplitude);
                    console.log(hue.offset, hue.frequency, hue.amplitude, hue.phase);
                    // console.log(hue.value());
                }

                hue.update()

                for (var i = 0, tendril; i < settings.trails; i++) {
                    tendril = tendrils[i];
                    tendril.update();
                    tendril.draw();
                }

                ctx.frame++;
                // ctx.stats.update();
                requestAnimFrame(loop);
            }

            function resize() {
                ctx.canvas.width = window.innerWidth;
                ctx.canvas.height = window.innerHeight;
            }

            function start() {
                if (!ctx.running) {
                    ctx.running = true;
                    loop();
                }
            }

            function stop() {
                ctx.running = false;
            }

            function mousemove(event) {
                if (event.touches) {
                    target.x = event.touches[0].pageX;
                    target.y = event.touches[0].pageY;
                } else {
                    target.x = event.clientX
                    target.y = event.clientY;
                }
                // hue.lightness = Math.abs(speed[0]) + Math.abs(speed[1]) * .5
                // console.log(speedX,speedY)
                event.preventDefault();
            }

            function touchstart(event) {
                if (event.touches.length == 1) {
                    target.x = event.touches[0].pageX;
                    target.y = event.touches[0].pageY;
                }
            }

            function keyup(event) {
            }


            window.requestAnimFrame = (function () {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (fn) { window.setTimeout(fn, 1000 / 12) };
            })();

            window.onload = function () {

                ctx = document.getElementById('canvas').getContext('2d');
                // ctx.stats = new Stats();
                ctx.running = true;
                ctx.frame = 1;



                hue = new Oscillator({
                    phase: Math.random() * Math.TWO_PI,
                    amplitude: 85,
                    frequency: 0.0015,
                    offset: 285
                });



                document.addEventListener('mousemove', init);
                document.addEventListener('touchstart', init);
                document.body.addEventListener('orientationchange', resize);
                window.addEventListener('resize', resize);
                window.addEventListener('keyup', keyup);
                window.addEventListener('focus', start);
                // window.addEventListener('blur', stop);

                resize();

                if (window.DEBUG) {

                    var gui = new dat.GUI();

                    // gui.add(settings, 'debug');
                    settings.gui.add(settings, 'trails', 1, 30).onChange(reset);
                    settings.gui.add(settings, 'size', 25, 75).onFinishChange(reset);
                    settings.gui.add(settings, 'friction', 0.45, 0.55).onFinishChange(reset);
                    settings.gui.add(settings, 'dampening', 0.01, 0.4).onFinishChange(reset);
                    settings.gui.add(settings, 'tension', 0.95, 0.999).onFinishChange(reset);

                    // document.body.appendChild(ctx.stats.domElement);
                }
            };

        // })(window);
        //
var timestamp = null;
var lastMouseX = null;
var lastMouseY = null;
var speed = [0, 0]

document.body.addEventListener("mousemove", function(e) {
    if (timestamp === null) {
        timestamp = Date.now();
        lastMouseX = e.screenX;
        lastMouseY = e.screenY;
        return;
    }

    var now = Date.now();
    var dt =  now - timestamp;
    var dx = e.screenX - lastMouseX;
    var dy = e.screenY - lastMouseY;
    var speedX = Math.round(dx / dt * 100);
    var speedY = Math.round(dy / dt * 100);

    timestamp = now;
    lastMouseX = e.screenX;
    lastMouseY = e.screenY;
    speed = [speedX, speedY]
});

// window.setInterval(function(){
//     console.log(speed)
// }, 200)
