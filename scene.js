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
        "four_bunnies": {
            "type": "composit",
            "contents": [
                {
                    "object": "bunny",
                    "transforms": [
                        {"type": "translate", "x": 2.0, "y": 2.0, "z": 0.0},
                    ],
                    "shader": {
                        "name": "colored",
                        "arguments": {
                            "uColor": [1.0, 0.0, 0.0, 1.0]
                        }
                    }
                },
                {
                    "object": "bunny",
                    "transforms": [
                        {"type": "translate", "x": -2.0, "y": 2.0, "z": 0.0},
                    ],
                    "shader": {
                        "name": "normal"
                    }
                },
                {
                    "object": "bunny",
                    "transforms": [
                        {"type": "translate", "x": 2.0, "y": -2.0, "z": 0.0},
                    ],
                    "shader": {
                        "name": "phong",
                        "arguments": {
                            "LIGHT_POS": [0.0, 0.0, 0.0],
                            "LIGHT_COLOR": [1.0, 1.0, 1.0],
                            "OBJECT_COLOR": [1.0, 0.5, 0.8],
                            "mat_ambient": [0.05, 0.05, 0.05],
                            "mat_diffuse": [0.2, 0.2, 0.2],
                            "mat_specular": [0.7, 0.7, 0.7],
                            "mat_shiny": 0.6,
                            "PEXP": 4.0,
                        }
                    }
                },
                {
                    "object": "bunny",
                    "transforms": [
                        {"type": "translate", "x": -2.0, "y": -2.0, "z": 0.0},
                    ]
                }
            ]
        },
        "main": {
            "type": "composit",
            "contents": [
                {
                    "object": "four_bunnies",
                    "transforms": [
                        {"type": "translate", "x": 0, "y": 0.0, "z": -8.0},
                        {"type": "rotate", "theta": "0.05 * TIME", "x": 0.3, "y": 1, "z": 1}
                    ]
                },
                {
                    "object": "cube",
                    "transforms": [
                        {"type": "translate", "x": 0, "y": 0.0, "z": -8.0},
                        {"type": "rotate", "theta": "0.01 * TIME", "x": 0.3, "y": 1, "z": 1},
                        {"type": "scale", "x": 1.0, "y": 0.5, "z": 0.5},
                    ]
                }
            ]
        }
    }
};
