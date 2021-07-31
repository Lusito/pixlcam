/* eslint-disable */

import { TargetInfluence, AimInfluence, Vector2 } from "../src";
import { lerp } from "../src/utils";
import { BOUND_DISTANCE, PLAYER_SPEED, WORLD_HEIGHT, WORLD_WIDTH } from "./constants";

type Keys = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

const SPAWN_TIME = 0.3;

export class Player implements TargetInfluence {
    public x = WORLD_WIDTH / 2;
    public y = WORLD_HEIGHT / 2;
    public velocity: Vector2 = { x: 0, y: 0 };
    public velocityAim = new AimInfluence(300, 0.2); // fixme: make the params configurable via ui
    public aims: AimInfluence[] = [];
    public spawnTime = SPAWN_TIME;

    private readonly keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
    };

    public constructor() {
        this.aims.push(this.velocityAim);
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
        // this.velocityAim.pushAverage();
        let moveX = 0;
        let moveY = 0;
        if (this.keys.ArrowRight) moveX += 1;
        if (this.keys.ArrowLeft) moveX -= 1;
        if (this.keys.ArrowUp) moveY -= 1;
        if (this.keys.ArrowDown) moveY += 1;

        let velX = 0;
        let velY = 0;
        if (moveX || moveY) {
            const f = PLAYER_SPEED / Math.sqrt(moveX ** 2 + moveY ** 2);
            velX = moveX * f;
            velY = moveY * f;
        }

        lerp(this.velocity, velX, velY);
        this.velocityAim.set(this.velocity.x, this.velocity.y);

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
