import { AimInfluence } from "./AimInfluence";
import { Vector2 } from "./types";

export class AveragedAimInfluence extends AimInfluence {
    protected index = 0;
    protected readonly average: Vector2;
    protected readonly history: Vector2[];

    // fixme: params as options object for better readability
    public constructor(historySize: number, maxLength: number, factor = 1, x = 0, y = 0) {
        super(maxLength, factor, x, y);
        this.average = { x: this.current.x, y: this.current.y };
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
