import { InfluencedCameraTarget, TargetInfluence, Vector2, lerpVector } from "../src";
import {
    influencedModecolors,
    ROCKET_PREVIEW_OFFSET,
    ROCKET_PREVIEW_SCALE,
    ROCKET_SCALE,
    ROCKET_SIZE,
    ROCKET_SPEED,
    WORLD_HEIGHT,
    WORLD_WIDTH,
} from "./constants";
import { DebugRect } from "./draw/DebugRect";
import { Sprite } from "./draw/Sprite";
import type { Game } from "./Game";
import { vectorToAngle } from "./utils";

const SPAWN_TIME = 0.3;

export class Rocket implements InfluencedCameraTarget {
    public x: number;
    public y: number;
    public lastValidDirection: Vector2 = { x: 0, y: 0 };
    public velocity: Vector2 = { x: 0, y: 0 };
    public velocityInfluence = new TargetInfluence({ maxLength: 200, factor: 0.2 });
    public influences: TargetInfluence[] = [];
    public zoom = 1.5;
    public spawnTime = SPAWN_TIME;
    private readonly sprite: Sprite;
    public readonly game: Game;

    public constructor(game: Game, start: Vector2, direction: Vector2) {
        this.lastValidDirection.x = direction.x;
        this.lastValidDirection.y = direction.y;

        this.x = start.x + this.lastValidDirection.x * ROCKET_PREVIEW_OFFSET;
        this.y = start.y + this.lastValidDirection.y * ROCKET_PREVIEW_OFFSET;

        this.game = game;
        this.sprite = new Sprite(game.gl, game.defaultShader, game.textures.rocket.texture);
        this.influences.push(this.velocityInfluence);
    }

    public update(deltaTime: number, moveDirection: Vector2) {
        let dirX = moveDirection.x;
        let dirY = moveDirection.y;
        if (dirX === 0 && dirY === 0) {
            dirX = this.lastValidDirection.x;
            dirY = this.lastValidDirection.y;
        } else {
            this.lastValidDirection.x = dirX;
            this.lastValidDirection.y = dirY;
        }
        lerpVector(this.velocity, dirX * ROCKET_SPEED, dirY * ROCKET_SPEED, 0.03);
        this.velocityInfluence.set(this.velocity.x, this.velocity.y);
        for (const influence of this.influences) influence.update();

        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        if (this.x < 0 || this.x >= WORLD_WIDTH || this.y < 0 || this.y >= WORLD_HEIGHT)
            this.game.player.removeRocket();

        if (this.spawnTime > 0) this.spawnTime = Math.max(0, this.spawnTime - deltaTime);
    }

    public draw() {
        const scale = this.getScale();
        const { width, height } = this.game.textures.rocket;
        const angle = vectorToAngle(this.velocity);
        this.sprite.set(this.x, this.y, width * scale, height * scale, angle);
        this.sprite.draw();
    }

    public drawDebugProjected(rect: DebugRect) {
        const { x, y } = this.velocityInfluence;
        rect.set(this.x + x - ROCKET_SIZE, this.y + y - ROCKET_SIZE, ROCKET_SIZE * 2, ROCKET_SIZE * 2);
        rect.stroke(influencedModecolors.TARGET_PROJECTED);
    }

    public getScale() {
        const pct = 1 - this.spawnTime / SPAWN_TIME;
        return ROCKET_PREVIEW_SCALE + pct * (ROCKET_SCALE - ROCKET_PREVIEW_SCALE);
    }
}
