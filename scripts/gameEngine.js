//use strict javascript
"use strict";
//this comment needs to be here so that vscode senses the webgl context I named gL
//across all javascript files
/** @type {WebGLRenderingContext} */
var gL = null;

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


function gL_draw() {
    initializeGL();

    //clear screen to black
    clearCanvas();
}

console.log("GL:", gL);
