/* eslint-disable prefer-destructuring */
import { SmoothCamera } from "./SmoothCamera";

export interface CameraCue {
    x: number;
    y: number;
    innerRadius: number;
    outerRadius: number;
    zoom: number;
}

/**
 * A camera moving ahead of the player but gets attracted to a point of interest
 */
// fixme: don't use smoothcamera, as it moves independent of the player and can be slower than the player.
export class CueFocusCamera extends SmoothCamera {
    protected projectedX = 0;

    protected projectedY = 0;

    protected playerX = 0;

    protected playerY = 0;

    protected savedZoom: number;

    protected destinationZoom: number;

    protected readonly cues: CameraCue[] = [];

    public maxProjectionDistance: number;

    public constructor(maxProjectionDistance: number) {
        super();
        this.maxProjectionDistance = maxProjectionDistance;
        this.savedZoom = this.zoom;
        this.destinationZoom = this.zoom;
    }

    public override setZoom(zoom: number) {
        this.savedZoom = zoom;
        super.setZoom(zoom);
    }

    public getProjectedX() {
        return this.projectedX;
    }

    public getProjectedY() {
        return this.projectedY;
    }

    public addCue(cue: CameraCue) {
        this.cues.push(cue);
        this.calculateDesired();
    }

    public removeCue(cue: CameraCue) {
        const index = this.cues.indexOf(cue);
        if (index >= 0) this.cues.splice(index, 1);
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
        this.calculateDesired();
    }

    private getClosestCue() {
        if (!this.cues.length) return null;

        let closestCue: CameraCue | null = null;
        let closestCueDistance = Number.POSITIVE_INFINITY;
        for (const cue of this.cues) {
            const { x, y } = cue;
            const dst = Math.sqrt((x - this.playerX) ** 2 + (y - this.playerY) ** 2);
            if (dst < closestCueDistance) {
                closestCue = cue;
                closestCueDistance = dst;
            }
        }
        return closestCue;
    }

    private calculateDesired() {
        const cue = this.getClosestCue();
        if (cue) {
            const { x, y, innerRadius, outerRadius, zoom } = cue;
            const dst = Math.sqrt((x - this.playerX) ** 2 + (y - this.playerY) ** 2);
            if (dst <= innerRadius) {
                // In the inner radius, the camera is fixed on the cue
                this.setDesired(x, y);
                this.destinationZoom = this.savedZoom * zoom;
                return;
            }
            if (dst < outerRadius) {
                // In the outer radius, the camera is drawn towards the cue
                const length = outerRadius - innerRadius;
                const pos = dst - innerRadius;
                const pct = 1 - pos / length;
                this.setDesired(
                    (x - this.projectedX) * pct + this.projectedX,
                    (y - this.projectedY) * pct + this.projectedY
                );
                const maxZoom = this.savedZoom * zoom;
                this.destinationZoom = this.savedZoom + (maxZoom - this.savedZoom) * pct;
                return;
            }
        }
        this.destinationZoom = this.savedZoom;
        this.setDesired(this.projectedX, this.projectedY);
    }

    public override update(deltaTime: number) {
        super.update(deltaTime);

        const distance = this.destinationZoom - this.zoom;
        if (distance === 0) return;

        if (distance < 0.1) {
            this.zoom = this.destinationZoom;
        } else {
            // fixme: don't lerp, but rather ease in/out, since we know the start/end
            this.zoom += deltaTime * distance * 0.1;
        }
        this.updateProjection();
    }
}
