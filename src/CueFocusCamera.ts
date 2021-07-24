/* eslint-disable prefer-destructuring */
import { SmoothCamera } from "./SmoothCamera";

export interface CameraCue {
    x: number;
    y: number;
    innerRadius: number;
    outerRadius: number;
}

/**
 * A camera moving ahead of the player but gets attracted to a point of interest
 */
export class CueFocusCamera extends SmoothCamera {
    protected projectedX = 0;

    protected projectedY = 0;

    protected playerX = 0;

    protected playerY = 0;

    protected cue: CameraCue | null = null;

    public maxProjectionDistance: number;

    public constructor(maxProjectionDistance: number) {
        super();
        this.maxProjectionDistance = maxProjectionDistance;
    }

    public getProjectedX() {
        return this.projectedX;
    }

    public getProjectedY() {
        return this.projectedY;
    }

    protected setCue(cue: CameraCue | null) {
        this.cue = cue;
        this.calculateDestination();
    }

    public setPlayer(x: number, y: number, velX: number, velY: number) {
        this.playerX = x;
        this.playerY = y;
        if ((velX === 0 && velY === 0) || this.maxProjectionDistance <= 0) {
            this.projectedX = x;
            this.projectedY = y;
        } else {
            const distance = Math.sqrt(velX ** 2 + velY ** 2);
            if (distance > this.maxProjectionDistance) {
                const factor = this.maxProjectionDistance / distance;
                velX *= factor;
                velY *= factor;
            }
            this.projectedX = x + velX;
            this.projectedY = y + velY;
        }
        this.calculateDestination();
    }

    private calculateDestination() {
        if (!this.cue) {
            this.setDestination(this.projectedX, this.projectedY);
            return;
        }
        const { x, y, innerRadius, outerRadius } = this.cue;
        const dst = Math.sqrt((x - this.playerX) ** 2 + (y - this.playerY) ** 2);
        if (dst <= innerRadius) {
            // In the inner radius, the camera is fixed on the cue
            this.setDestination(x, y);
        } else if (dst < outerRadius) {
            // In the outer radius, the camera is drawn towards the cue
            const length = outerRadius - innerRadius;
            const pos = dst - innerRadius;
            const pct = 1 - pos / length;
            this.setDestination(
                (x - this.projectedX) * pct + this.projectedX,
                (y - this.projectedY) * pct + this.projectedY
            );
        } else {
            this.setDestination(this.projectedX, this.projectedY);
        }
    }
}
