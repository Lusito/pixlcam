/* eslint-disable */

import { BOUND_DISTANCE, PLAYER_SPEED, WORLD_HEIGHT, WORLD_WIDTH } from "./constants";

type Keys = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

export class Player {
    public x = WORLD_WIDTH / 2;
    public y = WORLD_HEIGHT / 2;
    public velX = 0;
    public velY = 0;

    private readonly keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
    };

    public constructor() {
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
        let moveX = 0;
        let moveY = 0;
        if (this.keys.ArrowRight) moveX += 1;
        if (this.keys.ArrowLeft) moveX -= 1;
        if (this.keys.ArrowUp) moveY -= 1;
        if (this.keys.ArrowDown) moveY += 1;

        if (moveX || moveY) {
            const f = PLAYER_SPEED / Math.sqrt(moveX ** 2 + moveY ** 2);
            this.velX = moveX * f;
            this.velY = moveY * f;
        } else {
            this.velX = 0;
            this.velY = 0;
        }

        this.x = Math.max(BOUND_DISTANCE, Math.min(WORLD_WIDTH - BOUND_DISTANCE, this.x + this.velX * deltaTime));
        this.y = Math.max(BOUND_DISTANCE, Math.min(WORLD_HEIGHT - BOUND_DISTANCE, this.y + this.velY * deltaTime));
    }
}
