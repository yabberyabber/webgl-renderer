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

function drawScene(scene) {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

	mvPushMatrix();
	mat4.identity(mvMatrix);
    drawObj("main", scene);
    mvPopMatrix();
}

function setMatrixUniforms() {
    for (let argName in shaderProgram.args) {
        if (shaderProgram.args.hasOwnProperty(argName) &&
                shaderProgram.args[argName].type == "uniform") {
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
