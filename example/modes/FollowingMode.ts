/* eslint-disable no-return-assign */
import { FollowingCamera } from "../../src";
import { followingModeColors } from "../constants";
import type { Player } from "../Player";
import type { Game } from "../Game";
import { AbstractMode } from "./AbstractMode";
import { DebugCheckbox } from "../ui/DebugCheckbox";
import { NumberOption } from "../ui/NumberOption";

type UiKey = keyof FollowingMode["ui"];

export class FollowingMode extends AbstractMode<FollowingCamera> {
    private ui = {
        cameraDesired: new DebugCheckbox("⨉ Camera Desired", followingModeColors.CAMERA_DESIRED),
        cameraSlowDistance: new DebugCheckbox("◯ Camera Slow Distance", followingModeColors.SLOW_DISTANCE),
        maxSpeed: new NumberOption("Max Speed", { min: "0.01" }),
        acceleration: new NumberOption("Acceleration", { min: "0.01" }),
        slowDistance: new NumberOption("Slow Distance", { min: "0" }),
        lockDistance: new NumberOption("Lock Distance", { min: "0" }),
        speed: new NumberOption("Speed", { disabled: true, type: "text" }),
    };

    public constructor(game: Game, player: Player) {
        super(game, player, new FollowingCamera());

        this.camera.acceleration = 40;
        this.camera.slowDistance = 200;

        const { camera } = this;
        this.ui.maxSpeed.value = camera.maxSpeed;
        this.ui.acceleration.value = camera.acceleration;
        this.ui.slowDistance.value = camera.slowDistance;
        this.ui.lockDistance.value = camera.lockDistance;
        this.ui.maxSpeed.addListener((value) => (camera.maxSpeed = value));
        this.ui.acceleration.addListener((value) => (camera.acceleration = value));
        this.ui.slowDistance.addListener((value) => (camera.slowDistance = value));
        this.ui.lockDistance.addListener((value) => (camera.lockDistance = value));
    }

    public override onDisable() {
        for (const key of Object.keys(this.ui)) {
            this.ui[key as UiKey].hide();
        }
    }

    public override onEnable() {
        for (const key of Object.keys(this.ui)) {
            this.ui[key as UiKey].show();
        }
        const { camera } = this;
        camera.moveTo(this.player.x, this.player.y);
        camera.moveInstantly();
    }

    public override update(deltaTime: number) {
        this.camera.moveTo(this.player.x, this.player.y);
        this.camera.update(deltaTime);
        this.ui.speed.value = this.camera.getSpeed();
    }

    public override drawDebug() {
        super.drawDebug();
        const { x, y } = this.camera.getDesired();
        if (this.ui.cameraDesired.checked) {
            this.crosshair.set(x, y, 16, 45);
            this.crosshair.stroke(followingModeColors.CAMERA_DESIRED);
        }
        if (this.ui.cameraSlowDistance.checked) {
            this.circle.set(x, y, this.camera.slowDistance);
            this.circle.stroke(followingModeColors.SLOW_DISTANCE);
        }
    }
}
