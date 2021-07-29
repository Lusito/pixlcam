/* eslint-disable */
import { CueFocusCamera } from "../src";
import { BOUND_SIZE, colors, PLAYER_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH, WORLD_HEIGHT, WORLD_WIDTH } from "./constants";
import { DebugCircle } from "./draw/DebugCircle";
import { DebugRect } from "./draw/DebugRect";
import { createDebugShader, DebugShader } from "./shaders/DebugShader";
import { Player } from "./Player";
import { Sidebar } from "./Sidebar";
import type { TextureInfo } from ".";
import { Sprite } from "./draw/Sprite";
import { createDefaultShader, DefaultShader } from "./shaders/DefaultShader";
import { DebugCrosshair } from "./draw/DebugCrosshair";
import { GameCue } from "./GameCue";

export class Game {
    public readonly gl: WebGLRenderingContext;
    public readonly debugShader: DebugShader;
    public readonly defaultShader: DefaultShader;
    public readonly camera = new CueFocusCamera(300);
    private readonly player = new Player();
    private readonly circle: DebugCircle;
    private readonly rect: DebugRect;
    private readonly crosshair: DebugCrosshair;
    private readonly boundRects: DebugRect[] = [];
    private readonly cue1: GameCue;
    private readonly cue2: GameCue;
    private readonly sidebar: Sidebar;
    private readonly playerSprite: Sprite;
    private readonly playerTexture: { width: number; height: number; texture: WebGLTexture };
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

        this.debugShader = createDebugShader(gl);
        this.defaultShader = createDefaultShader(gl);
        this.circle = new DebugCircle(gl, this.debugShader, 20);
        this.crosshair = new DebugCrosshair(gl, this.debugShader);
        this.rect = new DebugRect(gl, this.debugShader);
        this.boundRects.push(new DebugRect(gl, this.debugShader).set(0, 0, BOUND_SIZE, WORLD_HEIGHT));
        this.boundRects.push(new DebugRect(gl, this.debugShader).set(0, 0, WORLD_WIDTH, BOUND_SIZE));
        this.boundRects.push(
            new DebugRect(gl, this.debugShader).set(WORLD_WIDTH - BOUND_SIZE, 0, BOUND_SIZE, WORLD_HEIGHT)
        );
        this.boundRects.push(
            new DebugRect(gl, this.debugShader).set(0, WORLD_HEIGHT - BOUND_SIZE, WORLD_WIDTH, BOUND_SIZE)
        );

        this.cue1 = new GameCue(this, burstTexture, WORLD_WIDTH / 2 + 500, WORLD_HEIGHT / 2 - 500, 300, 800, 0.65);
        this.cue2 = new GameCue(this, burstTexture, WORLD_WIDTH / 3, WORLD_HEIGHT - 450, 200, 600, 1.6);
        this.camera.addCue(this.cue1);
        this.camera.addCue(this.cue2);

        this.playerTexture = playerTexture;
        this.playerSprite = new Sprite(gl, this.defaultShader, playerTexture.texture);

        this.bgSprite = new Sprite(gl, this.defaultShader, bgTexture.texture);
        this.bgSprite.set(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0);

        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_HEIGHT;
        gl.viewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.camera.acceleration = 40;
        this.camera.slowDistance = 200;
        this.camera.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.camera.setBounds({
            xMin: 0,
            yMin: 0,
            xMax: WORLD_WIDTH,
            yMax: WORLD_HEIGHT,
        });
        this.camera.setZoom(0.5);
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
        this.cue1.drawBurst();
        this.cue2.drawBurst();
        this.playerSprite.set(x, y, this.playerTexture.width, this.playerTexture.height, 0);
        this.playerSprite.draw();

        this.debugShader.use();
        this.debugShader.uMVMatrix.set(false, this.camera.modelView);
        this.debugShader.uPMatrix.set(false, this.camera.projection);

        this.cue1.drawDebug(this.sidebar.cueInner.checked, this.sidebar.cueOuter.checked);
        this.cue2.drawDebug(this.sidebar.cueInner.checked, this.sidebar.cueOuter.checked);

        if (this.sidebar.cameraDesired.checked) {
            this.crosshair.set(this.camera.getDesiredX(), this.camera.getDesiredY(), 16, 45);
            this.crosshair.stroke(colors.CAMERA_DESIRED);
        }
        if (this.sidebar.cameraSlowDistance.checked) {
            this.circle.set(this.camera.getDesiredX(), this.camera.getDesiredY(), this.camera.slowDistance);
            this.circle.stroke(colors.SLOW_DISTANCE);
        }
        if (this.sidebar.playerProjected.checked) {
            this.rect.set(
                this.camera.getProjectedX() - PLAYER_SIZE,
                this.camera.getProjectedY() - PLAYER_SIZE,
                PLAYER_SIZE * 2,
                PLAYER_SIZE * 2
            );
            this.rect.stroke(colors.PLAYER_PROJECTED);
        }
        if (this.sidebar.cameraCurrent.checked) {
            this.crosshair.set(this.camera.getX(), this.camera.getY(), 16, 0);
            this.crosshair.stroke(colors.CAMERA);
        }
        for (const rect of this.boundRects) {
            rect.fill(colors.BOUND);
        }
        this.sidebar.speed.value = this.camera.getSpeed().toFixed(0);
        this.sidebar.currentZoom.value = this.camera.getZoom().toFixed(3);
    }
}
