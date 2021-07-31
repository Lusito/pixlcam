import { Vector2 } from "./types";

export interface AimInfluenceOptions {
    maxLength: number;
    factor?: number;
    x?: number;
    y?: number;
}

export class AimInfluence {
    protected readonly offset: Vector2 = { x: 0, y: 0 };
    public maxLength: number;
    public factor: number;

    public constructor({ maxLength, factor = 1, x = 0, y = 0 }: AimInfluenceOptions) {
        this.maxLength = maxLength;
        this.factor = factor;
        this.set(x, y);
    }

    public get(): Readonly<Vector2> {
        return this.offset;
    }

    public set(x: number, y: number) {
        if (this.maxLength <= 0 || this.factor === 0) {
            this.offset.x = 0;
            this.offset.y = 0;
        } else {
            x *= this.factor;
            y *= this.factor;
            const len = Math.sqrt(x ** 2 + y ** 2);
            if (len < 0.001) {
                this.offset.x = 0;
                this.offset.y = 0;
            } else {
                if (len > this.maxLength) {
                    const f = this.maxLength / len;
                    x *= f;
                    y *= f;
                }
                this.offset.x = x;
                this.offset.y = y;
            }
        }
    }
}
