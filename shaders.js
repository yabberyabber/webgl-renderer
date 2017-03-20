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


