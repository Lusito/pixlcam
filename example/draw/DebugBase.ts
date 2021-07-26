/* eslint-disable */
import { DebugShader } from "../shaders/DebugShader";
import { Color } from "./types";

export class DebugBase {
    protected readonly gl: WebGLRenderingContext;

    protected readonly shader: DebugShader;

    protected readonly vertBuffer: WebGLBuffer;

    protected readonly data: Float32Array;

    public constructor(gl: WebGLRenderingContext, shader: DebugShader, dataLength: number) {
        this.data = new Float32Array(dataLength);
        this.gl = gl;
        this.shader = shader;
        this.vertBuffer = this.gl.createBuffer() as WebGLBuffer;
    }

    public destroy() {
        this.gl.deleteBuffer(this.vertBuffer);
    }

    protected updateBuffer() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.DYNAMIC_DRAW);
    }

    protected prepareRender(color: Color) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertBuffer);
        this.shader.position.enable();
        this.shader.position.set(2, this.gl.FLOAT, false, 0, 0);

        this.shader.color.setV(color);
    }
}
