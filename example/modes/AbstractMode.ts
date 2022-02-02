/* eslint-disable @typescript-eslint/no-empty-function */
import { Camera } from "../../src";
import { namedColors, SCREEN_HEIGHT, SCREEN_WIDTH, WORLD_BOUNDS, WORLD_HEIGHT, WORLD_WIDTH } from "../constants";
import { DebugCircle } from "../draw/DebugCircle";
import { DebugRect } from "../draw/DebugRect";
import type { Player } from "../Player";
import { DebugCrosshair } from "../draw/DebugCrosshair";
import type { Game } from "../Game";

export type ModeKey = "simple" | "following" | "influenced";

export abstract class AbstractMode<T extends Camera> {
    public readonly camera: T;
    protected readonly circle: DebugCircle;
    protected readonly rect: DebugRect;
    protected readonly crosshair: DebugCrosshair;
    protected readonly player: Player;
    protected readonly game: Game;

    public constructor(game: Game, player: Player, camera: T) {
        this.game = game;
        this.player = player;
        this.camera = camera;
        this.circle = new DebugCircle(game.gl, game.debugShader, 20);
        this.crosshair = new DebugCrosshair(game.gl, game.debugShader);
        this.rect = new DebugRect(game.gl, game.debugShader);

        this.camera.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.camera.setZoom(0.5);

        this.camera.setBounds(WORLD_BOUNDS);
    }

    public onDisable() {}

    public onEnable() {}

    public update(_deltaTime: number) {}

    public draw() {}

    public drawDebug() {
        if (this.game.ui.boundaries.checked) {
            this.rect.set(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
            this.rect.stroke(namedColors.RED);
        }
    }
}
