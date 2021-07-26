/* eslint-disable */
import { CameraCue, CueFocusCamera } from "../src";
import { BOUND_SIZE, colors, PLAYER_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH, WORLD_HEIGHT, WORLD_WIDTH } from "./constants";
import { DebugCircle } from "./debug/DebugCircle";
import { DebugRect } from "./debug/DebugRect";
import { createDebugShader, DebugShader } from "./shaders/DebugShader";
import { Player } from "./Player";
import { Sidebar } from "./Sidebar";
import type { TextureInfo } from ".";
import { Sprite } from "./debug/Sprite";
import { createDefaultShader, DefaultShader } from "./shaders/DefaultShader";

export class Game {
    private readonly gl: WebGLRenderingContext;
    private readonly debugShader: DebugShader;
    private readonly defaultShader: DefaultShader;
    public readonly camera = new CueFocusCamera(150);
    private readonly player = new Player();
    private readonly circle: DebugCircle;
    private readonly boundRects: DebugRect[] = [];
    private readonly cueInnerCircle: DebugCircle;
    private readonly cueOuterCircle: DebugCircle;
    private readonly cue: CameraCue = {
        x: WORLD_WIDTH / 2 + 250,
        y: WORLD_HEIGHT / 2 - 250,
        innerRadius: 150,
        outerRadius: 400,
    };
    private readonly sidebar: Sidebar;
    private readonly playerSprite: Sprite;
    private readonly playerTexture: { width: number; height: number; texture: WebGLTexture };
    private readonly burstSprite: Sprite;
    private readonly bgSprite: Sprite;

    public constructor(
        canvas: HTMLCanvasElement,
        gl: WebGLRenderingContext,
        playerTexture: TextureInfo,
        burstTexture: TextureInfo,
        bgTexture: TextureInfo
    ) {
        this.gl = gl;
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
        gl.enable(gl.BLEND);
        this.camera.setCue(this.cue);

        this.debugShader = createDebugShader(gl);
        this.defaultShader = createDefaultShader(gl);
        this.circle = new DebugCircle(gl, this.debugShader, 20);
        this.boundRects.push(new DebugRect(gl, this.debugShader).set(0, 0, BOUND_SIZE, WORLD_HEIGHT));
        this.boundRects.push(new DebugRect(gl, this.debugShader).set(0, 0, WORLD_WIDTH, BOUND_SIZE));
        this.boundRects.push(
            new DebugRect(gl, this.debugShader).set(WORLD_WIDTH - BOUND_SIZE, 0, BOUND_SIZE, WORLD_HEIGHT)
        );
        this.boundRects.push(
            new DebugRect(gl, this.debugShader).set(0, WORLD_HEIGHT - BOUND_SIZE, WORLD_WIDTH, BOUND_SIZE)
        );
        this.cueInnerCircle = new DebugCircle(gl, this.debugShader, 20).set(
            this.cue.x,
            this.cue.y,
            this.cue.innerRadius
        );
        this.cueOuterCircle = new DebugCircle(gl, this.debugShader, 20).set(
            this.cue.x,
            this.cue.y,
            this.cue.outerRadius
        );
        this.playerTexture = playerTexture;
        this.playerSprite = new Sprite(gl, this.defaultShader, playerTexture.texture);

        this.burstSprite = new Sprite(gl, this.defaultShader, burstTexture.texture);
        this.burstSprite.set(this.cue.x, this.cue.y, burstTexture.width / 2, burstTexture.height / 2, 0);

        this.bgSprite = new Sprite(gl, this.defaultShader, bgTexture.texture);
        this.bgSprite.set(WORLD_WIDTH/2, WORLD_HEIGHT/2, WORLD_WIDTH, WORLD_HEIGHT, 0);

        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_HEIGHT;
        gl.viewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.camera.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.camera.setBounds({
            xMin: 0,
            yMin: 0,
            xMax: WORLD_WIDTH,
            yMax: WORLD_HEIGHT,
        });
        const { x, y, velX, velY } = this.player;
        this.camera.setPlayer(x, y, velX, velY);
        this.camera.updateForced();

        this.sidebar = new Sidebar(this);
    }

    public update(deltaTime: number) {
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.player.update(deltaTime);
        const { x, y, velX, velY } = this.player;
        this.camera.setPlayer(x, y, velX, velY);
        this.camera.update(deltaTime);

        this.defaultShader.use();
        this.defaultShader.uMVMatrix.set(false, this.camera.modelView);
        this.defaultShader.uPMatrix.set(false, this.camera.projection);
        this.bgSprite.draw();
        this.burstSprite.draw();
        this.playerSprite.set(x, y, this.playerTexture.width / 2, this.playerTexture.height / 2, 0);
        this.playerSprite.draw();

        this.debugShader.use();
        this.debugShader.uMVMatrix.set(false, this.camera.modelView);
        this.debugShader.uPMatrix.set(false, this.camera.projection);

        // fixme: dedicated colors
        this.cueInnerCircle.stroke(colors.CAMERA_DESIRED);
        this.cueOuterCircle.stroke(colors.PLAYER_PROJECTED);

        this.debugShader.use();
        if (this.sidebar.cameraDesired.checked) {
            this.circle.set(this.camera.getDesiredX(), this.camera.getDesiredY(), 8);
            this.circle.stroke(colors.CAMERA_DESIRED);
        }
        if (this.sidebar.cameraSlowDistance.checked) {
            this.circle.set(this.camera.getDesiredX(), this.camera.getDesiredY(), this.camera.slowDistance);
            this.circle.stroke(colors.SLOW_DISTANCE);
        }
        if (this.sidebar.playerProjectect.checked) {
            this.circle.set(this.camera.getProjectedX(), this.camera.getProjectedY(), PLAYER_SIZE);
            this.circle.stroke(colors.PLAYER_PROJECTED);
        }
        if (this.sidebar.cameraCurrent.checked) {
            this.circle.set(this.camera.getX(), this.camera.getY(), 5);
            this.circle.fill(colors.CAMERA);
        }
        for (const rect of this.boundRects) {
            rect.fill(colors.BOUND);
        }
    }
}

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
