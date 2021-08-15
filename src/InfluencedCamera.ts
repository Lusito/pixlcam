import { Camera } from "./Camera";
import { AimInfluence } from "./AimInfluence";
import { CameraBounds, Vector2 } from "./types";
import { ease, lerpVector, lerpScalar, restrictToBounds } from "./utils";

/**
 * A cue influence draws the InfluencedCamera towards a point if the camera is within the outerRadius.
 * If the camera is within the innerRadius, it will be fixed on the cue point.
 */
export interface CueInfluence extends Vector2 {
    /** The inner radius of this influence point. */
    innerRadius: number;
    /** The outer radius of this influence point. */
    outerRadius: number;
    /** The zoom value to multiply the camera zoom with when the camera is within outerRadius. */
    zoom: number;
}

/**
 * A target for the InfluencedCamera.
 * The target can influence the camera by specifying aim influences and a zoom value.
 */
export interface InfluencedCameraTarget extends Vector2 {
    /** The aim influences to apply on the camera. */
    aims: AimInfluence[];
    /** The zoom value to multiply the camera zoom with. */
    zoom: number;
}

/**
 * A camera being influenced by aiming directions (like velocity) and cues (points of interest).
 * Optionally it can be contained within specified bounds.
 */
export class InfluencedCamera extends Camera {
    protected bounds: CameraBounds | null = null;

    protected savedZoom: number;

    protected readonly cues: CueInfluence[] = [];

    protected target: InfluencedCameraTarget | null = null;

    protected offset: Vector2 = { x: 0, y: 0 };

    /**
     * Create a new influenced camera.
     */
    public constructor() {
        super();
        this.savedZoom = this.zoom;
    }

    public getOffset(): Readonly<Vector2> {
        return this.offset;
    }

    public override setZoom(zoom: number) {
        this.savedZoom = zoom;
    }

    public addCue(cue: CueInfluence) {
        this.cues.push(cue);
        this.update();
    }

    public removeCue(cue: CueInfluence) {
        const index = this.cues.indexOf(cue);
        if (index >= 0) this.cues.splice(index, 1);
    }

    public setTarget(target: InfluencedCameraTarget | null) {
        // Adjust offset, so we can smoothen the transition between the current and next target
        if (target && this.target) {
            this.offset.x += this.target.x - target.x;
            this.offset.y += this.target.y - target.y;
        }
        this.target = target;
        this.update();
    }

    public getTarget() {
        return this.target;
    }

    protected getClosestCue() {
        if (!this.cues.length || !this.target) return null;

        let closestCue: CueInfluence | null = null;
        let closestCueDistance = Number.POSITIVE_INFINITY;
        for (const cue of this.cues) {
            const { x, y } = cue;
            const dst = Math.sqrt((x - this.target.x) ** 2 + (y - this.target.y) ** 2) - cue.outerRadius;
            if (dst < closestCueDistance) {
                closestCue = cue;
                closestCueDistance = dst;
            }
        }
        return closestCue;
    }

    public update() {
        if (!this.target) return;

        const cue = this.getClosestCue();
        let { x, y } = this.target;
        let zoom = this.savedZoom * this.target.zoom;
        let aimInfluence = 1;
        if (cue) {
            const maxZoom = zoom * cue.zoom;
            const dst = Math.sqrt((cue.x - x) ** 2 + (cue.y - y) ** 2);
            if (dst <= cue.innerRadius) {
                // In the inner radius, the camera is fixed on the cue
                this.updateZoom(maxZoom);
                this.moveTo(cue.x, cue.y);
                return;
            }
            if (dst < cue.outerRadius) {
                // In the outer radius, the camera is drawn towards the cue
                const length = cue.outerRadius - cue.innerRadius;
                const pos = dst - cue.innerRadius;
                aimInfluence = ease(pos / length);
                const cueInfluence = 1 - aimInfluence;
                x += (cue.x - x) * cueInfluence;
                y += (cue.y - y) * cueInfluence;
                zoom += (maxZoom - zoom) * ease(cueInfluence);
            }
        }

        let aimOffsetX = 0;
        let aimOffsetY = 0;
        let aimFactor = 0;
        if (this.target.aims.length !== 0) {
            for (const aim of this.target.aims) {
                const aimFocus = aim.get();
                aimOffsetX += aimFocus.x;
                aimOffsetY += aimFocus.y;
            }
            aimFactor = 1 / this.target.aims.length;
        }
        lerpVector(this.offset, aimOffsetX * aimFactor, aimOffsetY * aimFactor);
        this.updateZoom(zoom);
        this.moveTo(x + this.offset.x * aimInfluence, y + this.offset.y * aimInfluence);
    }

    protected updateZoom(zoom: number) {
        zoom = lerpScalar(this.zoom, zoom); // fixme: allow configuring lerpFactor and lock?
        if (this.zoom !== zoom) super.setZoom(zoom);
    }

    public override resize(width: number, height: number) {
        super.resize(width, height);
        this.moveTo(this.x, this.y);
    }

    public override moveTo(x: number, y: number) {
        if (this.bounds) {
            const { xMin, xMax, yMin, yMax } = this.bounds;
            x = restrictToBounds(x, xMin, xMax, this.viewportWidth / this.zoom);
            y = restrictToBounds(y, yMin, yMax, this.viewportHeight / this.zoom);
        }
        super.moveTo(x, y);
    }

    public setBounds(bounds: CameraBounds | null) {
        this.bounds = bounds;
        this.moveTo(this.x, this.y);
    }
}
