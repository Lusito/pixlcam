/* eslint-disable */
import { DebugShader } from "./DebugShader";

export class DebugGrid {
    private readonly gl: WebGLRenderingContext;

    private readonly shader: DebugShader;

    private readonly vertBuffer: WebGLBuffer;

    private readonly data: Float32Array;

    public constructor(gl: WebGLRenderingContext, shader: DebugShader, maxLines: number) {
        this.data = new Float32Array(maxLines * 4);
        this.gl = gl;
        this.shader = shader;
        this.vertBuffer = this.gl.createBuffer() as WebGLBuffer;
    }

    public destroy() {
        this.gl.deleteBuffer(this.vertBuffer);
    }

    private getDeltas(width: number, height: number) {
        const maxLines = this.data.length / 4;
        const remainingLines = maxLines - 2;
        const total = width + height;
        const linesX = Math.floor((width / total) * remainingLines);
        const linesY = remainingLines - linesX;
        return {
            linesX,
            linesY,
            deltaX: width / linesX,
            deltaY: height / linesY,
        };
    }

    public set(x: number, y: number, width: number, height: number) {
        const bottom = y + height;
        const right = x + width;
        let index = 0;
        // First line on the right
        this.data[index++] = right;
        this.data[index++] = y;
        this.data[index++] = right;
        this.data[index++] = bottom;
        // First line on the bottom
        this.data[index++] = x;
        this.data[index++] = bottom;
        this.data[index++] = right;
        this.data[index++] = bottom;

        const { linesX, linesY, deltaX, deltaY } = this.getDeltas(width, height);
        // vertical lines
        for (let xi = 0; xi < linesX; xi++) {
            const lx = Math.round(x + xi * deltaX);
            this.data[index++] = lx;
            this.data[index++] = y;
            this.data[index++] = lx;
            this.data[index++] = bottom;
        }

        // horizontal lines
        for (let yi = 0; yi < linesY; yi++) {
            const ly = Math.round(y + yi * deltaY);
            this.data[index++] = x;
            this.data[index++] = ly;
            this.data[index++] = right;
            this.data[index++] = ly;
        }
        if (index !== this.data.length) throw new Error("bad length");

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.STATIC_DRAW);
    }

    public render(color: [number, number, number, number]) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertBuffer);
        this.shader.position.enable();
        this.shader.position.set(2, this.gl.FLOAT, false, 0, 0);

        this.shader.color.setV(color);
        this.gl.drawArrays(this.gl.LINES, 0, this.data.length / 2);
    }
}
