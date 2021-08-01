/* eslint-disable */
import { Camera, ScreenCamera } from "../src";
import { namedColors, PLAYER_SPEED, SCREEN_HEIGHT, SCREEN_WIDTH, WORLD_HEIGHT, WORLD_WIDTH } from "./constants";
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
import { DebugCheckbox } from "./ui/DebugCheckbox";
import { NumberOption } from "./ui/NumberOption";

const colors = {
    CAMERA: namedColors.RED,
};

function applyCamera(camera: Camera, shader: DebugShader | DefaultShader) {
    shader.use();
    shader.uMVMatrix.set(false, camera.modelView);
    shader.uPMatrix.set(false, camera.projection);
}

export class Game {
    public readonly gl: WebGLRenderingContext;
    public readonly debugShader: DebugShader;
    public readonly defaultShader: DefaultShader;
    public mode!: AbstractMode<Camera>;
    private readonly player = new Player();
    private readonly crosshair: DebugCrosshair;
    private readonly heartSprite: Sprite;
    private readonly heartTexture: TextureInfo;
    private readonly playerSprite: Sprite;
    private readonly playerTexture: TextureInfo;
    private readonly bgSprite: Sprite;
    public readonly modes: {
        simple: SimpleMode;
        influenced: InfluencedMode;
        following: FollowingMode;
    };
    private readonly screenCamera: ScreenCamera;

    private ui = {
        cameraCurrent: new DebugCheckbox("＋ Camera Current", colors.CAMERA).show(),
        zoom: new NumberOption("Zoom", { min: "0.125", max: "8", value: "0.5", step: "0.125" }).show(),
        debug: document.getElementById("debug") as HTMLInputElement,
    };

    public constructor(
        canvas: HTMLCanvasElement,
        gl: WebGLRenderingContext,
        playerTexture: TextureInfo,
        heartTexture: TextureInfo,
        burstTexture: TextureInfo,
        bgTexture: TextureInfo
    ) {
        this.gl = gl;
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
        gl.enable(gl.BLEND);

        this.debugShader = createDebugShader(gl);
        this.defaultShader = createDefaultShader(gl);
        this.crosshair = new DebugCrosshair(gl, this.debugShader);

        this.playerTexture = playerTexture;
        this.playerSprite = new Sprite(gl, this.defaultShader, playerTexture.texture);

        this.heartTexture = heartTexture;
        this.heartSprite = new Sprite(gl, this.defaultShader, heartTexture.texture);

        this.bgSprite = new Sprite(gl, this.defaultShader, bgTexture.texture);
        this.bgSprite.set(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0);

        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_HEIGHT;
        gl.viewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        this.modes = {
            simple: new SimpleMode(this, this.player),
            influenced: new InfluencedMode(this, this.player, burstTexture),
            following: new FollowingMode(this, this.player),
        };
        this.screenCamera = new ScreenCamera();
        this.screenCamera.resize(SCREEN_WIDTH, SCREEN_HEIGHT);

        // Connect to mode dropdown
        const mode = document.getElementById("mode") as HTMLSelectElement;
        mode.value = "influenced";
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

        // Draw sprites
        applyCamera(this.mode.camera, this.defaultShader);
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

        // Draw debug
        if (this.ui.debug.checked) {
            applyCamera(this.mode.camera, this.debugShader);
            this.mode.drawDebug();

            if (this.ui.cameraCurrent.checked) {
                this.crosshair.set(this.mode.camera.getX(), this.mode.camera.getY(), 16, 0);
                this.crosshair.stroke(colors.CAMERA);
            }
        }

        // Draw HUD
        applyCamera(this.screenCamera, this.defaultShader);
        const heartWidth = this.heartTexture.width;
        const heartHeight = this.heartTexture.height;
        for (let i = 0; i < 3; i++) {
            this.heartSprite.set(
                5 + heartWidth / 2 + (5 + heartWidth) * i,
                5 + heartHeight / 2,
                heartWidth,
                heartHeight,
                0
            );
            this.heartSprite.draw();
        }
    }
}
