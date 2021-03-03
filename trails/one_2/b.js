
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
        target = { x: 0, y: 0},
        tendrils = [],
        settings = {};

    settings.debug = true;
    settings.friction = 0.5;
    settings.trails = 15
    settings.size = 30;
    settings.dampening = 0.25;
    settings.tension = 0.98;
    settings.minor = 1;
    settings.lineWidth = 3;

    Math.TWO_PI = Math.PI * 2;

    // ========================================================================================
    // Spot hovertree.com
    // ----------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------

    function init(event) {

        document.removeEventListener('mousemove', init);
        document.removeEventListener('touchstart', init);

        document.addEventListener('mousemove', mousemove);
        document.addEventListener('touchmove', mousemove);
        document.addEventListener('touchstart', touchstart);
        console.log('init')
        mousemove(event);
        reset();
        loop();
    }

    function reset(count) {

        render_first()

    }

    function loop() {

        if (!ctx.running) return;

        render_update(ctx)

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
            amplitude: 300,
            frequency: 0.009,
            offset: 2
        });



        document.addEventListener('mousemove', init);
        document.addEventListener('touchstart', init);
        document.body.addEventListener('orientationchange', resize);
        window.addEventListener('resize', resize);
        window.addEventListener('keyup', keyup);
        window.addEventListener('focus', start);
        // window.addEventListener('blur', stop);

        resize();
        init({ preventDefault(){} })
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
