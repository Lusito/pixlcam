import { AimInfluence, AimInfluenceOptions } from "./AimInfluence";
import { Vector2 } from "./types";

export interface AveragedAimInfluenceOptions extends AimInfluenceOptions {
    historySize: number;
}

export class AveragedAimInfluence extends AimInfluence {
    protected index = 0;
    protected readonly average: Vector2;
    protected readonly history: Vector2[];

    public constructor(options: AveragedAimInfluenceOptions) {
        super(options);
        const { x, y } = this.current;
        this.average = { x, y };
        const { historySize } = options;
        this.history = Array.from({ length: historySize }, () => ({ x, y }));
    }

    public resetAverage() {
        const { x, y } = this.current;
        for (const p of this.history) {
            p.x = x;
            p.y = y;
        }
        this.average.x = x;
        this.average.y = y;
    }

    public updateAverage(): Readonly<Vector2> {
        const p = this.history[this.index];
        const { length } = this.history;
        this.average.x *= length;
        this.average.y *= length;
        this.average.x -= p.x;
        this.average.y -= p.y;
        p.x = this.current.x;
        p.y = this.current.y;
        this.average.x += p.x;
        this.average.y += p.y;
        this.average.x /= length;
        this.average.y /= length;
        this.index = (this.index + 1) % length;
        return this.average;
    }

    public override getFocus(): Readonly<Vector2> {
        return this.average;
    }
}
