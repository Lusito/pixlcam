/* eslint-disable */
import { InfluencedCamera } from "../../src";
import { colors, PLAYER_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from "../constants";
import { Player } from "../Player";
import type { TextureInfo } from "..";
import { GameCue } from "../GameCue";
import type { Game } from "../Game";
import { AbstractMode } from "./AbstractMode";

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
        // fixme: update sidebar
    }

    public update() {
        this.camera.update();
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
        if (this.sidebar.playerProjected.checked) {
            const { x, y } = this.player.velocityAim.getFocus();
            this.rect.set(
                this.camera.getX() + x - PLAYER_SIZE,
                this.camera.getY() + y - PLAYER_SIZE,
                PLAYER_SIZE * 2,
                PLAYER_SIZE * 2
            );
            this.rect.stroke(colors.PLAYER_PROJECTED);
        }

        // fixme: controlAim (right stick input)
    }
}