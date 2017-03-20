var gl;
function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}
function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}
	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}
	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}
var shaderProgram;
function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
	gl.useProgram(shaderProgram);
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();
function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}
function mvPopMatrix() {
	if (mvMatrixStack.length === 0) {
		throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}
function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}
var shapes = {};
function initBuffers(scene) {
    for (var shape in scene.shapes) {
        if (scene.shapes.hasOwnProperty(shape) &&
                scene.shapes[shape].type === "primative") {
            shapes[shape] = {};

            var pointBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
            var points = scene.shapes[shape].points.map(
                    (point) => { return [point.x, point.y, point.z]; });
            points = [].concat.apply([], points);
            console.log(points);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points),
                    gl.STATIC_DRAW);
            pointBuffer.itemSize = 3;
            pointBuffer.numItems = scene.shapes[shape].points.length;

            shapes[shape].points = pointBuffer;

            var colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            var colors = scene.shapes[shape].points.map(
                    (point) => { return point.color; });
            colors = [].concat.apply([], colors);
            console.log(colors);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors),
                    gl.STATIC_DRAW);
            colorBuffer.itemSize = 4;
            colorBuffer.numItems = scene.shapes[shape].points.length;

            shapes[shape].colors = colorBuffer;

            var idxBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuffer);
            var indices = scene.shapes[shape].indices;
            indices = [].concat.apply([], indices);
            console.log(indices);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),
                    gl.STATIC_DRAW);
            idxBuffer.itemSize = 1;
            idxBuffer.numItems = indices.length;

            shapes[shape].indices = idxBuffer;
        }
    }
}

function evaluate_math(str) {
    return eval(String(str).replace("TIME", lastTime));
}

function drawObj(obj, scene) {
    if (scene.shapes[obj].type == "primative") {
        gl.bindBuffer(gl.ARRAY_BUFFER, shapes[obj].points);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                shapes[obj].points.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, shapes[obj].colors);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
                shapes[obj].colors.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shapes[obj].indices);

        setMatrixUniforms();

        gl.drawElements(gl.TRIANGLES, shapes[obj].indices.numItems,
                gl.UNSIGNED_SHORT, 0);
    }
    else {
        console.log(obj);
        obj = scene.shapes[obj];
        for (var i = 0; i < obj.contents.length; i++) {
            mvPushMatrix();
            for (var j = 0; j < obj.contents[i].transforms.length; j++) {
                var transform = obj.contents[i].transforms[j];
                if (transform.type == "translate") {
                    mat4.translate(mvMatrix,
                        [parseFloat(transform.x), parseFloat(transform.y),
                         parseFloat(transform.z)]);
                }
                else if (transform.type == "rotate") {
                    mat4.rotate(mvMatrix,
                        degToRad(evaluate_math(transform.theta)),
                        [evaluate_math(transform.x), evaluate_math(transform.y),
                         evaluate_math(transform.z)]);
                }
                else if (transform.type == "scale") {
                    mat4.scale(mvMatrix,
                        [evaluate_math(transform.x), evaluate_math(transform.y),
                        evaluate_math(transform.z)]);
                }
                else {
                    throw "Invalid transform type: " + transform.type;
                }
            }
            drawObj(obj.contents[i].object, scene);
            mvPopMatrix();
        }
    }
}

var rPyramid = 0;
var rCube = 0;
function drawScene(scene) {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

	mvPushMatrix();
	mat4.identity(mvMatrix);
    drawObj("main", scene);
    mvPopMatrix();

    /*
	mvPushMatrix();
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, [-1.5, 0.0, -8.0]);
	mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
	mat4.rotate(mvMatrix, degToRad(rCube), [1, 1, 1]);

	gl.bindBuffer(gl.ARRAY_BUFFER, shapes.cube.points);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
            shapes.cube.points.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, shapes.cube.colors);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
            shapes.cube.colors.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shapes.cube.indices);

	setMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, shapes.cube.indices.numItems,
            gl.UNSIGNED_SHORT, 0);
	mvPopMatrix();
    */
}
var lastTime = 0;
function animate() {
	var timeNow = new Date().getTime();
	if (lastTime !== 0) {
		var elapsed = timeNow - lastTime;
		rPyramid += (90 * elapsed) / 1000.0;
		rCube -= (75 * elapsed) / 1000.0;
	}
	lastTime = timeNow;
}
function tick() {
	requestAnimFrame(tick);
	drawScene(SCENE);
	animate();
}
function webGLStart() {
	var canvas = document.getElementById("oops");
	initGL(canvas);
	initShaders();
	initBuffers(SCENE);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	tick();
}

