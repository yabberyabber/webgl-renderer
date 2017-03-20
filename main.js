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

function createShader(gl, shaderScript, type) {
	var shader;
	if (type == "fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (type == "vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}
    console.log(shaderScript);
	gl.shaderSource(shader, shaderScript);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

var shaders = {};
var shaderProgram;
function initShaders(scene) {
    for (var shaderName in scene.shaders) {
        console.log("shaderName: ", shaderName);
        if (scene.shaders.hasOwnProperty(shaderName)) {
            var shaderObj = scene.shaders[shaderName];

            var fragmentShader =
                createShader(gl, shaderObj.fragment, "fragment");
            var vertexShader =
                createShader(gl, shaderObj.vertex, "vertex");

            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                alert("Could not initialise shaders");
            }
            gl.useProgram(program);
            console.log(program);

            var args = {};
            for (var i = 0; i < shaderObj.arguments.length; i++) {
                var arg = shaderObj.arguments[i];
                console.log("arg: ", arg);
                if (arg.type == "attribute") {
                    arg.location = gl.getAttribLocation(program, arg.name);
                    args[arg.name] = arg;
                    gl.enableVertexAttribArray(arg.location);
                }
                else if (arg.type == "uniform") {
                    arg.location = gl.getUniformLocation(program, arg.name);
                    args[arg.name] = arg;
                }
                else {
                    alert("unsupported shader argument: " + arg.type);
                }
            }
            shaders[shaderName] = {
                program: program,
                args: args
            };
            console.log("shaderName: ", shaderName);
        }
    }
    shaderProgram = shaders.default;
}
var shaderSceneProperties = {};
function selectShaderProgram(shader) {
    let program = shader.name;
    
    for (let i = 0; i < shaderProgram.args.length; i++) {
        let arg = shaderProgram.args[i];
        if (arg.type == "attribute") {
            gl.disableVertexAttributeArray(arg.location);
        }
    }
    shaderProgram = shaders[program];
    gl.useProgram(shaderProgram.program);
    for (let i = 0; i < shaderProgram.args.length; i++) {
        let arg = shaderProgram.args[i];
        if (arg.type == "attribute") {
            gl.enableVertexAttributeArray(arg.location);
        }
    }
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
    for (let argName in shaderProgram.args) {
        if (shaderProgram.args.hasOwnProperty(argName) &&
                shaderProgram.args[argName].type == "uniform") {
            console.log(argName);
            let arg = shaderProgram.args[argName];
            let val;
            if (argName == "uPMatrix") {
                val = pMatrix;
            }
            else if (argName == "uMVMatrix") {
                val = mvMatrix;
            }
            else if (sceneShaderProperties[argName]) {
                val = sceneShaderProperties[argName];
            }
            else {
                alert("Uniform not set: ", argName);
            }
            gl.uniformMatrix4fv(shaderProgram.args[argName].location, false, val);
        }
    }
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
                    (point) => {
                        return point.color ||
                            (point.normal && [Math.abs(point.normal.x),
                                              Math.abs(point.normal.y),
                                              Math.abs(point.normal.z),
                                              1.0]) ||
                            [1.0, 1.0, 0.0, 1.0];
                    });
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

            if (scene.shapes[shape].points[0].normal) {
                var normBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
                var normals = scene.shapes[shape].points.map(
                        (point) => { return [point.normal.x,
                                             point.normal.y,
                                             point.normal.z]; });
                normals = [].concat.apply([], points);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals),
                        gl.STATIC_DRAW);
                normBuffer.itemSize = 3;
                normBuffer.numItems = scene.shapes[shape].points.length;

                shapes[shape].normals = normBuffer;
            }
        }
    }
}

function evaluate_math(str) {
    return eval(String(str).replace("TIME", new Date().getTime()));
}

function drawObj(obj, scene) {
    if (scene.shapes[obj].type == "primative") {
        gl.bindBuffer(gl.ARRAY_BUFFER, shapes[obj].points);
        gl.vertexAttribPointer(shaderProgram.args.aVertexPosition.location,
                shapes[obj].points.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, shapes[obj].colors);
        gl.vertexAttribPointer(shaderProgram.args.aVertexColor.location,
                shapes[obj].colors.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shapes[obj].indices);

        if (shapes[obj].normals) {
            gl.bindBuffer(gl.ARRAY_BUFFER, shapes[obj].normals);
        }

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
}
function tick() {
	requestAnimFrame(tick);
	drawScene(SCENE);
}
function webGLStart() {
	var canvas = document.getElementById("oops");
	initGL(canvas);
	initShaders(SCENE);
	initBuffers(SCENE);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	tick();
}

