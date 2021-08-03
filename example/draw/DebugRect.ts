import { DebugBase } from "./DebugBase";
import { DebugShader } from "../shaders/DebugShader";
import { Color } from "./types";

export class DebugRect extends DebugBase {
    public constructor(gl: WebGLRenderingContext, shader: DebugShader) {
        super(gl, shader, 8);
    }

    public set(left: number, top: number, width: number, height: number) {
        const right = left + width;
        const bottom = top + height;
        let i = 0;
        this.data[i++] = left;
        this.data[i++] = bottom;

        this.data[i++] = left;
        this.data[i++] = top;

        this.data[i++] = right;
        this.data[i++] = top;

        this.data[i++] = right;
        this.data[i++] = bottom;

        this.updateBuffer();
        return this;
    }

    public fill(color: Color) {
        this.prepareRender(color);
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
    }

    public stroke(color: Color) {
        this.prepareRender(color);
        this.gl.drawArrays(this.gl.LINE_LOOP, 0, 4);
    }
}
