/* eslint-disable */
import { DebugShader } from "./DebugShader";

export class DebugCircle {
    private readonly gl: WebGLRenderingContext;

    private readonly shader: DebugShader;

    private readonly vertBuffer: WebGLBuffer;

    private readonly data: Float32Array;

    public constructor(gl: WebGLRenderingContext, shader: DebugShader, points: number) {
        this.data = new Float32Array(points * 2);
        this.gl = gl;
        this.shader = shader;
        this.vertBuffer = this.gl.createBuffer() as WebGLBuffer;
    }

    public destroy() {
        this.gl.deleteBuffer(this.vertBuffer);
    }

    public set(x: number, y: number, radius: number) {
        const delta = (Math.PI * 2) / (this.data.length / 2);
        let angle = 0;
        for (let i = 0; i < this.data.length; i += 2) {
            angle += delta;
            this.data[i] = x + radius * Math.cos(angle);
            this.data[i + 1] = y + radius * Math.sin(angle);
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.STATIC_DRAW);
    }

    public render(color: [number, number, number, number]) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertBuffer);
        this.shader.position.enable();
        this.shader.position.set(2, this.gl.FLOAT, false, 0, 0);

        this.shader.color.setV(color);
        this.gl.drawArrays(this.gl.LINE_LOOP, 0, this.data.length / 2);
    }
}
