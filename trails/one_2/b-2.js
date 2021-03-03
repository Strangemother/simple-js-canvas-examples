
const render_first = function(count){
    tendrils = [];
    count = count || settings.trails;
    let pos = 0
    for (var j = 0; j < count; j++) {
        for (var i = 0; i < count; i++) {
            pos++;
            let s = new Spot({
                spring: 0.5 + 0.025 * (i / count)
                , friction: settings.friction
                , index: i
                , row: j
                , position: pos
                , count: count
                , padding: 40
                , x: 200
                , y: 20
                , offsetX: Math.random() * 40
                , offsetY: Math.random() * 40
            })

            tendrils.push(s);
        }
    }

    tendrils.each(function(e){
        e.update()
        e.options.offsetX = Math.random() * 40
        e.options.offsetY = Math.random() * 40
        e.neighbours = undefined
        // e.options.offsetX = 0
        // e.options.offsetY = 0
    })
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


// [distance(a.x, a.y, b.x, b.y), hypotDist(a.x, a.y, b.x, b.y)]
// [71.38548106780122, 71.38548106780122]
//
const hypotDist = function(x,y, x2, y2) {
    return Math.hypot(x2 - x, y2 - y)
}

const distance = function(x1, y1, x2, y2) {
    let a = x1 - x2;
    let b = y1 - y2;

    return Math.sqrt( a*a + b*b );
}

Array.prototype.each = function(f){
    for (var i = 0; i < this.length; i++) {
        f(this[i])
    }
}


const rebuildDistances = function(owner, neighbours) {

    neighbours.each(function(e){
        e[0] = hypotDist(owner.x, owner.y, e.x, e.y) * Math.random()
    })

    return neighbours.sort(function(a, b) {
        // a - b (asc), b - a (desc)
        return a[0] - b[0];
    });

}

const getNearest = function(x, y, count=10, slice=true, nodes=undefined) {
    others = []
    let items = tendrils

    if(nodes != undefined) {
        items = [];
        nodes.each(function(e){

            items.push(e[1])
        })
     }

    items.each(function(e){
        if(e.x == undefined) {
            return
        }
        let d = hypotDist(x, y, e.x, e.y)

        others.push([d, e])
    })

    others = others.sort(function(a, b) {
        // a - b (asc), b - a (desc)
        return a[0] - b[0];
    });


    let oneOffset = Number(others[0] != undefined) && slice
    return others.slice(oneOffset, count + oneOffset+1)

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
