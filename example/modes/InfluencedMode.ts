/* eslint-disable */
import { InfluencedCamera } from "../../src";
import { AIM_SIZE, colors, PLAYER_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from "../constants";
import { Player } from "../Player";
import type { TextureInfo } from "..";
import { GameCue } from "../GameCue";
import type { Game } from "../Game";
import { AbstractMode } from "./AbstractMode";
import { showElement } from "../Sidebar";

export class InfluencedMode extends AbstractMode<InfluencedCamera> {
    private readonly cue1: GameCue;
    private readonly cue2: GameCue;

    public constructor(game: Game, player: Player, burstTexture: TextureInfo) {
        super(game, player, new InfluencedCamera());

        this.cue1 = new GameCue(game, burstTexture, WORLD_WIDTH / 2 + 500, WORLD_HEIGHT / 2 - 500, 200, 800, 0.65);
        this.cue2 = new GameCue(game, burstTexture, WORLD_WIDTH / 3, WORLD_HEIGHT - 450, 200, 600, 1.6);
        this.camera.addCue(this.cue1);
        this.camera.addCue(this.cue2);

        this.camera.setBounds({
            xMin: 0,
            yMin: 0,
            xMax: WORLD_WIDTH,
            yMax: WORLD_HEIGHT,
        });
        this.camera.setTarget(player);
    }

    public onEnable() {
        const { sidebar } = this;
        showElement(sidebar.cameraCurrent);
        showElement(sidebar.cameraDesired);
        showElement(sidebar.targetProjected);
        showElement(sidebar.targetAim);
        showElement(sidebar.cueInner);
        showElement(sidebar.cueOuter);
    }

    public update() {
        this.camera.update();
        const { x, y } = this.camera.getOffset();
        this.sidebar.currentZoom.value = `${x.toFixed(0)},${y.toFixed(0)}`;
    }

    public draw() {
        this.cue1.drawBurst();
        this.cue2.drawBurst();
    }

    public drawDebug() {
        this.cue1.drawDebug(this.sidebar.cueInner.checked, this.sidebar.cueOuter.checked);
        this.cue2.drawDebug(this.sidebar.cueInner.checked, this.sidebar.cueOuter.checked);

        if (this.sidebar.cameraDesired.checked) {
            const { x, y } = this.camera.getOffset();
            this.crosshair.set(this.camera.getX() + x, this.camera.getY() + y, 16, 45);
            this.crosshair.stroke(colors.CAMERA_DESIRED);
        }
        if (this.sidebar.targetProjected.checked) {
            const { x, y } = this.player.velocityInfluence.get();
            this.rect.set(
                this.player.x + x - PLAYER_SIZE,
                this.player.y + y - PLAYER_SIZE,
                PLAYER_SIZE * 2,
                PLAYER_SIZE * 2
            );
            this.rect.stroke(colors.TARGET_PROJECTED);
        }
        if (this.sidebar.targetAim.checked) {
            const { x, y } = this.player.aimInfluence.get();
            this.rect.set(this.player.x + x - AIM_SIZE, this.player.y + y - AIM_SIZE, AIM_SIZE * 2, AIM_SIZE * 2);
            this.rect.stroke(colors.TARGET_AIM);
        }
    }
}
