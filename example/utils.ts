import { Vector2 } from "../src";
import { RAD_TO_DEG } from "./constants";

export function positiveNumListener(input: HTMLInputElement, callback: (value: number) => void) {
    input.addEventListener("input", () => {
        const value = parseFloat(input.value);
        if (value > 0) callback(value);
    });
}

export function vectorToAngle(dir: Vector2) {
    if (dir.x === 0 && dir.y === 0) return 0;
    let angle = Math.atan2(dir.x, -dir.y) * RAD_TO_DEG;
    if (angle < 0.0) angle += 360.0;
    return angle;
}
