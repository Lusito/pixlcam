/* eslint-disable */

import { Game } from "./Game";

async function loadTexture(path: string, gl: WebGLRenderingContext) {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (e) => reject(e);
        image.src = path;
    });

    const texture = gl.createTexture() as WebGLTexture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // let's assume all images are not a power of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return {
        width: image.width,
        height: image.height,
        texture,
    };
}

export type TextureInfo = ReturnType<typeof loadTexture> extends Promise<infer T> ? T : never;

async function init() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl") as WebGLRenderingContext;
    const playerTexture = await loadTexture("/shipPink_manned.png", gl);
    const heartTexture = await loadTexture("/heart.png", gl);
    const burstTexture = await loadTexture("/laserGreen_burst.png", gl);
    const bgTexture = await loadTexture("/background.jpg", gl);

    const game = new Game(canvas, gl, playerTexture, heartTexture, burstTexture, bgTexture);

    let lastTime = 0;
    function render(time: number) {
        const deltaTime = (time - lastTime) / 1000;
        lastTime = time;

        game.update(deltaTime);

        window.requestAnimationFrame(render);
    }

    window.requestAnimationFrame(render);
}

init();
