import { DEG_TO_RAD } from "../constants";
import { DefaultShader } from "../shaders/DefaultShader";

export class Sprite {
    protected readonly gl: WebGLRenderingContext;

    protected readonly shader: DefaultShader;

    protected readonly vertBuffer: WebGLBuffer;

    protected readonly vertData: Float32Array;

    private readonly texture: WebGLTexture;

    private readonly uvBuffer: WebGLBuffer;

    public constructor(gl: WebGLRenderingContext, shader: DefaultShader, texture: WebGLTexture) {
        this.vertData = new Float32Array(8);
        this.gl = gl;
        this.shader = shader;
        this.vertBuffer = this.gl.createBuffer() as WebGLBuffer;

        this.texture = texture;
        this.uvBuffer = this.gl.createBuffer() as WebGLBuffer;
        this.updateBuffer(this.uvBuffer, new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]));
    }

    public destroy() {
        this.gl.deleteBuffer(this.vertBuffer);
        this.gl.deleteBuffer(this.uvBuffer);
    }

    public set(x: number, y: number, width: number, height: number, rotation: number) {
        const centerX = width / 2;
        const centerY = height / 2;
        const left = -centerX;
        const top = -centerY;
        const right = width - centerX;
        const bottom = height - centerY;

        const rotationRad = rotation * DEG_TO_RAD;
        const cos = Math.cos(rotationRad);
        const sin = Math.sin(rotationRad);

        const bottomLeftX = cos * left - sin * bottom + x;
        const bottomLeftY = sin * left + cos * bottom + y;

        const topLeftX = cos * left - sin * top + x;
        const topLeftY = sin * left + cos * top + y;

        const bottomRightX = cos * right - sin * bottom + x;
        const bottomRightY = sin * right + cos * bottom + y;

        const topRightX = topLeftX + (bottomRightX - bottomLeftX);
        const topRightY = bottomRightY - (bottomLeftY - topLeftY);

        let i = 0;
        this.vertData[i++] = bottomLeftX;
        this.vertData[i++] = bottomLeftY;

        this.vertData[i++] = topLeftX;
        this.vertData[i++] = topLeftY;

        this.vertData[i++] = topRightX;
        this.vertData[i++] = topRightY;

        this.vertData[i++] = bottomRightX;
        this.vertData[i++] = bottomRightY;

        this.updateBuffer(this.vertBuffer, this.vertData);
        return this;
    }

    private updateBuffer(buffer: WebGLBuffer, data: Float32Array) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    }

    public draw() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertBuffer);
        this.shader.position.enable();
        this.shader.position.set(2, this.gl.FLOAT, false, 0, 0);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
        this.shader.uv.enable();
        this.shader.uv.set(2, this.gl.FLOAT, false, 0, 0);

        this.shader.textureID.set(0);
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
    }
}
