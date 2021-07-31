/* eslint-disable */

import { TargetInfluence, AimInfluence, SlowAimInfluence, Vector2, lerp } from "../src";
import { BOUND_DISTANCE, PLAYER_SPEED, WORLD_HEIGHT, WORLD_WIDTH } from "./constants";

type Keys = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

const SPAWN_TIME = 0.3;

function getDirection(out: Vector2, up: boolean, right: boolean, down: boolean, left: boolean, length: number) {
    let dx = 0;
    let dy = 0;
    if (right) dx += 1;
    if (left) dx -= 1;
    if (up) dy -= 1;
    if (down) dy += 1;
    if (dx || dy) {
        const f = length / Math.sqrt(dx ** 2 + dy ** 2);
        out.x = dx * f;
        out.y = dy * f;
    } else {
        out.x = 0;
        out.y = 0;
    }
}

export class Player implements TargetInfluence {
    public x = WORLD_WIDTH / 2;
    public y = WORLD_HEIGHT / 2;
    public velocity: Vector2 = { x: 0, y: 0 };
    public velocityGoal: Vector2 = { x: 0, y: 0 };
    // fixme: make the params configurable via ui
    public velocityInfluence = new AimInfluence({ maxLength: 300, factor: 0.2 });
    public aimGoal: Vector2 = { x: 0, y: 0 };
    public aimInfluence = new SlowAimInfluence({ maxLength: 300, factor: 0.2, lerp: 0.2 });
    public aims: AimInfluence[] = [];
    public spawnTime = SPAWN_TIME;

    private readonly keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        KeyW: false,
        KeyA: false,
        KeyS: false,
        KeyD: false,
    };

    public constructor() {
        this.aims.push(this.velocityInfluence);
        this.aims.push(this.aimInfluence);
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("keypress", (e) => {
            if (e.code === "KeyT") {
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
        });
    }

    public onKeyDown(e: KeyboardEvent) {
        if (e.code in this.keys) this.keys[e.code as Keys] = true;
    }

    public onKeyUp(e: KeyboardEvent) {
        if (e.code in this.keys) this.keys[e.code as Keys] = false;
    }

    public update(deltaTime: number) {
        getDirection(
            this.velocityGoal,
            this.keys.ArrowUp,
            this.keys.ArrowRight,
            this.keys.ArrowDown,
            this.keys.ArrowLeft,
            PLAYER_SPEED
        );

        lerp(this.velocity, this.velocityGoal.x, this.velocityGoal.y);
        this.velocityInfluence.set(this.velocity.x, this.velocity.y);

        getDirection(this.aimGoal, this.keys.KeyW, this.keys.KeyD, this.keys.KeyS, this.keys.KeyA, PLAYER_SPEED);
        this.aimInfluence.set(this.aimGoal.x, this.aimGoal.y);
        this.aimInfluence.update();

        this.x = Math.max(BOUND_DISTANCE, Math.min(WORLD_WIDTH - BOUND_DISTANCE, this.x + this.velocity.x * deltaTime));
        this.y = Math.max(
            BOUND_DISTANCE,
            Math.min(WORLD_HEIGHT - BOUND_DISTANCE, this.y + this.velocity.y * deltaTime)
        );

        if (this.spawnTime > 0) this.spawnTime = Math.max(0, this.spawnTime - deltaTime);
    }

    public getSpawnPct() {
        return 1 - this.spawnTime / SPAWN_TIME;
    }
}
