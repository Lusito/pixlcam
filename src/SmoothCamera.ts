/* eslint-disable prefer-destructuring */
import { Camera } from "./Camera";

function restrictToBounds(input: number, min: number, max: number, viewportSize: number) {
    if (max - min <= viewportSize) return min + (max - min) / 2;

    min += viewportSize / 2;
    if (input < min) return min;

    max -= viewportSize / 2;
    if (input > max) return max;

    return input;
}

export interface CameraBounds {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
}

/**
 * A camera that smoothly follows a point and can optionally be restricted to be contained within bounds.
 */
export class SmoothCamera extends Camera {
    // The destination is where the camera wants to be, but might not have been moved to yet.
    protected destinationX = 0;

    protected destinationY = 0;

    protected bounds: CameraBounds | null = null;

    private speed = 0;

    public maxSpeed = 900;

    public slowDistance = 200;

    public lockDistance = 1;

    public acceleration = 10;

    public getDestinationX() {
        return this.destinationX;
    }

    public getDestinationY() {
        return this.destinationY;
    }

    public update(deltaTime: number) {
        const moveX = this.destinationX - this.x;
        const moveY = this.destinationY - this.y;

        const distance = Math.sqrt(moveX ** 2 + moveY ** 2);
        if (distance === 0) return;

        if (distance < this.slowDistance) {
            const pct = distance / this.slowDistance;
            this.speed = Math.max(0.1, pct) * this.maxSpeed;
            const f = (deltaTime * this.speed) / distance;
            const dx = moveX * f;
            const dy = moveY * f;
            const moveDistance = Math.sqrt(dx ** 2 + dy ** 2);
            if (distance - moveDistance <= this.lockDistance) {
                this.speed = 0;
                this.moveTo(this.destinationX, this.destinationY);
            } else {
                this.moveTo(this.x + dx, this.y + dy);
            }
        } else {
            if (this.speed < this.maxSpeed)
                this.speed = Math.min(this.maxSpeed, this.speed + this.maxSpeed * this.acceleration * deltaTime);
            const lerp = (deltaTime * this.speed) / distance;
            this.moveTo(this.x + moveX * lerp, this.y + moveY * lerp);
        }
    }

    public updateForced() {
        this.moveTo(this.destinationX, this.destinationY);
    }

    public setDestination(x: number, y: number) {
        this.destinationX = x;
        this.destinationY = y;
        this.applyBounds();
    }

    public override resize(width: number, height: number) {
        super.resize(width, height);
        this.applyBounds();
    }

    protected applyBounds() {
        if (this.bounds) {
            const { xMin, xMax, yMin, yMax } = this.bounds;
            this.destinationX = restrictToBounds(this.destinationX, xMin, xMax, this.viewportWidth / this.zoom);
            this.destinationY = restrictToBounds(this.destinationY, yMin, yMax, this.viewportHeight / this.zoom);
        }
    }

    public setBounds(bounds: CameraBounds | null) {
        this.bounds = bounds;
        this.applyBounds();
    }
}
