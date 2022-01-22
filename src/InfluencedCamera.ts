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

    // fixme: should take all relevant cues into account with a weight!
    protected getClosestCueConfig() {
        if (!this.cueConfigs.length || !this.target) return null;

        let closestCueConfig: CueInfluenceConfig | null = null;
        let closestCueDistance = Number.POSITIVE_INFINITY;
        for (const config of this.cueConfigs) {
            const { x, y } = config.cue;
            const dst = Math.sqrt((x - this.target.x) ** 2 + (y - this.target.y) ** 2) - config.cue.outerRadius;
            if (dst < closestCueDistance) {
                closestCueConfig = config;
                closestCueDistance = dst;
            }
        }
        return closestCueConfig;
    }

    public update(deltaTime: number) {
        this.updateFadingCues(deltaTime);

        if (!this.target) {
            this.updateZoom(this.zoom);
            return;
        }

        const cueConfig = this.getClosestCueConfig();
        let { x, y } = this.target;
        let zoom = this.savedZoom * this.target.zoom;
        let aimInfluence = 1;
        if (cueConfig) {
            const { cue, influence } = cueConfig;
            const cueZoom = 1 + (cue.zoom - 1) * influence;
            const maxZoom = zoom * cueZoom;
            const dst = Math.sqrt((cue.x - x) ** 2 + (cue.y - y) ** 2);
            if (dst <= cue.innerRadius && cueConfig.influence === 1) {
                // In the inner radius, the camera is fixed on the cue
                this.updateZoom(maxZoom);
                this.moveTo(cue.x, cue.y);
                return;
            }
            if (dst < cue.outerRadius) {
                // In the outer radius, the camera is drawn towards the cue
                const length = cue.outerRadius - cue.innerRadius;
                const pos = dst - cue.innerRadius;
                const cueInfluence = 1 - ease(pos / length) * influence;
                aimInfluence = cueInfluence - 1;
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
