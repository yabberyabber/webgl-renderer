function drawObj(obj, scene, shaderInfo) {
    if (scene.shapes[obj].type == "primative") {
        setShaderInfo(shaderInfo);

        gl.bindBuffer(gl.ARRAY_BUFFER, shapes[obj].points);
        gl.vertexAttribPointer(shaderProgram.args.aVertexPosition.location,
                shapes[obj].points.itemSize, gl.FLOAT, false, 0, 0);

        if (shaderProgram.args.aVertexColor) {
            gl.bindBuffer(gl.ARRAY_BUFFER, shapes[obj].colors);
            gl.vertexAttribPointer(shaderProgram.args.aVertexColor.location,
                    shapes[obj].colors.itemSize, gl.FLOAT, false, 0, 0);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shapes[obj].indices);

        if (shapes[obj].normals && shaderProgram.args.aVertexNormal) {
            gl.bindBuffer(gl.ARRAY_BUFFER, shapes[obj].normals);
            gl.vertexAttribPointer(shaderProgram.args.aVertexNormal.location,
                    shapes[obj].normals.itemSize, gl.FLOAT, false, 0, 0);
        }

        gl.drawElements(gl.TRIANGLES, shapes[obj].indices.numItems,
                gl.UNSIGNED_SHORT, 0);
    }
    else {
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

            let childShaderInfo =
                obj.contents[i].shader || shaderInfo;

            drawObj(obj.contents[i].object, scene, childShaderInfo);
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
    var defaultShader = {"name": "default"};
    drawObj("main", scene, defaultShader);
    mvPopMatrix();
}
