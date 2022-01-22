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

interface CueInfluenceConfig {
    cue: CueInfluence;
    influence: number;
    totalFadeTime: number;
    fadeTime: number;
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

interface Influence {
    factor: number;
    dx: number;
    dy: number;
    zoom: number;
}

/**
 * A camera being influenced by aiming directions (like velocity) and cues (points of interest).
 * Optionally it can be contained within specified bounds.
 */
export class InfluencedCamera extends Camera {
    protected bounds: CameraBounds | null = null;

    protected savedZoom: number;

    protected readonly cueConfigs: CueInfluenceConfig[] = [];

    protected target: InfluencedCameraTarget | null = null;

    protected offset: Vector2 = { x: 0, y: 0 };

    protected desired: Vector2 = { x: 0, y: 0 };

    private influences: Influence[] = [];

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
        this.cueConfigs.push({
            cue,
            fadeTime: 0,
            totalFadeTime: 0,
            influence: 1,
        });
        this.update(0);
    }

    public removeCue(cue: CueInfluence, fadeTime = 0) {
        if (fadeTime > 0) {
            const config = this.cueConfigs.find((v) => v.cue === cue);
            if (config && !config.totalFadeTime) {
                // Copy cue, so we can perform a fadeout
                config.cue = { ...cue };
                config.fadeTime = fadeTime;
                config.totalFadeTime = fadeTime;
            }
        } else {
            const index = this.cueConfigs.findIndex((v) => v.cue === cue);
            if (index >= 0) this.cueConfigs.splice(index, 1);
        }
    }

    public removeAllCues(fadeTime = 0) {
        if (fadeTime > 0) {
            for (const config of this.cueConfigs) {
                if (!config.totalFadeTime) {
                    // Copy cue, so we can perform a fadeout
                    config.cue = { ...config.cue };
                    config.fadeTime = fadeTime;
                    config.totalFadeTime = fadeTime;
                }
            }
        } else {
            this.cueConfigs.length = 0;
        }
    }

    public setTarget(target: InfluencedCameraTarget | null) {
        // Adjust offset, so we can smoothen the transition between the current and next target
        if (target && this.target) {
            this.offset.x += this.target.x - target.x;
            this.offset.y += this.target.y - target.y;
        }
        this.target = target;
        this.update(0);
    }

    public getTarget() {
        return this.target;
    }

    // returns number of active influences
    protected updateInfluences() {
        if (!this.cueConfigs.length || !this.target) return 0;

        let numInfluences = 0;
        for (const config of this.cueConfigs) {
            const { x, y } = config.cue;
            const dx = x - this.target.x;
            const dy = y - this.target.y;
            const dst = Math.sqrt(dx ** 2 + dy ** 2);
            if (dst < config.cue.outerRadius) {
                const { outerRadius, innerRadius, zoom } = config.cue;
                // In the outer radius, the camera is drawn towards the cue
                const length = outerRadius - innerRadius;
                const pos = dst - innerRadius;
                const factor = (pos <= 0 ? 1 : 1 - ease(pos / length)) * config.influence;

                if (this.influences.length > numInfluences) {
                    const influence = this.influences[numInfluences];
                    influence.dx = dx;
                    influence.dy = dy;
                    influence.factor = factor;
                    influence.zoom = zoom;
                } else {
                    this.influences.push({ dx, dy, factor, zoom });
                }
                numInfluences++;
            }
        }

        return numInfluences;
    }

    public update(deltaTime: number) {
        this.updateFadingCues(deltaTime);

        if (!this.target) {
            this.updateZoom(this.savedZoom);
            return;
        }

        this.updateOffset(this.target.aims);
        const numInfluences = this.updateInfluences();

        const { x, y } = this.target;
        let zoom = this.savedZoom * this.target.zoom;

        if (numInfluences === 0) {
            this.updateZoom(zoom);
            // lerping to avoid the kamera jerking a bit when switching influence count
            lerpVector(this.desired, x, y);
            this.moveTo(this.desired.x + this.offset.x, this.desired.y + this.offset.y);
            return;
        }
        let factorSum = 0;
        for (let i = 0; i < numInfluences; i++) {
            const inf = this.influences[i];
            factorSum += inf.factor;
        }
        const aimInfluence = 1 - factorSum / numInfluences;

        let dx = x;
        let dy = y;
        for (let i = 0; i < numInfluences; i++) {
            const inf = this.influences[i];
            const f = inf.factor / factorSum;
            const factor = inf.factor * f;
            const maxZoom = zoom * inf.zoom;
            zoom += (maxZoom - zoom) * ease(factor);
            dx += inf.dx * factor;
            dy += inf.dy * factor;
        }

        // lerping to avoid the kamera jerking a bit when switching influence count
        lerpVector(this.desired, dx, dy);

        this.updateZoom(zoom);
        this.moveTo(this.desired.x + this.offset.x * aimInfluence, this.desired.y + this.offset.y * aimInfluence);
    }

    protected updateOffset(aims: AimInfluence[]) {
        let aimOffsetX = 0;
        let aimOffsetY = 0;
        let aimFactor = 0;
        if (aims.length !== 0) {
            for (const aim of aims) {
                const aimFocus = aim.get();
                aimOffsetX += aimFocus.x;
                aimOffsetY += aimFocus.y;
            }
            aimFactor = 1 / aims.length;
        }
        lerpVector(this.offset, aimOffsetX * aimFactor, aimOffsetY * aimFactor);
    }

    protected updateFadingCues(deltaTime: number) {
        for (let i = this.cueConfigs.length - 1; i >= 0; i--) {
            const config = this.cueConfigs[i];
            if (config.totalFadeTime) {
                config.fadeTime -= deltaTime;
                if (config.fadeTime <= 0) {
                    this.cueConfigs.splice(i, 1);
                } else {
                    config.influence = config.fadeTime / config.totalFadeTime;
                }
            }
        }
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
