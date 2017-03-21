SCENE.shaders = {
    "normal": {
        "arguments": [
            {"type": "attribute", "name": "aVertexPosition"},
            {"type": "attribute", "name": "aVertexNormal"},
            {"type": "uniform", "name": "uPMatrix"},
            {"type": "uniform", "name": "uMVMatrix"},
            {"type": "uniform", "name": "uNormalMatrix"},
        ],
        "fragment": `
            precision mediump float;
            varying vec4 vColor;
            void main(void) {
                gl_FragColor = vColor;
            }
        `,
        "vertex": `
            attribute vec3 aVertexPosition;
            attribute vec3 aVertexNormal;
            uniform mat4 uMVMatrix;
            uniform mat4 uNormalMatrix;
            uniform mat4 uPMatrix;
            varying vec4 vColor;
            varying vec3 vNormal;
            void main(void) {
                gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
                vec4 newNormal = uNormalMatrix *
                         vec4(aVertexNormal.x,
                              aVertexNormal.y,
                              aVertexNormal.z,
                              1.0);
                vColor = vec4(abs(newNormal.x),
                              abs(newNormal.y),
                              abs(newNormal.z),
                              1.0);
            }
        `
    },
    "colored": {
        "arguments": [
            {"type": "attribute", "name": "aVertexPosition"},
            {"type": "uniform", "name": "uPMatrix"},
            {"type": "uniform", "name": "uMVMatrix"},
            {"type": "uniform", "name": "uColor", "varType": "vec4"},
        ],
        "fragment": `
            precision mediump float;
            varying vec4 vColor;
            void main(void) {
                gl_FragColor = vColor;
            }
        `,
        "vertex": `
            attribute vec3 aVertexPosition;
            uniform mat4 uMVMatrix;
            uniform mat4 uPMatrix;
            uniform vec4 uColor;
            varying vec4 vColor;
            varying vec3 vNormal;
            void main(void) {
                gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
                vColor = uColor;
            }
        `
    },
    "default": {
        "arguments": [
            {"type": "attribute", "name": "aVertexPosition"},
            {"type": "attribute", "name": "aVertexColor"},
            {"type": "uniform", "name": "uPMatrix"},
            {"type": "uniform", "name": "uMVMatrix"},
        ],
        "fragment": `
            precision mediump float;
            varying vec4 vColor;
            void main(void) {
                gl_FragColor = vColor;
            }
        `,
        "vertex": `
            attribute vec3 aVertexPosition;
            attribute vec4 aVertexColor;
            uniform mat4 uMVMatrix;
            uniform mat4 uPMatrix;
            varying vec4 vColor;
            void main(void) {
                gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
                vColor = aVertexColor;
            }
        `
    },
    "phong": {
        "arguments": [
            {"type": "attribute", "name": "aVertexPosition"},
            {"type": "attribute", "name": "aVertexNormal"},
            {"type": "uniform", "name": "uPMatrix"},
            {"type": "uniform", "name": "uMVMatrix"},
            {"type": "uniform", "name": "uNormalMatrix"},
            {"type": "uniform", "name": "LIGHT_POS", "varType": "vec3"},
            {"type": "uniform", "name": "LIGHT_COLOR", "varType": "vec3"},
            {"type": "uniform", "name": "OBJECT_COLOR", "varType": "vec3"},
            {"type": "uniform", "name": "mat_ambient", "varType": "vec3"},
            {"type": "uniform", "name": "mat_diffuse", "varType": "vec3"},
            {"type": "uniform", "name": "mat_specular", "varType": "vec3"},
            {"type": "uniform", "name": "mat_shiny", "varType": "f1"},
            {"type": "uniform", "name": "PEXP", "varType": "f1"},
        ],
        "fragment": `
            precision mediump float;
            uniform vec3 LIGHT_POS;
            uniform vec3 LIGHT_COLOR;
            uniform vec3 OBJECT_COLOR;

            uniform vec3 mat_ambient;
            uniform vec3 mat_diffuse;
            uniform vec3 mat_specular;
            uniform float mat_shiny;

            uniform float PEXP;

            varying vec4 fragNor;
            varying vec4 fragPos;

            void main() {
                vec3 L = normalize(LIGHT_POS - fragPos.xyz);
                vec3 E = normalize(-vec3(fragPos.xyz));
                vec3 R = normalize(-reflect(L,fragNor.xyz));

                //ambient
                vec4 Iamb = clamp(
                        vec4(LIGHT_COLOR * mat_ambient, 1.0),
                        0.0, 1.0);

                //diffuse
                float diff = max(dot(fragNor.xyz, L), 0.0);
                vec4 Idiff = clamp(
                        vec4(LIGHT_COLOR * (diff * mat_diffuse), 1.0),
                        0.0, 1.0);

                // spec
                float spec = pow(max(dot(E, R), 0.0), mat_shiny);
                vec4 Ispec = clamp(
                        vec4(LIGHT_COLOR * (spec * mat_specular), 1.0), 
                        0.0, 1.0);

                gl_FragColor = clamp(Iamb + Idiff + Ispec, 0.0, 1.0);
            }

        `,
        "vertex": `
            attribute vec3 aVertexPosition;
            attribute vec3 aVertexNormal;
            uniform mat4 uMVMatrix;
            uniform mat4 uNormalMatrix;
            uniform mat4 uPMatrix;

            varying vec4 fragNor;
            varying vec4 fragPos;

            void main() {
                gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
                fragNor = uNormalMatrix *
                         vec4(aVertexNormal.x,
                              aVertexNormal.y,
                              aVertexNormal.z,
                              1.0);
                fragPos = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
            }
        `
    },
};
