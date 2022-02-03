import { Vector2 } from "./types";
import { lerpVector } from "./utils";

/**
 * Options to use for the aim influence.
 */
export interface AimInfluenceOptions {
    /** The maximum length this influence offset can have. */
    maxLength: number;
    /** The factor to multiply the influence offset by (before applying maxLength). Defaults to 1. */
    factor?: number;
    /** The percentage amount to move with each update. A value between 0 and 1. Defaults to 1. */
    lerpFactor?: number;
    /** The number of frames to remember to smoothen the camera movement. Defaults to 30. */
    averageMaxFrames?: number;
}

const epsilon = 0.001;

interface AimInfluenceAverage {
    index: number;
    frames: Vector2[];
    maxFrames: number;
    sum: Vector2;
}

/**
 * An aim influence draws the InfluencedCamera towards an offset.
 */
export class AimInfluence {
    protected readonly offset: Vector2 = { x: 0, y: 0 };
    protected readonly desiredOffset: Vector2 = { x: 0, y: 0 };
    protected average: AimInfluenceAverage;
    /** The maximum length this influence offset can have. */
    public maxLength: number;
    /** The factor to multiply the influence offset by (before applying maxLength). Defaults to 1. */
    public factor: number;
    /** The percentage amount to move with each update. A value between 0 and 1. */
    public lerpFactor: number;

    /**
     * Create a new aim influence.
     *
     * @param options The options to use.
     */
    public constructor(options: AimInfluenceOptions) {
        this.maxLength = options.maxLength;
        this.factor = options.factor ?? 1;
        this.lerpFactor = options.lerpFactor ?? 1;
        this.average = {
            index: 0,
            maxFrames: options.averageMaxFrames ?? 30,
            frames: [{ x: 0, y: 0 }],
            sum: { x: 0, y: 0 },
        };
    }

    /** @returns The current influence offset. */
    public get(): Readonly<Vector2> {
        return this.offset;
    }

    /**
     * Set the new influence offset.
     * Factor and maxLength will be applied.
     *
     * @param x The new x offset.
     * @param y The new y offset.
     */
    public set(x: number, y: number) {
        if (this.maxLength <= 0 || this.factor === 0) {
            x = 0;
            y = 0;
        } else {
            x *= this.factor;
            y *= this.factor;
            const len = Math.sqrt(x ** 2 + y ** 2);
            if (len < epsilon) {
                x = 0;
                y = 0;
            } else if (len > this.maxLength) {
                const f = this.maxLength / len;
                x *= f;
                y *= f;
            }
        }

        this.desiredOffset.x = x;
        this.desiredOffset.y = y;
    }

    /** Calculate the optimal offset. Called by InfluencedCamera. */
    protected update() {
        const { frames, maxFrames, sum } = this.average;
        let { x, y } = this.desiredOffset;
        sum.x += x;
        sum.y += y;
        if (frames.length < maxFrames) {
            frames.push({ x, y });
        } else {
            const frame = frames[this.average.index];
            sum.x -= frame.x;
            sum.y -= frame.y;
            frame.x = x;
            frame.y = y;
        }
        this.average.index = (this.average.index + 1) % maxFrames;
        x = sum.x / frames.length;
        y = sum.y / frames.length;

        if (this.lerpFactor === 1) {
            this.offset.x = x;
            this.offset.y = y;
        } else {
            lerpVector(this.offset, x, y, this.lerpFactor);
        }
    }
}
