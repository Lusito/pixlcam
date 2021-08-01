/* eslint-disable */
import { Camera } from "../src";
import { BOUND_SIZE, colors, PLAYER_SPEED, SCREEN_HEIGHT, SCREEN_WIDTH, WORLD_HEIGHT, WORLD_WIDTH } from "./constants";
import { DebugRect } from "./draw/DebugRect";
import { createDebugShader, DebugShader } from "./shaders/DebugShader";
import { Player } from "./Player";
import type { TextureInfo } from ".";
import { Sprite } from "./draw/Sprite";
import { createDefaultShader, DefaultShader } from "./shaders/DefaultShader";
import { DebugCrosshair } from "./draw/DebugCrosshair";
import { AbstractMode, ModeKey } from "./modes/AbstractMode";
import { InfluencedMode } from "./modes/InfluencedMode";
import { FollowingMode } from "./modes/FollowingMode";
import { SimpleMode } from "./modes/SimpleMode";
import { ScreenMode } from "./modes/ScreenMode";
import { DebugCheckbox } from "./ui/DebugCheckbox";
import { NumberOption } from "./ui/NumberOption";

export class Game {
    public readonly gl: WebGLRenderingContext;
    public readonly debugShader: DebugShader;
    public readonly defaultShader: DefaultShader;
    public mode!: AbstractMode<Camera>;
    private readonly player = new Player();
    private readonly crosshair: DebugCrosshair;
    private readonly boundRects: DebugRect[] = [];
    private readonly playerSprite: Sprite;
    private readonly playerTexture: { width: number; height: number; texture: WebGLTexture };
    private readonly bgSprite: Sprite;
    public readonly modes: {
        screen: ScreenMode;
        simple: SimpleMode;
        influenced: InfluencedMode;
        following: FollowingMode;
    };

    private ui = {
        cameraCurrent: new DebugCheckbox("＋ Camera Current", colors.CAMERA).show(),
        zoom: new NumberOption("Zoom", { min: "0.125", max: "8", value: "0.5", step: "0.125" }).show(),
        debug: document.getElementById("debug") as HTMLInputElement,
    };

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
        this.crosshair = new DebugCrosshair(gl, this.debugShader);
        this.boundRects.push(new DebugRect(gl, this.debugShader).set(0, 0, BOUND_SIZE, WORLD_HEIGHT));
        this.boundRects.push(new DebugRect(gl, this.debugShader).set(0, 0, WORLD_WIDTH, BOUND_SIZE));
        this.boundRects.push(
            new DebugRect(gl, this.debugShader).set(WORLD_WIDTH - BOUND_SIZE, 0, BOUND_SIZE, WORLD_HEIGHT)
        );
        this.boundRects.push(
            new DebugRect(gl, this.debugShader).set(0, WORLD_HEIGHT - BOUND_SIZE, WORLD_WIDTH, BOUND_SIZE)
        );

        this.playerTexture = playerTexture;
        this.playerSprite = new Sprite(gl, this.defaultShader, playerTexture.texture);

        this.bgSprite = new Sprite(gl, this.defaultShader, bgTexture.texture);
        this.bgSprite.set(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0);

        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_HEIGHT;
        gl.viewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        this.modes = {
            screen: new ScreenMode(this, this.player),
            simple: new SimpleMode(this, this.player),
            influenced: new InfluencedMode(this, this.player, burstTexture),
            following: new FollowingMode(this, this.player),
        };

        // Connect to mode dropdown
        const mode = document.getElementById("mode") as HTMLSelectElement;
        mode.addEventListener("change", () => {
            this.setMode(mode.value as ModeKey);
        });
        this.setMode(mode.value as ModeKey);

        // Connect to snapToPixel option
        const snapToPixel = document.getElementById("snapToPixel") as HTMLInputElement;
        snapToPixel.checked = this.mode.camera.snapToPixel;
        snapToPixel.addEventListener("input", () => {
            for (const key in this.modes) {
                const mode = this.modes[key as ModeKey];
                mode.camera.snapToPixel = snapToPixel.checked;
            }
        });

        // Connect to zoom option
        this.ui.zoom.value = this.mode.camera.getZoom();
        this.ui.zoom.addListener((value) => {
            for (const key in this.modes) {
                const mode = this.modes[key as ModeKey];
                mode.camera.setZoom(value);
            }
        });

        // Prevent key presses from reaching player input when user is in the sidebar
        const sidebar = document.getElementById("sidebar")!;
        sidebar.addEventListener("keydown", (e) => e.stopImmediatePropagation());
        sidebar.addEventListener("keyup", (e) => e.stopImmediatePropagation());
        sidebar.addEventListener("keypress", (e) => e.stopImmediatePropagation());
    }

    public setMode(modeKey: ModeKey) {
        const mode = this.modes[modeKey];
        if (mode) {
            this.mode?.onDisable();
            this.mode = mode;
            mode.onEnable();
        }
    }

    public update(deltaTime: number) {
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.player.update(deltaTime);
        this.mode.update(deltaTime);

        const { camera } = this.mode;
        const { modelView, projection } = camera;

        this.defaultShader.use();
        this.defaultShader.uMVMatrix.set(false, modelView);
        this.defaultShader.uPMatrix.set(false, projection);
        this.bgSprite.draw();
        this.mode.draw();
        const scale = this.player.getSpawnPct();
        this.playerSprite.set(
            this.player.x,
            this.player.y,
            this.playerTexture.width * scale,
            this.playerTexture.height * scale,
            (this.player.velocity.x / PLAYER_SPEED) * 25
        );
        this.playerSprite.draw();

        this.debugShader.use();
        this.debugShader.uMVMatrix.set(false, modelView);
        this.debugShader.uPMatrix.set(false, projection);

        if (this.ui.debug.checked) {
            this.mode.drawDebug();

            if (this.ui.cameraCurrent.checked) {
                this.crosshair.set(camera.getX(), camera.getY(), 16, 0);
                this.crosshair.stroke(colors.CAMERA);
            }
            for (const rect of this.boundRects) {
                rect.fill(colors.BOUND);
            }
        }
    }
}
