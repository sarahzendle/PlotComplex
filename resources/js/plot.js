//
//  Compile a shader
//
function CompileShader(gl,id)
{
   //  Get shader by id
   var src = document.getElementById(id);
   //  Create shader based on type setting
   var shader;
   if (src.type == "x-shader/x-fragment")
      shader = gl.createShader(gl.FRAGMENT_SHADER);
   else if (src.type == "x-shader/x-vertex")
      shader = gl.createShader(gl.VERTEX_SHADER);
   else
      return null;
   //  Read source into str
   var str = "";
   var k = src.firstChild;
   while (k)
   {
      if (k.nodeType == 3) str += k.textContent;
      k = k.nextSibling;
   }
   gl.shaderSource(shader, str);
   //  Compile the shader
   gl.compileShader(shader);
   //  Check for errors
   if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) == 0)
      alert(gl.getShaderInfoLog(shader));
   //  Return shader
   return shader;
}

//
//  Compile shader program
//
function CompileShaderProg(gl,vert,frag)
{
   //  Compile the program
   var prog  = gl.createProgram();
   gl.attachShader(prog , CompileShader(gl,vert));
   gl.attachShader(prog , CompileShader(gl,frag));
   gl.linkProgram(prog);
   //  Check for errors
   if (gl.getProgramParameter(prog, gl.LINK_STATUS) == 0)
      alert(gl.getProgramInfoLog(prog));
   //  Return program
   return prog;
}

// set up vertex attribute array, assuming 4d vertex and color, 3d normal, and 2d texture
// must bind buffer before calling
function attribArray(gl, prog, XYZ, NOR, RGB, T2D) {
   //  Set up 4D vertex array
   XYZ = gl.getAttribLocation(prog,"Vertex");
   gl.enableVertexAttribArray(XYZ);
   gl.vertexAttribPointer(XYZ,4,gl.FLOAT,false,52,0);
   //  Set up 3D normal array
   NOR = gl.getAttribLocation(prog, "Normal");
   if (NOR >= 0) {
      gl.enableVertexAttribArray(NOR);
      gl.vertexAttribPointer(NOR,3,gl.FLOAT,false,52,16)
   }
   //  Set up 4D color array
   RGB = gl.getAttribLocation(prog,"Color");
   gl.enableVertexAttribArray(RGB);
   gl.vertexAttribPointer(RGB,4,gl.FLOAT,false,52,28);
   //  Set up 2D texture array
   T2D = gl.getAttribLocation(prog,"Texture");
   if (T2D >= 0) {
      gl.enableVertexAttribArray(T2D);
      gl.vertexAttribPointer(T2D,2,gl.FLOAT,false,52,44);
   }
}

var gl,canvas, graphIt, surf;
function webGLStart()
{
   //  Set canvas
   canvas = document.getElementById("canvas");
   //  Select canvas size
   var size = Math.min(window.innerWidth, window.innerHeight)-10;
   canvas.width  = size;
   canvas.height = size;
   //  Start WebGL
   if (!window.WebGLRenderingContext)
   {
      alert("Your browser does not support WebGL. See http://get.webgl.org");
      return;
   }
   try
   {
      gl = canvas.getContext("experimental-webgl");
   }
   catch(e)
   {}
   if (!gl)
   {
      alert("Can't get WebGL");
      return;
   }

   //  Load Shaders
   var prog = CompileShaderProg(gl,"sphere-vs","sphere-fs");
   var surfProg = CompileShaderProg(gl, "surface-vs", "sphere-fs");

   //  Set state to draw scene
   gl.enable(gl.DEPTH_TEST);
   gl.clearColor(0.8,0.8,0.8,1);
   //  Mouse control variables
   var x0 = y0 = move  = 0;
   //  Rotation angles
   var th = 0;
   var ph = 85; 

   //generate data for sphere
   var sphere_data = GenerateSphere(N);

   gl.useProgram(prog);
   var sphere = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER,sphere);
   gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(sphere_data), gl.STATIC_DRAW); 

   //  Set first viewport to 1/2 of canvas
   gl.viewport(0,0,size,size);
   
   //  Draw scene the first time
   // Display();

   var plane_data = GeneratePlane(N);
   gl.useProgram(surfProg);
   var plane = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, plane);
   gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(plane_data), gl.STATIC_DRAW);

   // Set second viewport to other 1/2 of canvas
   // gl.viewport(0, size/2, size/2, size);
   // Display2();

   surf = true;
   if(surf) Display();
   else Display2();

   //
   //  Display the scene
   //
   function Display()
   {
      //  Clear the screen and Z buffer
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);


      // Lighting values
      var global   = [0.1,0.1,0.1,1.0];
      var ambient  = [0.3,0.3,0.3,1.0];
      var diffuse  = [0.8,0.8,0.8,1.0];
      var specular = [0.5,0.5,0.5,1.0];
      var position = [10.0,1.0,1.0,1.0];
      var fov = 45;
      var dim = 5;
      var asp = 1;

      // Looking position for perspective
      var Lx = -2*dim*Sin(th)*Sin(ph);
      var Ly = -2*dim        *Cos(ph);
      var Lz = +2*dim*Cos(th)*Sin(ph);

      // Compute matrices 
      var ViewMatrix = new mat4();
      ViewMatrix.lookAt(Lx, Ly, Lz, 0, 0, 0, 0, 1, 0);

      var ModelviewMatrix = new mat4();
      ModelviewMatrix = ViewMatrix;
      ModelviewMatrix.translate(0, 0, 0);

      var ProjectionMatrix = new mat4();
      ProjectionMatrix.perspective(fov, asp, dim/16, 16*dim);

      var NormalMatrix = ModelviewMatrix.normalMatrix();

      // Set shader
      gl.useProgram(prog);

      //  Pass uniforms to shader
      var id = gl.getUniformLocation(prog,"fov");
      gl.uniform1f(id,fov);
      id = gl.getUniformLocation(prog,"Global");
      gl.uniform4fv(id, global);
      id = gl.getUniformLocation(prog,"Ambient");
      gl.uniform4fv(id,ambient);
      id = gl.getUniformLocation(prog,"Diffuse");
      gl.uniform4fv(id,diffuse);
      id = gl.getUniformLocation(prog,"Specular");
      gl.uniform4fv(id,specular);
      id = gl.getUniformLocation(prog,"Position");
      gl.uniform4fv(id,position);
      if(graphIt) {
         id = gl.getUniformLocation(prog,"function");
         gl.uniform1fv(id,new Float32Array(eqnRPN));
      }

      gl.uniformMatrix4fv(gl.getUniformLocation(prog,"ProjectionMatrix") , false , ProjectionMatrix.getMat());
      gl.uniformMatrix3fv(gl.getUniformLocation(prog,"NormalMatrix") , false , NormalMatrix);
      gl.uniformMatrix4fv(gl.getUniformLocation(prog,"ModelViewMatrix")  , false , ModelviewMatrix.getMat());


      if(graphIt) {
         //  Bind sphere buffer
         var XYZ, NORM, RGB, T2D;
         gl.bindBuffer(gl.ARRAY_BUFFER, sphere);
         attribArray(gl, prog, XYZ, NORM, RGB, T2D);

         //  Draw sphere
         gl.drawArrays(gl.TRIANGLES,0, N*(N+1)*6);

         //  Disable vertex arrays
         gl.disableVertexAttribArray(XYZ);
         gl.disableVertexAttribArray(RGB);
         gl.disableVertexAttribArray(T2D);
      }

      //  Flush
      gl.flush ();

   }

   function Display2()
   {
      //  Clear the screen and Z buffer
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);


      // Lighting values
      var global   = [0.1,0.1,0.1,1.0];
      var ambient  = [0.3,0.3,0.3,1.0];
      var diffuse  = [0.8,0.8,0.8,1.0];
      var specular = [0.5,0.5,0.5,1.0];
      var position = [10.0,1.0,1.0,1.0];
      var fov = 45;
      var dim = 5;
      var asp = 1;

      // Looking position for perspective
      var Lx = -2*dim*Sin(th)*Sin(ph);
      var Ly = -2*dim        *Cos(ph);
      var Lz = +2*dim*Cos(th)*Sin(ph);

      // Compute matrices 
      var ViewMatrix = new mat4();
      ViewMatrix.lookAt(Lx, Ly, Lz, 0, 0, 0, 0, 1, 0);

      var ModelviewMatrix = new mat4();
      ModelviewMatrix = ViewMatrix;
      ModelviewMatrix.translate(0, 0, 0);

      var ProjectionMatrix = new mat4();
      ProjectionMatrix.perspective(fov, asp, dim/16, 16*dim);

      var NormalMatrix = ModelviewMatrix.normalMatrix();

      // Set shader
      gl.useProgram(surfProg);

      //  Pass uniforms to shader
      var id = gl.getUniformLocation(surfProg,"fov");
      gl.uniform1f(id,fov);
      id = gl.getUniformLocation(surfProg,"Global");
      gl.uniform4fv(id, global);
      id = gl.getUniformLocation(surfProg,"Ambient");
      gl.uniform4fv(id,ambient);
      id = gl.getUniformLocation(surfProg,"Diffuse");
      gl.uniform4fv(id,diffuse);
      id = gl.getUniformLocation(surfProg,"Specular");
      gl.uniform4fv(id,specular);
      id = gl.getUniformLocation(surfProg,"Position");
      gl.uniform4fv(id,position);
      if(graphIt) {
         id = gl.getUniformLocation(surfProg,"function");
         gl.uniform1fv(id,new Float32Array(eqnRPN));
      }

      gl.uniformMatrix4fv(gl.getUniformLocation(surfProg,"ProjectionMatrix") , false , ProjectionMatrix.getMat());
      gl.uniformMatrix3fv(gl.getUniformLocation(surfProg,"NormalMatrix") , false , NormalMatrix);
      gl.uniformMatrix4fv(gl.getUniformLocation(surfProg,"ModelViewMatrix")  , false , ModelviewMatrix.getMat());


      if(graphIt) {
         //  Bind sphere buffer
         var XYZ, NORM, RGB, T2D;
         gl.bindBuffer(gl.ARRAY_BUFFER, plane);
         attribArray(gl, surfProg, XYZ, NORM, RGB, T2D);

         //  Draw surface
         gl.drawArrays(gl.TRIANGLES,0, 6*(N-1)*N);

         //  Disable vertex arrays
         gl.disableVertexAttribArray(XYZ);
         gl.disableVertexAttribArray(RGB);
         gl.disableVertexAttribArray(T2D);
      }

      //  Flush
      gl.flush ();

   }

   //
   //  Resize canvas
   //
   canvas.resize = function ()
   {
      var size = Math.min(window.innerWidth, window.innerHeight)-10;
      canvas.width  = size;
      canvas.height = size;
      if(surf) Display();
      else Display2();
   }

   //
   //  Mouse button pressed
   //
   canvas.onmousedown = function (ev)
   {
      move  = 1;
      x0 = ev.clientX;
      y0 = ev.clientY;
   }

   //
   //  Mouse button released
   //
   canvas.onmouseup = function (ev)
   {
      move  = 0;
   }

   //
   //  Mouse movement
   //
   canvas.onmousemove = function (ev)
   {
      if (move==0) return;
      //  Update angles
      th += (ev.clientX-x0);
      ph += (ev.clientY-y0)/2;
      if(ph > 140) ph = 140;
      if(ph < 1) ph = 1;
      //  Store location
      x0 = ev.clientX;
      y0 = ev.clientY;
      //  Redisplay
      var size = Math.min(window.innerWidth, window.innerHeight)-10;
      canvas.width  = size;
      canvas.height = size;
      // gl.viewport(0,0,size/2,size);
      // Display();
      // gl.viewport(size/2,0,size/2,size);
      // Display2();
      if(surf) Display();
      else Display2();
   } 

   var button = document.getElementById("graph-it")
   button.onclick = function() {
      document.getElementById("error").innerHTML = errStr;
      graphIt = true;
      var size = Math.min(window.innerWidth, window.innerHeight)-10;
      canvas.width  = size;
      canvas.height = size;
      // gl.viewport(0,0,size/2,size);
      // Display();
      // gl.viewport(size/2,0,size/2,size);
      // Display2();
      if(surf) Display();
      else Display2();
   }

   document.getElementById("sphere").onclick = function () {
      surf = true;
      Display();
   }
   document.getElementById("surface").onclick = function () {
      surf = false;
      Display2();
   }
}





/*

Fragment Shaders: 
-plane shader
-sphere shader
-surface shader

Vertex Shaders:
-default for plane and sphere
-surface vertex shader

Buffer Objects:
-plane
-sphere
-surface:plane made of many vertices

*/