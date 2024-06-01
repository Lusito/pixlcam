import { Camera } from "./Camera";
import { Vector2 } from "./types";

/**
 * A camera that smoothly follows a point.
 * Optionally it can be contained within specified bounds.
 */
export class FollowingCamera extends Camera {
    // This is where the camera wants to be, but might not have been moved to yet.
    protected desired: Vector2 = { x: 0, y: 0 };

    protected speed = 0;

    public maxSpeed = 900;

    public acceleration = 20;

    public slowDistance = 100;

    public lockDistance = 1;

    /** @returns The position where the camera wants to be. */
    public getDesired(): Readonly<Vector2> {
        return this.desired;
    }

    /** @returns The current (calculated) camera speed. */
    public getSpeed() {
        return this.speed;
    }

    /**
     * Perform camera movement.
     * @param deltaTime The time that elapsed since the last frame.
     */
    public update(deltaTime: number) {
        const moveX = this.desired.x - this.x;
        const moveY = this.desired.y - this.y;

        const distance = Math.sqrt(moveX ** 2 + moveY ** 2);
        if (distance === 0) return;

        // fixme: this doesn't work as expected, but still feels good
        if (distance < this.slowDistance) {
            const pct = distance / this.slowDistance;
            this.speed = Math.max(0.1, pct) * this.maxSpeed;
            const f = (deltaTime * this.speed) / distance;
            const dx = moveX * f;
            const dy = moveY * f;
            const moveDistance = Math.sqrt(dx ** 2 + dy ** 2);
            if (distance - moveDistance <= this.lockDistance) {
                this.speed = 0;
                this.setPosition(this.desired.x, this.desired.y);
            } else {
                this.setPosition(this.x + dx, this.y + dy);
            }
        } else {
            if (this.speed < this.maxSpeed)
                this.speed = Math.min(this.maxSpeed, this.speed + this.maxSpeed * this.acceleration * deltaTime);
            const lerp = (deltaTime * this.speed) / distance;
            this.setPosition(this.x + moveX * lerp, this.y + moveY * lerp);
        }
    }

    /** Make the camera move instantly to the desired position instead of gradually moving it. */
    public moveInstantly() {
        this.setPosition(this.desired.x, this.desired.y);
    }

    public override moveTo(x: number, y: number) {
        this.desired.x = x;
        this.desired.y = y;
    }

    public override resize(width: number, height: number) {
        super.resize(width, height);
        this.setPosition(this.desired.x, this.desired.y);
    }
}
