SCENE = {
    "shapes": {
        "cube": {
            "type": "primative",
            "points": [
                {x: -1.0, y: -1.0, z: 1.0,
                    color: [1.0, 0.0, 0.0, 1.0]
                },
                {x: 1.0, y: -1.0, z: 1.0, color: [1.0, 0.0, 0.0, 1.0]},
                {x: 1.0, y: 1.0, z: 1.0, color: [1.0, 0.0, 0.0, 1.0]},
                {x: -1.0, y: 1.0, z: 1.0, color: [1.0, 0.0, 0.0, 1.0]},
                {x: -1.0, y: -1.0, z: -1.0, color: [1.0, 1.0, 0.0, 1.0]},
                {x: -1.0, y: 1.0, z: -1.0, color: [1.0, 1.0, 0.0, 1.0]},
                {x: 1.0, y: 1.0, z: -1.0, color: [1.0, 1.0, 0.0, 1.0]},
                {x: 1.0, y: -1.0, z: -1.0, color: [1.0, 1.0, 0.0, 1.0]},
                {x: -1.0, y: -1.0, z: -1.0, color: [1.0, 0.5, 0.5, 1.0]},
                {x: 1.0, y: -1.0, z: -1.0, color: [1.0, 0.5, 0.5, 1.0]},
                {x: 1.0, y: -1.0, z: 1.0, color: [1.0, 0.5, 0.5, 1.0]},
                {x: -1.0, y: -1.0, z: 1.0, color: [1.0, 0.5, 0.5, 1.0]},
                {x: -1.0, y: -1.0, z: -1.0, color: [1.0, 0.0, 1.0, 1.0]},
                {x: 1.0, y: -1.0, z: -1.0, color: [1.0, 0.0, 1.0, 1.0]},
                {x: 1.0, y: -1.0, z: 1.0, color: [1.0, 0.0, 1.0, 1.0]},
                {x: -1.0, y: -1.0, z: 1.0, color: [1.0, 0.0, 1.0, 1.0]},
                {x: 1.0, y: -1.0, z: -1.0, color: [0.0, 0.0, 1.0, 1.0]},
                {x: 1.0, y: 1.0, z: -1.0, color: [0.0, 0.0, 1.0, 1.0]},
                {x: 1.0, y: 1.0, z: 1.0, color: [0.0, 0.0, 1.0, 1.0]},
                {x: 1.0, y: -1.0, z: 1.0, color: [0.0, 0.0, 1.0, 1.0]},
                {x: -1.0, y: -1.0, z: -1.0, color: [0.0, 1.0, 0.0, 1.0]},
                {x: -1.0, y: -1.0, z: 1.0, color: [0.0, 1.0, 0.0, 1.0]},
                {x: -1.0, y: 1.0, z: 1.0, color: [0.0, 1.0, 0.0, 1.0]},
                {x: -1.0, y: 1.0, z: -1.0, color: [0.0, 1.0, 0.0, 1.0]}
            ],
            "indices": [
                [0, 1, 2], [0, 2, 3],
                [4, 5, 6], [4, 6, 7],
                [8, 9, 10], [8, 10, 11],
                [12, 13, 14], [12, 14, 15],
                [16, 17, 18], [16, 18, 19],
                [20, 21, 22], [20, 22, 23]
            ]
        },
        "two_cubes": {
            "type": "composit",
            "contents": [
                {
                    "object": "cube",
                    "transforms": [
                        {"type": "translate", "x": -1.5, "y": 0.0, "z": 0.0},
                        {"type": "rotate", "theta": "0.05 * TIME", "x": 0.3, "y": 1, "z": 1}
                    ]
                },
                {
                    "object": "cube",
                    "transforms": [
                        {"type": "translate", "x": 1.5, "y": 0.0, "z": 0.0},
                        {"type": "rotate", "theta": "0.05 * TIME", "x": 1.0, "y": 0.3, "z": 1}
                    ]
                }
            ]
        },
        "four_cubes": {
            "type": "composit",
            "contents": [
                {
                    "object": "two_cubes",
                    "transforms": [
                        {"type": "translate", "x": 0, "y": 2.0, "z": 0.0},
                    ],
                    "shader": {
                        "name": "colored",
                        "arguments": {
                            "uColor": [1.0, 0.0, 0.0, 1.0]
                        }
                    }
                },
                {
                    "object": "two_cubes",
                    "transforms": [
                        {"type": "translate", "x": 0, "y": -2.0, "z": 0.0},
                        {"type": "scale", "x": 1.0, "y": 0.5, "z": 0.5},
                    ]
                }
            ]
        },
        "main": {
            "type": "composit",
            "contents": [
                {
                    "object": "four_cubes",
                    "transforms": [
                        {"type": "translate", "x": 0, "y": 0.0, "z": -8.0},
                        {"type": "rotate", "theta": "0.05 * TIME", "x": 0.3, "y": 1, "z": 1}
                    ]
                },
                {
                    "object": "bunny",
                    "transforms": [
                        {"type": "translate", "x": 0, "y": -1.1, "z": -8.0},
                        {"type": "rotate", "theta": "0.1 * TIME", "x": 0.3, "y": 1, "z": 1},
                        {"type": "translate", "x": 0.0, "y": -0.5, "z": 0.0},
                    ],
                    "shader": {
                        "name": "normal"
                    }
                }
            ]
        }
    },
    "shaders": {
        "normal": {
            "arguments": [
                {"type": "attribute", "name": "aVertexPosition"},
                {"type": "attribute", "name": "aVertexNormal"},
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
                attribute vec3 aVertexNormal;
                uniform mat4 uMVMatrix;
                uniform mat4 uPMatrix;
                varying vec4 vColor;
                varying vec3 vNormal;
                void main(void) {
                    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
                    vColor = vec4(aVertexNormal, 1.0);
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
        }
    }
};
