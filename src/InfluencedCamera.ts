import { Camera } from "./Camera";
import { AimInfluence } from "./AimInfluence";
import { CameraBounds, Vector2 } from "./types";
import { ease, lerp, restrictToBounds } from "./utils";

export interface CueInfluence extends Vector2 {
    innerRadius: number;
    outerRadius: number;
    zoom: number;
}

export interface TargetInfluence extends Vector2 {
    aims: AimInfluence[];
    // fixme: zoom (instead of having zoom on the camera itself)
}

/**
 * A camera being influenced by aiming directions (like velocity) and cues (points of interest).
 * Optionally it can be contained within specified bounds.
 */
export class InfluencedCamera extends Camera {
    protected bounds: CameraBounds | null = null;

    protected savedZoom: number;

    protected readonly cues: CueInfluence[] = [];

    protected target: TargetInfluence | null = null;

    protected offset: Vector2 = { x: 0, y: 0 };

    public constructor() {
        super();
        this.savedZoom = this.zoom;
    }

    public getOffset(): Readonly<Vector2> {
        return this.offset;
    }

    public override setZoom(zoom: number) {
        this.savedZoom = zoom;
        super.setZoom(zoom);
    }

    public addCue(cue: CueInfluence) {
        this.cues.push(cue);
        this.update();
    }

    public removeCue(cue: CueInfluence) {
        const index = this.cues.indexOf(cue);
        if (index >= 0) this.cues.splice(index, 1);
    }

    public setTarget(target: TargetInfluence | null) {
        this.target = target;
        this.update();
    }

    private getClosestCue() {
        if (!this.cues.length || !this.target) return null;

        let closestCue: CueInfluence | null = null;
        let closestCueDistance = Number.POSITIVE_INFINITY;
        for (const cue of this.cues) {
            const { x, y } = cue;
            const dst = Math.sqrt((x - this.target.x) ** 2 + (y - this.target.y) ** 2);
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
        let zoom = this.savedZoom;
        let aimInfluence = 1;
        if (cue) {
            const dst = Math.sqrt((cue.x - x) ** 2 + (cue.y - y) ** 2);
            if (dst <= cue.innerRadius) {
                // In the inner radius, the camera is fixed on the cue
                this.updateZoom(this.savedZoom * cue.zoom);
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
                const maxZoom = this.savedZoom * cue.zoom;
                zoom = this.savedZoom + (maxZoom - this.savedZoom) * ease(cueInfluence);
            }
        }

        let aimOffsetX = 0;
        let aimOffsetY = 0;
        for (const aim of this.target.aims) {
            const aimFocus = aim.getFocus();
            aimOffsetX += aimFocus.x;
            aimOffsetY += aimFocus.y;
        }
        const aimFactor = aimInfluence / this.target.aims.length;
        lerp(this.offset, aimOffsetX * aimFactor, aimOffsetY * aimFactor);
        this.updateZoom(zoom);
        this.moveTo(x + this.offset.x * aimInfluence, y + this.offset.y * aimInfluence);
    }

    private updateZoom(zoom: number) {
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
