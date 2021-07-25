/* eslint-disable */
import { DebugBase } from "./DebugBase";
import { DebugShader } from "./DebugShader";
import { Color } from "./types";

export class DebugCircle extends DebugBase {
    public constructor(gl: WebGLRenderingContext, shader: DebugShader, points: number) {
        super(gl, shader, 4 + points * 2);
    }

    public set(x: number, y: number, radius: number) {
        this.data[0] = x;
        this.data[1] = y;
        const points = this.data.length / 2 - 2;
        const delta = (Math.PI * 2) / points;
        let angle = 0;
        for (let i = 0; i < points; i++) {
            this.data[i * 2 + 2] = x + radius * Math.cos(angle);
            this.data[i * 2 + 3] = y + radius * Math.sin(angle);
            angle += delta;
        }
        this.data[this.data.length - 2] = this.data[2];
        this.data[this.data.length - 1] = this.data[3];

        this.updateBuffer();
        return this;
    }

    public fill(color: Color) {
        this.prepareRender(color);
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.data.length / 2);
    }

    public stroke(color: Color) {
        this.prepareRender(color);
        this.gl.drawArrays(this.gl.LINE_LOOP, 2, this.data.length / 2 - 2);
    }
}
