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
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors),
                    gl.STATIC_DRAW);
            colorBuffer.itemSize = 4;
            colorBuffer.numItems = scene.shapes[shape].points.length;

            shapes[shape].colors = colorBuffer;

            var idxBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuffer);
            var indices = scene.shapes[shape].indices;
            indices = [].concat.apply([], indices);
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
                normals = [].concat.apply([], normals);
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


