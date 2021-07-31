/* eslint-disable */
import { FollowingCamera } from "../../src";
import { colors, WORLD_HEIGHT, WORLD_WIDTH } from "../constants";
import { Player } from "../Player";
import type { Game } from "../Game";
import { AbstractMode } from "./AbstractMode";
import { showElement } from "../Sidebar";
import { positiveNumListener } from "../utils";

export class FollowingMode extends AbstractMode<FollowingCamera> {
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

        const { camera, sidebar } = this;
        sidebar.maxSpeed.value = camera.maxSpeed.toFixed(2);
        sidebar.acceleration.value = camera.acceleration.toFixed(2);
        sidebar.slowDistance.value = camera.slowDistance.toFixed(2);
        sidebar.lockDistance.value = camera.lockDistance.toFixed(2);
        positiveNumListener(sidebar.maxSpeed, (value) => {
            camera.maxSpeed = value;
        });
        positiveNumListener(sidebar.acceleration, (value) => {
            camera.acceleration = value;
        });
        positiveNumListener(sidebar.slowDistance, (value) => {
            camera.slowDistance = value;
        });
        positiveNumListener(sidebar.lockDistance, (value) => {
            camera.lockDistance = value;
        });
    }

    public onEnable() {
        const { camera, sidebar } = this;
        camera.moveTo(this.player.x, this.player.y);
        camera.moveInstantly();
        showElement(sidebar.maxSpeed);
        showElement(sidebar.acceleration);
        showElement(sidebar.slowDistance);
        showElement(sidebar.lockDistance);
        showElement(sidebar.cameraDesired);
        showElement(sidebar.cameraSlowDistance);
        showElement(sidebar.speed);
    }

    public update(deltaTime: number) {
        this.camera.moveTo(this.player.x, this.player.y);
        this.camera.update(deltaTime);
        this.sidebar.speed.value = this.camera.getSpeed().toFixed(0);
    }

    public draw() {}

    public drawDebug() {
        const { x, y } = this.camera.getDesired();
        if (this.sidebar.cameraDesired.checked) {
            this.crosshair.set(x, y, 16, 45);
            this.crosshair.stroke(colors.CAMERA_DESIRED);
        }
        if (this.sidebar.cameraSlowDistance.checked) {
            this.circle.set(x, y, this.camera.slowDistance);
            this.circle.stroke(colors.SLOW_DISTANCE);
        }
    }
}
