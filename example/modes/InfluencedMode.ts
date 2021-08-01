/* eslint-disable */
import { InfluencedCamera } from "../../src";
import { AIM_SIZE, namedColors, PLAYER_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from "../constants";
import { Player } from "../Player";
import type { TextureInfo } from "..";
import { GameCue } from "../GameCue";
import type { Game } from "../Game";
import { AbstractMode } from "./AbstractMode";
import { DebugCheckbox } from "../ui/DebugCheckbox";
import { NumberOption } from "../ui/NumberOption";

export const colors = {
    TARGET_PROJECTED: namedColors.WHITE,
    TARGET_AIM: namedColors.CYAN,
    COMBINED_AIM: namedColors.GREEN,
    CUE_INNER: namedColors.PINK,
    CUE_OUTER: namedColors.OLIVE,
};

type UiKey = keyof InfluencedMode["ui"];

export class InfluencedMode extends AbstractMode<InfluencedCamera> {
    private ui = {
        combinedAimInfluence: new DebugCheckbox("⨉ Combined Aim Influence", colors.COMBINED_AIM),
        targetProjected: new DebugCheckbox("☐ Target Projected", colors.TARGET_PROJECTED),
        targetAim: new DebugCheckbox("☐ Target Aim", colors.TARGET_AIM),
        cueInner: new DebugCheckbox("◯ Cue Inner Radius", colors.CUE_INNER),
        cueOuter: new DebugCheckbox("◯ Cue Outer Radius", colors.CUE_OUTER),

        maxVelocityInfluence: new NumberOption("Max Velocity Influence", { min: "0" }),
        velocityInfluenceFactor: new NumberOption("Velocity Influence Factor", { min: "0", step: "0.1" }),
        maxAimInfluence: new NumberOption("Max Aim Influence", { min: "0" }),
        aimInfluenceFactor: new NumberOption("Aim Influence Factor", { min: "0", step: "0.1" }),
        aimInfluenceLerp: new NumberOption("Aim Influence Lerp", { min: "0", max: "1", step: "0.1" }),
        currentZoom: new NumberOption("Current Zoom", { disabled: true, type: "text" }, 3),
    };

    private readonly cue1: GameCue;
    private readonly cue2: GameCue;

    public constructor(game: Game, player: Player, burstTexture: TextureInfo) {
        super(game, player, new InfluencedCamera());

        this.cue1 = new GameCue(game, burstTexture, WORLD_WIDTH / 2 + 500, WORLD_HEIGHT / 2 - 500, 200, 800, 0.8);
        this.cue2 = new GameCue(game, burstTexture, WORLD_WIDTH / 3, WORLD_HEIGHT - 450, 200, 600, 1.4);
        this.camera.addCue(this.cue1);
        this.camera.addCue(this.cue2);

        this.camera.setBounds({
            xMin: 0,
            yMin: 0,
            xMax: WORLD_WIDTH,
            yMax: WORLD_HEIGHT,
        });
        this.camera.setTarget(player);

        this.ui.maxVelocityInfluence.value = player.velocityInfluence.maxLength;
        this.ui.velocityInfluenceFactor.value = player.velocityInfluence.factor;
        this.ui.maxAimInfluence.value = player.aimInfluence.maxLength;
        this.ui.aimInfluenceFactor.value = player.aimInfluence.factor;
        this.ui.aimInfluenceLerp.value = player.aimInfluence.lerp;
        this.ui.maxVelocityInfluence.addListener((value) => (player.velocityInfluence.maxLength = value));
        this.ui.velocityInfluenceFactor.addListener((value) => (player.velocityInfluence.factor = value));
        this.ui.maxAimInfluence.addListener((value) => (player.aimInfluence.maxLength = value));
        this.ui.aimInfluenceFactor.addListener((value) => (player.aimInfluence.factor = value));
        this.ui.aimInfluenceLerp.addListener((value) => (player.aimInfluence.lerp = value));
    }

    public override onDisable() {
        for (const key in this.ui) {
            this.ui[key as UiKey].hide();
        }
        this.player.removeRocket();
    }

    public override onEnable() {
        for (const key in this.ui) {
            this.ui[key as UiKey].show();
        }
    }

    public override update() {
        this.camera.update();
        this.ui.currentZoom.value = this.camera.getZoom();
    }

    public override draw() {
        this.cue1.draw();
        this.cue2.draw();
    }

    public override drawDebug() {
        this.cue1.drawDebug(this.ui.cueInner.checked, this.ui.cueOuter.checked);
        this.cue2.drawDebug(this.ui.cueInner.checked, this.ui.cueOuter.checked);

        if (this.ui.combinedAimInfluence.checked) {
            const { x, y } = this.camera.getOffset();
            this.crosshair.set(this.player.x + x, this.player.y + y, 16, 45);
            this.crosshair.stroke(colors.COMBINED_AIM);
        }
        if (this.ui.targetProjected.checked) this.player.drawDebugProjected(this.rect);
        if (this.ui.targetAim.checked) this.player.drawDebugAim(this.rect);
    }
}
