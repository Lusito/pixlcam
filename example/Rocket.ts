/* eslint-disable */

import { TargetInfluence, AimInfluence, Vector2, lerpVector } from "../src";
import { ROCKET_SIZE, ROCKET_SPEED, WORLD_HEIGHT, WORLD_WIDTH } from "./constants";
import { DebugRect } from "./draw/DebugRect";
import { Sprite } from "./draw/Sprite";
import { Game } from "./Game";
import { colors } from "./modes/InfluencedMode";
import { vectorToAngle } from "./utils";

const SPAWN_TIME = 0.3;
const START_DISTANCE = 100;

export class Rocket implements TargetInfluence {
    public x: number;
    public y: number;
    public lastValidDirection: Vector2 = { x: 0, y: 0 };
    public velocity: Vector2 = { x: 0, y: 0 };
    public velocityInfluence = new AimInfluence({ maxLength: 200, factor: 0.2 });
    public aims: AimInfluence[] = [];
    public zoom = 1.5;
    public spawnTime = SPAWN_TIME;
    private readonly sprite: Sprite;
    public readonly game: Game;

    public constructor(game: Game, start: Vector2, direction: Vector2) {
        if (direction.x === 0 && direction.y === 0) this.lastValidDirection.x = 1;
        else this.lastValidDirection.x = direction.x;
        this.lastValidDirection.y = direction.y;

        this.x = start.x + this.lastValidDirection.x * START_DISTANCE;
        this.y = start.y + this.lastValidDirection.y * START_DISTANCE;

        this.game = game;
        this.sprite = new Sprite(game.gl, game.defaultShader, game.textures.rocket.texture);
        this.aims.push(this.velocityInfluence);
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

        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        if (this.x < 0 || this.x >= WORLD_WIDTH || this.y < 0 || this.y >= WORLD_HEIGHT)
            this.game.player.removeRocket();

        if (this.spawnTime > 0) this.spawnTime = Math.max(0, this.spawnTime - deltaTime);
    }

    public draw() {
        const scale = this.getSpawnPct() * 0.5;
        let { width, height } = this.game.textures.rocket;
        const angle = vectorToAngle(this.velocity);
        this.sprite.set(this.x, this.y, width * scale, height * scale, angle);
        this.sprite.draw();
    }

    public drawDebugProjected(rect: DebugRect) {
        const { x, y } = this.velocityInfluence.get();
        rect.set(this.x + x - ROCKET_SIZE, this.y + y - ROCKET_SIZE, ROCKET_SIZE * 2, ROCKET_SIZE * 2);
        rect.stroke(colors.TARGET_PROJECTED);
    }

    public getSpawnPct() {
        return 1 - this.spawnTime / SPAWN_TIME;
    }
}
