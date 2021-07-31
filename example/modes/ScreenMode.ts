/* eslint-disable */
import { ScreenCamera } from "../../src";
import { Player } from "../Player";
import type { Game } from "../Game";
import { AbstractMode } from "./AbstractMode";

export class ScreenMode extends AbstractMode<ScreenCamera> {
    public constructor(game: Game, player: Player) {
        super(game, player, new ScreenCamera());
    }

    public onEnable() {}

    public update() {}

    public draw() {}

    public drawDebug() {}
}
