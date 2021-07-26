/* eslint-disable */
import { CameraCue, CueFocusCamera } from "../src";
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

export class Game {
    private readonly gl: WebGLRenderingContext;
    private readonly debugShader: DebugShader;
    private readonly defaultShader: DefaultShader;
    public readonly camera = new CueFocusCamera(300);
    private readonly player = new Player();
    private readonly circle: DebugCircle;
    private readonly rect: DebugRect;
    private readonly crosshair: DebugCrosshair;
    private readonly boundRects: DebugRect[] = [];
    private readonly cueInnerCircle: DebugCircle;
    private readonly cueOuterCircle: DebugCircle;
    private readonly cue: CameraCue = {
        x: WORLD_WIDTH / 2 + 500,
        y: WORLD_HEIGHT / 2 - 500,
        innerRadius: 300,
        outerRadius: 800,
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
        this.burstSprite.set(this.cue.x, this.cue.y, burstTexture.width, burstTexture.height, 0);

        this.bgSprite = new Sprite(gl, this.defaultShader, bgTexture.texture);
        this.bgSprite.set(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0);

        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_HEIGHT;
        gl.viewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.camera.zoom = 0.5; // fixme: setZoom, since resize depends on it
        this.camera.acceleration = 40;
        this.camera.slowDistance = 200;
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
        this.playerSprite.set(x, y, this.playerTexture.width, this.playerTexture.height, 0);
        this.playerSprite.draw();

        this.debugShader.use();
        this.debugShader.uMVMatrix.set(false, this.camera.modelView);
        this.debugShader.uPMatrix.set(false, this.camera.projection);

        // fixme: dedicated colors
        this.cueInnerCircle.stroke(colors.CAMERA_DESIRED);
        this.cueOuterCircle.stroke(colors.PLAYER_PROJECTED);

        this.debugShader.use();
        if (this.sidebar.cameraDesired.checked) {
            this.crosshair.set(this.camera.getDesiredX(), this.camera.getDesiredY(), 16, 45);
            this.crosshair.stroke(colors.CAMERA_DESIRED);
        }
        if (this.sidebar.cameraSlowDistance.checked) {
            this.circle.set(this.camera.getDesiredX(), this.camera.getDesiredY(), this.camera.slowDistance);
            this.circle.stroke(colors.SLOW_DISTANCE);
        }
        if (this.sidebar.playerProjectect.checked) {
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
    }
}
