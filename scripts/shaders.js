"use strict";

var shader = null;
var shaderVertexPositionAttribute = null;


function loadAndCompileShader(id, shaderType) {

    let shaderText, shaderSource, compiledShader;

    //get shader source from html
    shaderText = document.getElementById(id);
    //crash prevention
    if (!shaderText) {
        alert("Could not find shader with ID: " + id);
        return null;
    }
    shaderSource = shaderText.firstChild.textContent;

    //create the shader based on the type: vertex or fragment
    compiledShader = gL.createShader(shaderType);

    //compile the created shader
    gL.shaderSource(compiledShader, shaderSource);
    gL.compileShader(compiledShader);

    //check for error and return the result
    if (!gL.getShaderParameter(compiledShader, gL.COMPILE_STATUS)) {
        alert("A shader compiling error occured: " +
            gL.getShaderInfoLog(compiledShader));
        return null;
    }
    return compiledShader;
}

function initShader(vertexShaderID, fragmentShaderID) {
    //step 1 load and compile vertex and fragment shaders
    var vertexShader = loadAndCompileShader(vertexShaderID, gL.VERTEX_SHADER);
    var fragmentShader = loadAndCompileShader(fragmentShaderID, gL.FRAGMENT_SHADER);

    //create and link shaders
    gL_Shader = gL.createProgram();
    gL.attachShader(gL_Shader, vertexShader);
    gL.attachShader(gL_Shader, fragmentShader);
    gL.linkProgram(gL_Shader);
    
    //check for error
    if (!gL.getProgramParameter(gL_Shader, gL.LINK_STATUS))
        alert("Error linkin shader");

    gL.enableVertexAttribArray(shaderVertexPositionAttribute);




}