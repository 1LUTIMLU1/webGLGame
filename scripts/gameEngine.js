//use strict javascript
"use strict";
//this comment needs to be here so that vscode senses the webgl context I named gL
//across all javascript files
/** @type {WebGLRenderingContext} */
var gL = null;

//define a single blob at the middle of the screen for now

var blobs = [
    {x: 480.0, y: 360.0, z:60.0 }
];

var blobStickiness = 0.5;
var blobColor = [0.0, 1.0, 0.0]; //green
var backgroundColor = [1.0, 1.0, 1.0]; //white

// Handles to send data to GPU
var uBlobsLoc = null;
var uColorLoc = null;
var uBgColorLoc = null;

function initializeGL() {
    var canvas = window.document.getElementById("GLCanvas");

    //retrieve and bind a reference to the WebGL Context
    gL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    
    if(gL !== null) {
        //black screen
        gL.clearColor(0.0, 0.0, 0.0, 1.0);
    }
    else {
        document.getElementById("webGL-error").innerHTML = 
        "<p><strong>WebGL is not supported!</strong></p>";
    }
}


function clearCanvas() {
    //clear to the previous color set in clearColor
    if (gL)
    {
        gL.clear(gL.COLOR_BUFFER_BIT);
    }
    
}



//this might need to be moved to a different javascript file
//later on
function render(time) {

    if (!gL)
        return;
    //clear screen
    gL.clear(gL.COLOR_BUFFER_BIT);

      //send the one blob object to gpu
    var data = [blobs[0].x, blobs[0].y, blobs[0].z];

    gL.uniform3fv(uBlobsLoc, new Float32Array(data));
    gL.uniform3fv(uColorLoc, blobColor);
    gL.uniform3fv(uBgColorLoc, backgroundColor);

    //send time
    gL.uniform1f(uTimeLoc, time * 0.001);

    //draw the viewport
    gL.drawArrays(gL.TRIANGLE_STRIP, 0, 4);

    //get next frame
    requestAnimationFrame(render);


}


function gL_draw() {
    initializeGL();

    //compile and link shader in shader.js
    initShader();

    //clear screen to black
    clearCanvas();

    //start the game loop

    requestAnimationFrame(render);


}

console.log("GL:", gL);
