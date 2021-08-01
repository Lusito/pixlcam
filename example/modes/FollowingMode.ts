/* eslint-disable */
import { FollowingCamera } from "../../src";
import { namedColors, WORLD_HEIGHT, WORLD_WIDTH } from "../constants";
import { Player } from "../Player";
import type { Game } from "../Game";
import { AbstractMode } from "./AbstractMode";
import { DebugCheckbox } from "../ui/DebugCheckbox";
import { NumberOption } from "../ui/NumberOption";

const colors = {
    CAMERA_DESIRED: namedColors.GREEN,
    SLOW_DISTANCE: namedColors.CYAN,
};

type UiKey = keyof FollowingMode["ui"];

export class FollowingMode extends AbstractMode<FollowingCamera> {
    private ui = {
        cameraDesired: new DebugCheckbox("⨉ Camera Desired", colors.CAMERA_DESIRED),
        cameraSlowDistance: new DebugCheckbox("◯ Camera Slow Distance", colors.SLOW_DISTANCE),
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
        this.camera.setBounds({
            xMin: 0,
            yMin: 0,
            xMax: WORLD_WIDTH,
            yMax: WORLD_HEIGHT,
        });

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
        for (const key in this.ui) {
            this.ui[key as UiKey].hide();
        }
    }

    public override onEnable() {
        for (const key in this.ui) {
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

    public override draw() {}

    public override drawDebug() {
        const { x, y } = this.camera.getDesired();
        if (this.ui.cameraDesired.checked) {
            this.crosshair.set(x, y, 16, 45);
            this.crosshair.stroke(colors.CAMERA_DESIRED);
        }
        if (this.ui.cameraSlowDistance.checked) {
            this.circle.set(x, y, this.camera.slowDistance);
            this.circle.stroke(colors.SLOW_DISTANCE);
        }
    }
}
