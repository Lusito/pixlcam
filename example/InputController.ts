import { Vector2 } from "../src";
import type { Player } from "./Player";

type Keys = keyof InputController["keys"];

function getDirection(out: Vector2, up: boolean, right: boolean, down: boolean, left: boolean) {
    let dx = 0;
    let dy = 0;
    if (right) dx += 1;
    if (left) dx -= 1;
    if (up) dy -= 1;
    if (down) dy += 1;
    if (dx || dy) {
        const f = 1 / Math.sqrt(dx ** 2 + dy ** 2);
        out.x = dx * f;
        out.y = dy * f;
    } else {
        out.x = 0;
        out.y = 0;
    }
}

export class InputController {
    public moveDirection: Vector2 = { x: 0, y: 0 };
    public aimDirection: Vector2 = { x: 0, y: 0 };
    private readonly keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        KeyW: false,
        KeyA: false,
        KeyS: false,
        KeyD: false,
        KeyT: false,
        Space: false,
    };

    private player: Player;

    public constructor(player: Player) {
        this.player = player;
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
        window.addEventListener("keydown", (e) => this.onKeyDown(e));
    }

    public onKeyDown(e: KeyboardEvent) {
        if (e.code in this.keys) {
            e.preventDefault();

            if (this.keys[e.code as Keys]) return;

            this.keys[e.code as Keys] = true;

            if (e.code === "KeyT") {
                this.player.teleport();
            } else if (e.code === "Space") {
                this.player.shootRocket();
            }
        }
    }

    public onKeyUp(e: KeyboardEvent) {
        if (e.code in this.keys) {
            e.preventDefault();
            this.keys[e.code as Keys] = false;
        }
    }

    public update() {
        getDirection(
            this.moveDirection,
            this.keys.ArrowUp,
            this.keys.ArrowRight,
            this.keys.ArrowDown,
            this.keys.ArrowLeft,
        );

        getDirection(this.aimDirection, this.keys.KeyW, this.keys.KeyD, this.keys.KeyS, this.keys.KeyA);
    }
}
