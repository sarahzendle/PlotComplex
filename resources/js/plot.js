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

var gl,canvas,condition, width, height, scene, particles;
function webGLStart()
{
   //  Set canvas
   canvas = document.getElementById("canvas");
   //  Select canvas size
   height = innerHeight;
   width = window.innerWidth;
   canvas.width  = width;
   canvas.height = height;
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

   //  Set viewport to entire canvas
   gl.viewport(0,0,width,height);

   //  Load Shader
   var prog = CompileShaderProg(gl,"shader-vs","shader-fs");

   var cubeProg = CompileShaderProg(gl, "cube-vs", "cube-fs");

   //  Set program
   gl.useProgram(prog);

   //  Generate data for hill landscape
   var n = 20;
   var hills_data = [];
   createHills(hills_data, n);

   var hills = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER,hills);
   gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(hills_data),gl.STATIC_DRAW);

   //  Set state to draw scene
   gl.enable(gl.DEPTH_TEST);
   gl.clearColor(0.8,0.8,0.8,1);
   //  Mouse control variables
   var x0 = y0 = move  = 0;
   //  Rotation angles
   var th = 0;
   var ph = 85;
   //  Draw both scene and particles
   scene = true;
   particles = true; 

   //generate data for sky sphere
   var sphere_data = GenerateSphere(n);

   gl.useProgram(cubeProg);
   var sphere = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER,sphere);
   gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(sphere_data), gl.STATIC_DRAW);

   var cube = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, cube);
   gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(cube_data), gl.STATIC_DRAW);  

   //  Draw scene the first time
   Display();

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
      var specular = [1.0,1.0,1.0,1.0];
      var position = [-3,-3,3,1.0];
      var fov = 45;
      var dim = 10;
      var asp = width/height;

      // Looking position for perspective
      var Lx = -2*dim*Sin(th)*Sin(ph);
      var Ly = -2*dim        *Cos(ph);
      var Lz = +2*dim*Cos(th)*Sin(ph);

      // Compute matrices
      var ViewMatrix = new mat4();
      ViewMatrix.lookAt(0, func(0, 0) + 1, 0, Lx, Ly, Lz, 0, 1, 0);
      //ViewMatrix.lookAt(Lx, Ly, Lz, 0, 0, 0, 0, 1, 0); //3rd-person view for debugging

      var ModelviewMatrix = new mat4();
      ModelviewMatrix = ViewMatrix;
      var ModelMatrixSky = new mat4();
      ModelMatrixSky.identity();
      ModelMatrixSky.scale(7, 7, 7);

      var ProjectionMatrix = new mat4();
      ProjectionMatrix.perspective(fov, asp, dim/16, 16*dim);

      var NormalMatrix = ModelviewMatrix.normalMatrix();

      // Set hills shader
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

      gl.uniformMatrix4fv(gl.getUniformLocation(prog,"ProjectionMatrix") , false , ProjectionMatrix.getMat());
      gl.uniformMatrix3fv(gl.getUniformLocation(prog,"NormalMatrix") , false , NormalMatrix);
      gl.uniformMatrix4fv(gl.getUniformLocation(prog,"ViewMatrix")  , false , ViewMatrix.getMat());
      gl.uniform1i(gl.getUniformLocation(prog, "tex"), false, tex);

      if(scene) {
         //  Set hills modelview
         gl.uniformMatrix4fv(gl.getUniformLocation(prog,"ModelviewMatrix")  , false , ModelviewMatrix.getMat());
         //  Bind hills buffer
         gl.bindBuffer(gl.ARRAY_BUFFER,hills);
         var XYZ, NORM, RGB, T2D;
         attribArray(gl, prog, XYZ, NORM, RGB, T2D);

         gl.activeTexture(gl.TEXTURE0);
         gl.bindTexture(gl.TEXTURE_2D,tex);

         //  Draw hills vertexes
         gl.drawArrays(gl.TRIANGLES,0, n*n*6);

         //  Disable vertex arrays
         gl.disableVertexAttribArray(XYZ);
         gl.disableVertexAttribArray(RGB);
         gl.disableVertexAttribArray(T2D);

         //  Set sky shader
         gl.useProgram(cubeProg);

         //  Pass uniforms to sky shader
         gl.uniformMatrix4fv(gl.getUniformLocation(cubeProg,"ProjectionMatrix") , false , ProjectionMatrix.getMat());
         gl.uniformMatrix3fv(gl.getUniformLocation(cubeProg,"NormalMatrix") , false , NormalMatrix);
         gl.uniformMatrix4fv(gl.getUniformLocation(cubeProg,"ViewMatrix")  , false , ViewMatrix.getMat());
         gl.uniformMatrix4fv(gl.getUniformLocation(cubeProg,"ModelMatrix")  , false , ModelMatrixSky.getMat());
         gl.uniform1i(gl.getUniformLocation(cubeProg, "tex"), false, clear_tex);

         //  Bind sphere buffer
         gl.bindBuffer(gl.ARRAY_BUFFER, sphere);
         attribArray(gl, cubeProg, XYZ, NORM, RGB, T2D);

         //  Select texture based on weather conditions
         gl.activeTexture(gl.TEXTURE0);
         var texture;
         if(condition==1000)//sunny
            texture = clear_tex
         else if(condition == 1003)//partly cloudy
            texture = pc_tex;
         else
            texture = cloudy_tex;//anything else - cloudy
         
         gl.bindTexture(gl.TEXTURE_2D,texture);

         //  Draw sphere
         gl.drawArrays(gl.TRIANGLES,0, n*(n+1)*6);

         //  Disable vertex arrays
         gl.disableVertexAttribArray(XYZ);
         gl.disableVertexAttribArray(RGB);
         gl.disableVertexAttribArray(T2D);
      }

      if(particles) {
         // Draw particles (if current weather requires them)
      }

      //  Flush
      gl.flush ();

   }

   //
   //  Resize canvas
   //
   canvas.resize = function ()
   {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width  = width;
      canvas.height = height;
      gl.viewport(0,0,width,height);
      Display();
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
      Display();
   }

   var sceneCheck = document.getElementById("scene");
   sceneCheck.onclick = function() {
      scene = sceneCheck.checked;
      Display();
   }

   var partCheck = document.getElementById("particles");
   partCheck.onclick = function() {
      particles = partCheck.checked;
      Display();
   }

   //make api call to weatherapi.com
   var button = document.getElementById("search");
   button.onclick = function()
   {
      var location = document.getElementById("place").value;
      var url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_KEY}&q=${location}`;
      window.fetch(url)
      .then(function(response) {
         return response.json();
      }).then(function(data) {
         console.log(data);
         document.getElementById("city").innerHTML = data.location.name;
         document.getElementById("region").innerHTML = data.location.region;
         document.getElementById("temperature").innerHTML = `${data.current.temp_f} &deg; F`
         document.getElementById("condition").innerHTML = data.current.condition.text;
         condition = data.current.condition.code;
         Display();
      }).catch(function(error) {
         console.log(error);
         document.getElementById("error").innerHTML = "error retrieving weather data";
      });
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