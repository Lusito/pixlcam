import { DebugBase } from "./DebugBase";
import { DebugShader } from "../shaders/DebugShader";
import { Color } from "./types";
import { DEG_TO_RAD } from "../constants";

export class DebugCrosshair extends DebugBase {
    public constructor(gl: WebGLRenderingContext, shader: DebugShader) {
        super(gl, shader, 8);
    }

    public set(x: number, y: number, size: number, rotation: number) {
        const rotationRadA = rotation * DEG_TO_RAD;
        const aX = Math.cos(rotationRadA) * size;
        const aY = Math.sin(rotationRadA) * size;

        const rotationRadB = (rotation + 90) * DEG_TO_RAD;
        const bX = Math.cos(rotationRadB) * size;
        const bY = Math.sin(rotationRadB) * size;

        let i = 0;
        this.data[i++] = x + aX;
        this.data[i++] = y + aY;
        this.data[i++] = x - aX;
        this.data[i++] = y - aY;

        this.data[i++] = x + bX;
        this.data[i++] = y + bY;
        this.data[i++] = x - bX;
        this.data[i++] = y - bY;

        // console.log(x, y, this.data);

        this.updateBuffer();
        return this;
    }

    public stroke(color: Color) {
        this.prepareRender(color);
        this.gl.drawArrays(this.gl.LINES, 0, 4);
    }
}
