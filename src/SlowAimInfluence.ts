import { AimInfluence, AimInfluenceOptions } from "./AimInfluence";
import { Vector2 } from "./types";
import { lerpVector } from "./utils";

export interface SlowAimInfluenceOptions extends AimInfluenceOptions {
    lerp: number;
}

export class SlowAimInfluence extends AimInfluence {
    protected readonly slowOffset: Vector2;
    public lerp: number;

    public constructor(options: SlowAimInfluenceOptions) {
        super(options);
        const { x, y } = this.offset;
        this.slowOffset = { x, y };
        this.lerp = options.lerp;
    }

    public override get(): Readonly<Vector2> {
        return this.slowOffset;
    }

    public update() {
        lerpVector(this.slowOffset, this.offset.x, this.offset.y, this.lerp);
    }
}
