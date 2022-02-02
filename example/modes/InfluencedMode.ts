/* eslint-disable no-return-assign */
import { InfluencedCamera } from "../../src";
import { influencedModecolors, WORLD_HEIGHT, WORLD_WIDTH } from "../constants";
import type { Player } from "../Player";
import type { TextureInfo } from "..";
import { GameCue } from "../GameCue";
import type { Game } from "../Game";
import { AbstractMode } from "./AbstractMode";
import { DebugCheckbox } from "../ui/DebugCheckbox";
import { NumberOption } from "../ui/NumberOption";

type UiKey = keyof InfluencedMode["ui"];

export class InfluencedMode extends AbstractMode<InfluencedCamera> {
    private ui = {
        offset: new DebugCheckbox("⨉ Offset (due to target change)", influencedModecolors.OFFSET),
        targetProjected: new DebugCheckbox("☐ Target Projected", influencedModecolors.TARGET_PROJECTED),
        targetAim: new DebugCheckbox("☐ Target Aim", influencedModecolors.TARGET_AIM),
        cueInner: new DebugCheckbox("◯ Cue Inner Radius", influencedModecolors.CUE_INNER),
        cueOuter: new DebugCheckbox("◯ Cue Outer Radius", influencedModecolors.CUE_OUTER),

        maxVelocityInfluence: new NumberOption("Max Velocity Influence", { min: "0" }),
        velocityInfluenceFactor: new NumberOption("Velocity Influence Factor", { min: "0", step: "0.1" }),
        maxAimInfluence: new NumberOption("Max Aim Influence", { min: "0" }),
        aimInfluenceFactor: new NumberOption("Aim Influence Factor", { min: "0", step: "0.1" }),
        aimInfluenceLerp: new NumberOption("Aim Influence Lerp", { min: "0", max: "1", step: "0.1" }),
        currentZoom: new NumberOption("Current Zoom", { disabled: true, type: "text" }, 3),
    };

    private readonly cues: GameCue[] = [];

    public constructor(game: Game, player: Player, burstTexture: TextureInfo) {
        super(game, player, new InfluencedCamera());

        this.addCue(new GameCue(game, burstTexture, WORLD_WIDTH / 2 + 500, WORLD_HEIGHT / 2 - 500, 200, 1000, 0.6));
        // this.addCue(new GameCue(game, burstTexture, WORLD_WIDTH / 2 - 100, WORLD_HEIGHT / 2 - 500, 200, 1000, 0.6));
        this.addCue(new GameCue(game, burstTexture, WORLD_WIDTH / 3, WORLD_HEIGHT - 450, 200, 600, 1.4));

        this.camera.setTarget(player);

        this.ui.maxVelocityInfluence.value = player.velocityInfluence.maxLength;
        this.ui.velocityInfluenceFactor.value = player.velocityInfluence.factor;
        this.ui.maxAimInfluence.value = player.aimInfluence.maxLength;
        this.ui.aimInfluenceFactor.value = player.aimInfluence.factor;
        this.ui.aimInfluenceLerp.value = player.aimInfluence.lerpFactor;
        this.ui.maxVelocityInfluence.addListener((value) => (player.velocityInfluence.maxLength = value));
        this.ui.velocityInfluenceFactor.addListener((value) => (player.velocityInfluence.factor = value));
        this.ui.maxAimInfluence.addListener((value) => (player.aimInfluence.maxLength = value));
        this.ui.aimInfluenceFactor.addListener((value) => (player.aimInfluence.factor = value));
        this.ui.aimInfluenceLerp.addListener((value) => (player.aimInfluence.lerpFactor = value));
    }

    private addCue(cue: GameCue) {
        this.cues.push(cue);
        this.camera.addCue(cue);
    }

    public override onDisable() {
        for (const key of Object.keys(this.ui)) {
            this.ui[key as UiKey].hide();
        }
        this.player.removeRocket();
    }

    public override onEnable() {
        for (const key of Object.keys(this.ui)) {
            this.ui[key as UiKey].show();
        }
    }

    public override update(deltaTime: number) {
        this.camera.update(deltaTime);
        this.ui.currentZoom.value = this.camera.getZoom();
    }

    public override draw() {
        for (const cue of this.cues) cue.draw();
    }

    public override drawDebug() {
        super.drawDebug();
        for (const cue of this.cues) cue.drawDebug(this.ui.cueInner.checked, this.ui.cueOuter.checked);

        const target = this.camera.getTarget();
        if (target && this.ui.offset.checked) {
            const { x, y } = this.camera.getOffset();
            this.crosshair.set(target.x + x, target.y + y, 16, 45);
            this.crosshair.stroke(influencedModecolors.OFFSET);
        }
        if (this.ui.targetProjected.checked) this.player.drawDebugProjected(this.rect);
        if (this.ui.targetAim.checked) this.player.drawDebugAim(this.rect);
    }
}
