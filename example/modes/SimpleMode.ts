/* eslint-disable */
import { Camera } from "../../src";
import { Player } from "../Player";
import type { Game } from "../Game";
import { AbstractMode } from "./AbstractMode";

export class SimpleMode extends AbstractMode<Camera> {
    public constructor(game: Game, player: Player) {
        super(game, player, new Camera());
    }

    public onEnable() {
        this.camera.moveTo(this.player.x, this.player.y);
    }

    public update() {
        this.camera.moveTo(this.player.x, this.player.y);
    }

    public draw() {}

    public drawDebug() {}
}
