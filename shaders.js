function createShader(gl, shaderScript, type) {
	var shader;
	if (type == "fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (type == "vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}
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

            var args = {};
            for (var i = 0; i < shaderObj.arguments.length; i++) {
                var arg = shaderObj.arguments[i];
                if (arg.type == "attribute") {
                    arg.location = gl.getAttribLocation(program, arg.name);
                    args[arg.name] = arg;
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
                args: args,
                name: shaderName
            };
        }
    }
    shaderProgram = shaders.default;
    enableAttributes(shaderProgram);
    gl.useProgram(shaderProgram.program);
}
var shaderSceneProperties = {};

function enableAttributes(shader) {
    for (let argName in shader.args) {
        if (shader.args.hasOwnProperty(argName)) {
            let arg = shader.args[argName];
            if (arg.type == "attribute") {
                gl.enableVertexAttribArray(arg.location);
            }
        }
    }
}

function disableAttributes(shader) {
    for (let argName in shader.args) {
        if (shader.args.hasOwnProperty(argName)) {
            let arg = shader.args[argName];
            if (arg.type == "attribute") {
                gl.disableVertexAttribArray(arg.location);
            }
        }
    }
}
function selectShaderProgram(programName) {
    disableAttributes(shaderProgram);
    shaderProgram = shaders[programName];
    gl.useProgram(shaderProgram.program);
    enableAttributes(shaderProgram);
}

function setShaderInfo(info) {
    selectShaderProgram(info.name);
    setUniforms(info.arguments || {});
}

/**
 * uPMatrix and uMVMatrix are special case uniforms.  Everything else must be 
 * set in shaderArgs
 */
function setUniforms(shaderArgs) {
    for (let argName in shaderProgram.args) {
        if (shaderProgram.args.hasOwnProperty(argName) &&
                shaderProgram.args[argName].type == "uniform") {
            let arg = shaderProgram.args[argName];
            let val, type;
            if (argName == "uPMatrix") {
                val = pMatrix;
                type = "4fv";
            }
            else if (argName == "uMVMatrix") {
                val = mvMatrix;
                type = "4fv";
            }
            else if (argName == "uNormalMatrix") {
                val = mat4.create();
                mat4.set(mvMatrix, val);
                mat4.transpose(val);
                mat4.inverse(val);
                type = "4fv";
            }
            else if (shaderArgs[argName]) {
                val = shaderArgs[argName];
                type = shaderProgram.args[argName].varType;
            }
            else {
                alert("Uniform not set: ", argName);
                console.log("Uniform not set: ", argName);
            }

            if (type == "4fv") {
                gl.uniformMatrix4fv(shaderProgram.args[argName].location, false, val);
            }
            else if (type == "f1") {
                gl.uniform1f(shaderProgram.args[argName].location, val);
            }
            else if (type == "vec3") {
                gl.uniform3fv(shaderProgram.args[argName].location,
                    new Float32Array(val));
            }
            else if (type == "vec4") {
                gl.uniform4fv(shaderProgram.args[argName].location,
                    new Float32Array(val));
            }
        }
    }
}

var textures = {};
function initTextures(scene) {
    for (let textureName in scene.textures) {
        if (scene.textures.hasOwnProperty(textureName)) {
            let textureImg = new Image();
            textureImg.onload = function() { textureLoadCallback(textureImg, textureName); };
            textureImg.src = scene.textures[textureName].src;
        }
    }
}

function textureLoadCallback(textureImg, textureName) {
    console.log(textureImg, textureName);
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImg);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    textures[textureName] = texture;
    console.log("Successfully loaded textureL ", textureName);
}
