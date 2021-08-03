import { createShaderProgram, glsl } from "typed-glsl";

const vertexShaderSource = glsl`
attribute vec2 position;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderSource = glsl`
precision highp float;
uniform vec4 color;

void main() {
    gl_FragColor = color;
}
`;

export function createDebugShader(gl: WebGLRenderingContext) {
    return createShaderProgram(gl, vertexShaderSource, fragmentShaderSource, {
        position: "vertexAttribPointer",
        uMVMatrix: "uniformMatrix4f",
        uPMatrix: "uniformMatrix4f",
        color: "uniform4f",
    });
}

export type DebugShader = ReturnType<typeof createDebugShader>;
