import { Camera } from "./Camera";
import { AimInfluence } from "./AimInfluence";
import { Vector2 } from "./types";
import { ease, lerpVector, lerpScalar } from "./utils";

/**
 * A cue draws the InfluencedCamera towards a point if the camera is within the outerRadius.
 * If the camera is within the innerRadius, it will be fixed on the cue point.
 */
export interface InfluencedCameraCue extends Vector2 {
    /** The inner radius of this influence point. */
    innerRadius: number;
    /** The outer radius of this influence point. */
    outerRadius: number;
    /** The zoom value to multiply the camera zoom with when the camera is within outerRadius. */
    zoom: number;
}

interface CueConfig {
    cue: InfluencedCameraCue;
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
    protected savedZoom: number;

    protected readonly cueConfigs: CueConfig[] = [];

    protected target: InfluencedCameraTarget | null = null;

    protected offset: Vector2 = { x: 0, y: 0 };

    protected finalOffset: Vector2 = { x: 0, y: 0 };

    protected finalZoom = 1;

    /**
     * Create a new influenced camera.
     */
    public constructor() {
        super();
        this.savedZoom = this.zoom;
    }

    /**
     * @returns The offset that has been added in the case of a target switch.
     */
    public getOffset(): Readonly<Vector2> {
        return this.offset;
    }

    public override setZoom(zoom: number) {
        this.savedZoom = zoom;
    }

    public addCue(cue: InfluencedCameraCue) {
        this.cueConfigs.push({
            cue,
            fadeTime: 0,
            totalFadeTime: 0,
            influence: 1,
        });
        this.update(0);
    }

    public removeCue(cue: InfluencedCameraCue, fadeTime = 0) {
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
    }

    public getTarget() {
        return this.target;
    }

    protected updateInfluences() {
        if (!this.target) return;

        let zoom = 0;
        let maxFactor = 0;
        let factorSum = 0;
        let cueX = 0;
        let cueY = 0;

        for (const config of this.cueConfigs) {
            const { x, y } = config.cue;
            const dx = x - this.target.x;
            const dy = y - this.target.y;
            const dst = Math.sqrt(dx ** 2 + dy ** 2);
            if (dst < config.cue.outerRadius) {
                const { outerRadius, innerRadius } = config.cue;
                // In the outer radius, the camera is drawn towards the cue
                const length = outerRadius - innerRadius;
                const pos = dst - innerRadius;
                const factor = (pos <= 0 ? 1 : 1 - ease(pos / length)) * config.influence;

                factorSum += factor;
                if (factor > maxFactor) maxFactor = factor;

                cueX += dx * factor;
                cueY += dy * factor;

                zoom += (1 - config.cue.zoom) * factor;
            }
        }

        // Update offset
        lerpVector(this.offset, 0, 0);
        let { x, y } = this.offset;

        // Apply cue influence
        const cueInfluence = maxFactor / factorSum;
        if (cueInfluence) {
            x += cueX * cueInfluence;
            y += cueY * cueInfluence;
        }

        // Apply aim influence
        const { aims } = this.target;
        const aimInfluence = 1 - maxFactor;
        if (aims.length !== 0 && aimInfluence) {
            let aimOffsetX = 0;
            let aimOffsetY = 0;
            // fixme: improve this:
            for (const aim of aims) {
                // eslint-disable-next-line dot-notation
                aim["update"]();
                const aimFocus = aim.get();
                aimOffsetX += aimFocus.x;
                aimOffsetY += aimFocus.y;
            }

            const aimFactor = 1 / aims.length;
            x += aimOffsetX * aimFactor * aimInfluence;
            y += aimOffsetY * aimFactor * aimInfluence;
        } else {
            for (const aim of aims) {
                // eslint-disable-next-line dot-notation
                aim["update"]();
            }
        }

        this.finalOffset.x = x;
        this.finalOffset.y = y;
        this.finalZoom = this.savedZoom * this.target.zoom * (cueInfluence ? 1 - zoom * cueInfluence : 1);
    }

    public update(deltaTime: number) {
        this.updateFadingCues(deltaTime);

        if (!this.target) {
            this.updateZoom(this.savedZoom);
            return;
        }

        this.updateInfluences();

        this.updateZoom(this.finalZoom);
        this.setPosition(this.target.x + this.finalOffset.x, this.target.y + this.finalOffset.y);
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
        this.setPosition(this.x, this.y);
    }

    public override moveTo() {
        throw new Error("moveTo is not supported on InfluencedCamera at this time.");
    }
}
