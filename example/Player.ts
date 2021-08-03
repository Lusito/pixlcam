import { TargetInfluence, AimInfluence, SlowAimInfluence, Vector2, lerpVector, InfluencedCamera } from "../src";
import {
    AIM_SIZE,
    BOUND_DISTANCE,
    influencedModecolors,
    PLAYER_SIZE,
    PLAYER_SPEED,
    ROCKET_PREVIEW_OFFSET,
    ROCKET_PREVIEW_SCALE,
    WORLD_HEIGHT,
    WORLD_WIDTH,
} from "./constants";
import { DebugRect } from "./draw/DebugRect";
import { Sprite } from "./draw/Sprite";
import type { Game } from "./Game";
import { InputController } from "./InputController";
import { InfluencedMode } from "./modes/InfluencedMode";
import { Rocket } from "./Rocket";
import { xyToAngle } from "./utils";

const SPAWN_TIME = 0.3;

export class Player implements TargetInfluence {
    public x = WORLD_WIDTH / 2;
    public y = WORLD_HEIGHT / 2;
    public velocity: Vector2 = { x: 0, y: 0 };
    public velocityInfluence = new AimInfluence({ maxLength: 300, factor: 0.2 });
    public aimInfluence = new SlowAimInfluence({ maxLength: 300, factor: 0.3, lerp: 0.1 });
    public aims: AimInfluence[] = [];
    public zoom = 1;
    public spawnTime = SPAWN_TIME;
    private readonly sprite: Sprite;
    private readonly rocketSprite: Sprite;
    public readonly game: Game;
    public input: InputController;
    private rocket: Rocket | null = null;

    public constructor(game: Game) {
        this.input = new InputController(this);
        this.game = game;
        this.sprite = new Sprite(game.gl, game.defaultShader, game.textures.player.texture);
        this.rocketSprite = new Sprite(game.gl, game.defaultShader, game.textures.rocket.texture);
        this.aims.push(this.velocityInfluence);
        this.aims.push(this.aimInfluence);
    }

    public teleport() {
        if (this.rocket) return;

        for (let i = 0; i < 10; i++) {
            const x = BOUND_DISTANCE + Math.random() * (WORLD_WIDTH - BOUND_DISTANCE * 2);
            const y = BOUND_DISTANCE + Math.random() * (WORLD_HEIGHT - BOUND_DISTANCE * 2);
            if (Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2) > 500) {
                this.x = x;
                this.y = y;
                this.spawnTime = SPAWN_TIME;
                return;
            }
        }
        console.log("Could not find a new spot far away enough");
    }

    public shootRocket() {
        // If already has rocket, remove it, go back to player as target.
        if (this.rocket) {
            this.removeRocket();
        } else if (this.input.aimDirection.x || this.input.aimDirection.y) {
            const { camera } = this.game.mode;
            if (camera instanceof InfluencedCamera) {
                this.rocket = new Rocket(this.game, this, this.input.aimDirection);
                camera.setTarget(this.rocket);
            }
        }
    }

    public removeRocket() {
        this.rocket = null;
        const { camera } = this.game.mode;
        if (camera instanceof InfluencedCamera) camera.setTarget(this);
    }

    public update(deltaTime: number) {
        this.input.update();

        let speed = PLAYER_SPEED;
        if (this.rocket) {
            speed = 0;
            lerpVector(this.velocity, 0, 0);
            this.aimInfluence.set(0, 0);
            this.rocket.update(deltaTime, this.input.aimDirection);
        }

        lerpVector(this.velocity, this.input.moveDirection.x * speed, this.input.moveDirection.y * speed);
        this.aimInfluence.set(this.input.aimDirection.x * speed, this.input.aimDirection.y * speed);
        this.velocityInfluence.set(this.velocity.x, this.velocity.y);
        this.aimInfluence.update();

        this.x = Math.max(BOUND_DISTANCE, Math.min(WORLD_WIDTH - BOUND_DISTANCE, this.x + this.velocity.x * deltaTime));
        this.y = Math.max(
            BOUND_DISTANCE,
            Math.min(WORLD_HEIGHT - BOUND_DISTANCE, this.y + this.velocity.y * deltaTime)
        );

        if (this.spawnTime > 0) this.spawnTime = Math.max(0, this.spawnTime - deltaTime);
    }

    public draw() {
        const scale = this.getScale();
        const { width, height } = this.game.textures.player;
        this.sprite.set(this.x, this.y, width * scale, height * scale, (this.velocity.x / PLAYER_SPEED) * 25);
        this.sprite.draw();
        if (this.rocket) {
            this.rocket.draw();
        } else if (
            this.game.mode instanceof InfluencedMode &&
            (this.input.aimDirection.x || this.input.aimDirection.y)
        ) {
            this.drawPreviewRocket();
        }
    }

    private drawPreviewRocket() {
        let { x, y } = this.aimInfluence.get();
        const invLength = 1 / Math.sqrt(x ** 2 + y ** 2);
        x *= invLength;
        y *= invLength;
        const { width, height } = this.game.textures.rocket;
        const angle = xyToAngle(x, y);
        this.rocketSprite.set(
            this.x + x * ROCKET_PREVIEW_OFFSET,
            this.y + y * ROCKET_PREVIEW_OFFSET,
            width * ROCKET_PREVIEW_SCALE,
            height * ROCKET_PREVIEW_SCALE,
            angle
        );
        this.rocketSprite.draw();
    }

    public drawDebugProjected(rect: DebugRect) {
        if (this.rocket) {
            this.rocket.drawDebugProjected(rect);
        } else {
            const { x, y } = this.velocityInfluence.get();
            rect.set(this.x + x - PLAYER_SIZE, this.y + y - PLAYER_SIZE, PLAYER_SIZE * 2, PLAYER_SIZE * 2);
            rect.stroke(influencedModecolors.TARGET_PROJECTED);
        }
    }

    public drawDebugAim(rect: DebugRect) {
        if (!this.rocket) {
            const { x, y } = this.aimInfluence.get();
            rect.set(this.x + x - AIM_SIZE, this.y + y - AIM_SIZE, AIM_SIZE * 2, AIM_SIZE * 2);
            rect.stroke(influencedModecolors.TARGET_AIM);
        }
    }

    public getScale() {
        return 1 - this.spawnTime / SPAWN_TIME;
    }
}
