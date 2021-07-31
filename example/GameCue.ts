/* eslint-disable */
import { TextureInfo } from ".";
import { CueInfluence } from "../src";
import { colors } from "./constants";
import { DebugCircle } from "./draw/DebugCircle";
import { Sprite } from "./draw/Sprite";
import { Game } from "./Game";

export class GameCue implements CueInfluence {
    public x: number;
    public y: number;
    public innerRadius: number;
    public outerRadius: number;
    public zoom: number;
    private readonly innerCircle: DebugCircle;
    private readonly outerCircle: DebugCircle;
    private readonly burstSprite: Sprite;

    public constructor(
        game: Game,
        burstTexture: TextureInfo,
        x: number,
        y: number,
        innerRadius: number,
        outerRadius: number,
        zoom: number,
    ) {
        const { gl, debugShader, defaultShader } = game;
        this.x = x;
        this.y = y;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.zoom = zoom;

        this.innerCircle = new DebugCircle(gl, debugShader, 20).set(x, y, innerRadius);
        this.outerCircle = new DebugCircle(gl, debugShader, 20).set(x, y, outerRadius);

        this.burstSprite = new Sprite(gl, defaultShader, burstTexture.texture);
        this.burstSprite.set(x, y, burstTexture.width, burstTexture.height, 0);
    }

    public drawBurst() {
        this.burstSprite.draw();
    }

    public drawDebug(drawInner: boolean, drawOuter: boolean) {
        if (drawInner) this.innerCircle.stroke(colors.CUE_INNER);
        if (drawOuter) this.outerCircle.stroke(colors.CUE_OUTER);
    }
}
