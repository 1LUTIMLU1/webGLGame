"use strict";

var gL_Shader = null;
var shaderVertexPositionAttribute = null;

//these uniforms are declared as globals
//so that gameEngine can use them in the rendering loop
var uBlobsLoc = null;
var uColorLoc = null;
var uBgColorLoc = null;

//modern way of writing vertex shader
//code based on this solution: https://github.com/lucia-gomez/lava-lamp

function getVertexShader() {
  const vertexSource = /*glsl*/`

attribute vec2 position;

void main() {
gl_Position = vec4(position, 0.0, 1.0);
}

`;

  return vertexSource;
}

function getFragmentShader() {
  const fragmentSource = /*glsl*/`
    precision highp float;
    
    const float WIDTH = ${window.innerWidth >> 0}.0;
    const float HEIGHT = ${window.innerHeight >> 0}.0;

    

    uniform vec3 blobs[${blobs.length}];
    uniform vec3 blobColor;
    uniform vec3 backgroundColor;

    void main() {
      float x = gl_FragCoord.x;
      float y = gl_FragCoord.y;

      float sum = 0.0;
      for (int i = 0; i < ${blobs.length}; i++) {
          vec3 blob = blobs[i];
          float dx = blob.x - x;
          float dy = blob.y - y;
          float radius = blob.z;

          sum += (radius * radius) / (dx * dx + dy * dy);
      }
      //if the distance is close enough draw the blobColor at the coordinate
      if (sum >= 2.0 - float(${blobStickiness})) {
          gl_FragColor = vec4(blobColor, 1.0); 
          return;
      }

      gl_FragColor = vec4(backgroundColor, 1.0);
    }
  `;
  return fragmentSource;
}

function compileShader(shaderSource, shaderType) {
  let compiledShader;

  //create the shader based on the type: vertex or fragment
  compiledShader = gL.createShader(shaderType);

  //compile the created shader
  gL.shaderSource(compiledShader, shaderSource);
  gL.compileShader(compiledShader);

  //check for error and return the result
  if (!gL.getShaderParameter(compiledShader, gL.COMPILE_STATUS)) {
    alert(
      "A shader compiling error occured: " + gL.getShaderInfoLog(compiledShader)
    );
    return null;
  }
  return compiledShader;
}

function initShader() {
  //step 1 load vertex and fragment shaders
  var vertexSource = getVertexShader();
  var fragmentSource = getFragmentShader();
  //step 2 compile shaders
  var vertexShader = compileShader(vertexSource, gL.VERTEX_SHADER);
  var fragmentShader = compileShader(fragmentSource, gL.FRAGMENT_SHADER);

  //create and link shaders
  gL_Shader = gL.createProgram();
  gL.attachShader(gL_Shader, vertexShader);
  gL.attachShader(gL_Shader, fragmentShader);
  gL.linkProgram(gL_Shader);

  //check for error
  if (!gL.getProgramParameter(gL_Shader, gL.LINK_STATUS))
    alert("Error linkin shader");

  gL.useProgram(gL_Shader);

  //create vertexs this is for the rectangulars viewport
  var vertices = new Float32Array([
    -1.0, 1.0,
    -1.0, -1.0,
    1.0, 1.0,
    1.0, -1.0
  ]);

  //do vertex buffer stuff here
  var vertexDataBuffer = gL.createBuffer();
  gL.bindBuffer(gL.ARRAY_BUFFER, vertexDataBuffer);
  gL.bufferData(gL.ARRAY_BUFFER, vertices, gL.STATIC_DRAW);


  //need to find the position as defined in getVertexShader
  shaderVertexPositionAttribute = gL.getAttribLocation(gL_Shader, "position");

  gL.enableVertexAttribArray(shaderVertexPositionAttribute);

  gL.vertexAttribPointer(
    shaderVertexPositionAttribute,
    2,
    gL.FLOAT,
    false,
    0,
    0
  );

  //uniform lookups
  uBlobsLoc = gL.getUniformLocation(gL_Shader, "blobs");
  uColorLoc = gL.getUniformLocation(gL_Shader, "blobColor");
  uBgColorLoc = gL.getUniformLocation(gL_Shader, "backgroundColor");
}
