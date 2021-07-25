/* eslint-disable */
import { DebugBase } from "./DebugBase";
import { DebugShader } from "./DebugShader";
import { Color } from "./types";

export class DebugGrid extends DebugBase {
    public constructor(gl: WebGLRenderingContext, shader: DebugShader, maxLines: number) {
        super(gl, shader, maxLines * 4);
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

        this.updateBuffer();
        return this;
    }

    public stroke(color: Color) {
        this.prepareRender(color);
        this.gl.drawArrays(this.gl.LINES, 0, this.data.length / 2);
    }
}
