(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var Nodes = {

  // Settings
  density: 15,
  drawDistance: 15,
  baseRadius: 2,
  maxLineThickness: 10,
  reactionSensitivity: 3,
  lineThickness: 1,


  points: [],
  mouse: { x: -1000, y: -1000, down: false },

  animation: null,

  canvas: null,
  context: null,

  imageInput: null,
  bgImage: null,
  bgCanvas: null,
  bgContext: null,
  bgContextPixelData: null,

  init: function() {
    // Set up the visual canvas
    this.canvas = document.getElementById( 'canvas' );
    this.context = canvas.getContext( '2d' );
    // this.context.globalCompositeOperation = "lighter";
    // this.canvas.width = window.innerWidth;
    // this.canvas.height = window.innerHeight;
    // this.canvas.style.display = 'block'

    this.imageInput = document.createElement( 'input' );
    this.imageInput.setAttribute( 'type', 'file' );
    this.imageInput.style.visibility = 'hidden';
    this.imageInput.addEventListener('change', this.upload, false);
    document.body.appendChild( this.imageInput );

    this.canvas.addEventListener('mousemove', this.mouseMove, false);
    this.canvas.addEventListener('mousedown', this.mouseDown, false);
    this.canvas.addEventListener('mouseup',   this.mouseUp,   false);
    this.canvas.addEventListener('mouseout',  this.mouseOut,  false);

    window.onresize = function(event) {
      Nodes.canvas.width = event.currentTarget.innerWidth;
      Nodes.canvas.height = event.currentTarget.innerHeight;
      Nodes.onWindowResize();
    }

    // Load initial input image (the chrome logo!)
    this.loadData( 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzIuOTYgMTE0LjAxIj4KIDxwYXRoIGZpbGw9IiM0MTMwMDAiIGQ9Im0xNjMuNTksMzguODA2Yy01Ljk4NSwwLTEwLjQ0MiwyLjkzODktMTAuNDQyLDEwLjAxMiwwLDUuMzI5MSwyLjkzNzUsOS4wMjg0LDEwLjEyLDkuMDI4NCw2LjA4NzUsMCwxMC4yMjItMy41ODY5LDEwLjIyMi05LjI0ODUsMC02LjQxNi0zLjctOS43OTE1LTkuOS05Ljc5MTV6bS0xMS45Nyw0OS45NGMtMS40MTYyLDEuNzM4Mi0yLjgyNzUsMy41ODUtMi44Mjc1LDUuNzY0NiwwLDQuMzQ4Miw1LjU0NSw1LjY1NjgsMTMuMTYyLDUuNjU2OCw2LjMxLDAsMTQuOTA1LTAuNDQxODgsMTQuOTA1LTYuMzA4NSwwLTMuNDg2OS00LjEzNS0zLjcwMjgtOS4zNi00LjAzMDRsLTE1Ljg4LTEuMDgyNXptMzIuMjAxLTQ5LjYxMWMxLjk1NSwyLjUwMjksNC4wMjUsNS45ODQ4LDQuMDI1LDEwLjk4OSwwLDEyLjA3NS05LjQ2NSwxOS4xNDYtMjMuMTY5LDE5LjE0Ni0zLjQ4NSwwLTYuNjQtMC40MzQxMi04LjU5NjItMC45NzcxMmwtMy41OTEyLDUuNzY0OCwxMC42NiwwLjY1MTI1YzE4LjgyMiwxLjE5OTIsMjkuOTE1LDEuNzQ0MiwyOS45MTUsMTYuMjA4LDAsMTIuNTE0LTEwLjk4NSwxOS41ODEtMjkuOTE1LDE5LjU4MS0xOS42OSwwLTI3LjE5Ni01LjAwNDktMjcuMTk2LTEzLjU5OCwwLTQuODk3NSwyLjE3NjItNy41MDI1LDUuOTgzOC0xMS4wOTgtMy41OTEyLTEuNTE4LTQuNzg2Mi00LjIzNjItNC43ODYyLTcuMTc0OCwwLTIuMzk1LDEuMTk1LTQuNTcwMiwzLjE1NjItNi42Mzg2LDEuOTU3NS0yLjA2NSw0LjEzMjUtNC4xMzQ4LDYuNzQzOC02LjUyNzQtNS4zMy0yLjYxMDQtOS4zNTYyLTguMjY3Ni05LjM1NjItMTYuMzE5LDAtMTIuNTA5LDguMjY4OC0yMS4xLDI0LjkxLTIxLjEsNC42Nzg4LDAsNy41MDg4LDAuNDMwNjIsMTAuMDExLDEuMDg3NGgyMS4yMTV2OS4yNDQ2bC0xMC4wMSwwLjc2MTc1Ii8+CiA8cGF0aCBmaWxsPSIjNDEzMDAwIiBkPSJtMjEyLjk4LDE5LjM2NmMtNi4yMDI1LDAtOS43OTEyLTMuNTkzMi05Ljc5MTItOS43OTY0LDAtNi4xOTU0LDMuNTg4OC05LjU3MDQsOS43OTEyLTkuNTcwNCw2LjMxLDAsOS45LDMuMzc1LDkuOSw5LjU3MDQsMCw2LjIwMzEtMy41OSw5Ljc5NjQtOS45LDkuNzk2NHptLTE0LjAzNiw2NS4zNzYsMC04LjU4OTksNS41NS0wLjc1OTI1YzEuNTIzOC0wLjIyMDc1LDEuNzQtMC41NDQ1LDEuNzQtMi4xODAydi0zMS45ODNjMC0xLjE5NDItMC4zMjUtMS45NTktMS40MTYyLTIuMjgyOGwtNS44NzM4LTIuMDY4OCwxLjE5NjItOC44MDg2aDIyLjUyMXY0NS4xNDRjMCwxLjc0MzgsMC4xMDUsMS45NTk1LDEuNzQxMiwyLjE4MDJsNS41NDg4LDAuNzU5MjV2OC41ODk5aC0zMS4wMDgiLz4KIDxwYXRoIGZpbGw9IiM0MTMwMDAiIGQ9Im0yNzIuOTcsODAuNTI2Yy00LjY4LDIuMjgxOC0xMS41MzIsNC4zNDkxLTE3LjczNiw0LjM0OTEtMTIuOTQ1LDAtMTcuODM5LTUuMjE2OC0xNy44MzktMTcuNTE1di0yOC41YzAtMC42NTEzOCwwLTEuMDg4NC0wLjg3Mzc1LTEuMDg4NGgtNy42MTM4di05LjY4MTZjOS41NzYyLTEuMDkwOCwxMy4zODEtNS44Nzg0LDE0LjU3OC0xNy43MzZoMTAuMzM2djE1LjQ1M2MwLDAuNzU4NzUsMCwxLjA4NzQsMC44NzEyNSwxLjA4NzRoMTUuMzM4djEwLjg3N2gtMTYuMjA5djI1Ljk5OWMwLDYuNDE5NCwxLjUyNSw4LjkxOTQsNy4zOTYyLDguOTE5NCwzLjA1LDAsNi4yMDEyLTAuNzU5MjUsOC44MTI1LTEuNzM5MmwyLjk0LDkuNTc2MSIvPgogPHBhdGggZmlsbD0iI2YwNTEzMyIgZD0iTTExMS43OCw1MS45NzcsNjIuMDM1LDIuMjM4MWMtMi44NjIyLTIuODY0OC03LjUwODItMi44NjQ4LTEwLjM3NCwwbC0xMC4zMjksMTAuMzMsMTMuMTAyLDEzLjEwMmMzLjA0NTktMS4wMjg0LDYuNTM3MS0wLjMzODg4LDguOTYzOSwyLjA4ODQsMi40Mzk0LDIuNDQyNCwzLjEyNCw1Ljk2MzQsMi4wNjk4LDkuMDE5NWwxMi42MjgsMTIuNjI4YzMuMDU1MS0xLjA1MjgsNi41OC0wLjM3MjYyLDkuMDE5NSwyLjA3MTIsMy40MTA2LDMuNDA5NiwzLjQxMDYsOC45MzQ1LDAsMTIuMzQ1LTMuNDExMSwzLjQxMTYtOC45MzYsMy40MTE2LTEyLjM0OSwwLTIuNTY0NS0yLjU2NjUtMy4xOTg4LTYuMzM0NS0xLjg5OTktOS40OTQybC0xMS43NzctMTEuNzc3LTAuMDAxLDMwLjk5MWMwLjgzMTUsMC40MTE2MiwxLjYxNjIsMC45NjEsMi4zMDkxLDEuNjUwOSwzLjQwOTYsMy40MDkyLDMuNDA5Niw4LjkzMzEsMCwxMi4zNDgtMy40MTA2LDMuNDA5MS04LjkzOCwzLjQwOTEtMTIuMzQ1LDAtMy40MTAxLTMuNDE0Ni0zLjQxMDEtOC45Mzg1LDAtMTIuMzQ4LDAuODQyNzUtMC44NDEyNSwxLjgxNzktMS40NzgsMi44NTg0LTEuOTA0OHYtMzEuMjc5Yy0xLjA0MS0wLjQyNS0yLjAxNS0xLjA1Ny0yLjg1OS0xLjkwNS0yLjU4My0yLjU4MS0zLjIwNTEtNi4zNzItMS44ODA0LTkuNTQzOWwtMTIuOTE2LTEyLjkxOC0zNC4xMDYsMzQuMTA1Yy0yLjg2NTcsMi44NjctMi44NjU3LDcuNTEzLDAsMTAuMzc4bDQ5Ljc0Miw0OS43MzljMi44NjM4LDIuODY0OCw3LjUwODIsMi44NjQ4LDEwLjM3NiwwbDQ5LjUxMi00OS41MDRjMi44NjQ4LTIuODY2MiwyLjg2NDgtNy41MTM2LDAtMTAuMzc5Ii8+Cjwvc3ZnPgo=');
  },

  preparePoints: function() {

    // Clear the current points
    this.points = [];

    var width, height, i, j;

    var colors = this.bgContextPixelData.data;

    for( i = 0; i < this.canvas.height; i += this.density ) {

      for ( j = 0; j < this.canvas.width; j += this.density ) {

        var pixelPosition = ( j + i * this.bgContextPixelData.width ) * 4;

        // Dont use whiteish pixels
        if ( colors[pixelPosition] > 200
              && (colors[pixelPosition + 1]) > 200
              && (colors[pixelPosition + 2]) > 200
              || colors[pixelPosition + 3] === 0 ) {
          continue;
        }

        var color = 'rgba(' + colors[pixelPosition] + ',' + colors[pixelPosition + 1] + ',' + colors[pixelPosition + 2] + ',' + '1)';
        this.points.push( { x: j, y: i, originalX: j, originalY: i, color: color } );

      }
    }
  },

  updatePoints: function() {

    var i, currentPoint, theta, distance;

    for (i = 0; i < this.points.length; i++ ){

      currentPoint = this.points[i];

      theta = Math.atan2( currentPoint.y - this.mouse.y, currentPoint.x - this.mouse.x);

      if ( this.mouse.down ) {
        distance = this.reactionSensitivity * 200 / Math.sqrt((this.mouse.x - currentPoint.x) * (this.mouse.x - currentPoint.x) +
         (this.mouse.y - currentPoint.y) * (this.mouse.y - currentPoint.y));
      } else {
        distance = this.reactionSensitivity * 100 / Math.sqrt((this.mouse.x - currentPoint.x) * (this.mouse.x - currentPoint.x) +
         (this.mouse.y - currentPoint.y) * (this.mouse.y - currentPoint.y));
      }


      currentPoint.x += Math.cos(theta) * distance + (currentPoint.originalX - currentPoint.x) * 0.05;
      currentPoint.y += Math.sin(theta) * distance + (currentPoint.originalY - currentPoint.y) * 0.05;

    }
  },

  drawLines: function() {

    var i, j, currentPoint, otherPoint, distance, lineThickness;

    for ( i = 0; i < this.points.length; i++ ) {

      currentPoint = this.points[i];

      // Draw the dot.
      this.context.fillStyle = currentPoint.color;
      this.context.strokeStyle = currentPoint.color;

      for ( j = 0; j < this.points.length; j++ ){

        // Distaqnce between two points.
        otherPoint = this.points[j];

        if ( otherPoint == currentPoint ) {
          continue;
        }

        distance = Math.sqrt((otherPoint.x - currentPoint.x) * (otherPoint.x - currentPoint.x) +
         (otherPoint.y - currentPoint.y) * (otherPoint.y - currentPoint.y));

        if (distance <= this.drawDistance) {

          this.context.lineWidth = (1 - (distance / this.drawDistance)) * this.maxLineThickness * this.lineThickness;
          this.context.beginPath();
          this.context.moveTo(currentPoint.x, currentPoint.y);
          this.context.lineTo(otherPoint.x, otherPoint.y);
          this.context.stroke();
        }
      }
    }
  },

  drawPoints: function() {

    var i, currentPoint;

    for ( i = 0; i < this.points.length; i++ ) {

      currentPoint = this.points[i];

      // Draw the dot.
      this.context.fillStyle = currentPoint.color;
      this.context.strokeStyle = currentPoint.color;

      this.context.beginPath();
      this.context.arc(currentPoint.x, currentPoint.y, this.baseRadius ,0 , Math.PI*2, true);
      this.context.closePath();
      this.context.fill();

    }
  },

  draw: function() {
    this.animation = requestAnimationFrame( function(){ Nodes.draw() } );

    this.clear();
    this.updatePoints();
    this.drawLines();
    this.drawPoints();

  },

  clear: function() {
    this.canvas.width = this.canvas.width;
  },

  // The filereader has loaded the image... add it to image object to be drawn
  loadData: function( data ) {

    this.bgImage = new Image;
    this.bgImage.src = data;

    this.bgImage.onload = function() {

      //this
      Nodes.drawImageToBackground();
    }
  },

  // Image is loaded... draw to bg canvas
  drawImageToBackground: function () {

    this.bgCanvas = document.createElement( 'canvas' );
    this.bgCanvas.width = this.canvas.width;
    this.bgCanvas.height = this.canvas.height;

    var newWidth, newHeight;


      newWidth = this.bgImage.width * 3;
      newHeight = this.bgImage.height * 3;


    // Draw to background canvas
    this.bgContext = this.bgCanvas.getContext( '2d' );
    this.bgContext.drawImage( this.bgImage, (this.canvas.width - newWidth) / 2, (this.canvas.height - newHeight) / 2, newWidth, newHeight);
    this.bgContextPixelData = this.bgContext.getImageData( 0, 0, this.bgCanvas.width, this.bgCanvas.height );

    this.preparePoints();
    this.draw();
  },

  mouseDown: function( event ){
    Nodes.mouse.down = true;
  },

  mouseUp: function( event ){
    Nodes.mouse.down = false;
  },

  mouseMove: function(event){
    Nodes.mouse.x = event.offsetX || (event.layerX - Nodes.canvas.offsetLeft);
    Nodes.mouse.y = event.offsetY || (event.layerY - Nodes.canvas.offsetTop);
  },

  mouseOut: function(event){
    Nodes.mouse.x = -1000;
    Nodes.mouse.y = -1000;
    Nodes.mouse.down = false;
  },

  // Resize and redraw the canvas.
  onWindowResize: function() {
    cancelAnimationFrame( this.animation );
    this.drawImageToBackground();
  }
}

  setTimeout( function() {
    Nodes.init();
}, 10 );
