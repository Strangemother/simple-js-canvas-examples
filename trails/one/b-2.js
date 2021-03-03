
const render_first = function(count){
    tendrils = [];
    count = count || settings.trails;

    for (var j = 0; j < count; j++) {
        for (var i = 0; i < count; i++) {

            tendrils.push(new Spot({
                spring: 0.5 + 0.025 * (i / count)
                , friction: settings.friction
                , index: i
                , row: j
                , count: count
                , padding: 20
                , x: 200
                , y: 20
                , offsetX: 0
                , offsetY: 0
            }));
        }
    }
}


const render_update = function(ctx){

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000'// 'rgba(8,5,16,0.4)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    // ctx.strokeStyle = 'hsla(170,90%,50%,0.25)';
    // ctx.strokeStyle = 'hsla(' + Math.round(hue.value()) + ',90%,50%,0.25)';
    // ctx.lineWidth = 1;

    // if (ctx.frame % 60 == 0) {
    //     // console.log(hue.update(), Math.round(hue.update()), hue.phase, hue.offset, hue.frequency, hue.amplitude);
    //     console.log(hue.offset, hue.frequency, hue.amplitude, hue.phase);
    //     // console.log(hue.value());
    // }

    hue.update()

    for (var i = 0, tendril; i < tendrils.length; i++) {
        tendril = tendrils[i];
        tendril.frame = ctx.frame;
        tendril.update();
        tendril.draw();
    }

    ctx.frame++;
}





function x_animate(){
    t=0;
    v = window.setInterval(function(){
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

let infinity_loop_xy_func = function(t, s) {
    let scale = (s || 2) / (3 - Math.cos(2*t));
    let x = scale * Math.cos(t);
    let y = scale * Math.sin(2*t) / 2;
    return [x, y]
}
