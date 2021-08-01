import { Vector2 } from "../src";
import { RAD_TO_DEG } from "./constants";

export function positiveNumListener(input: HTMLInputElement, callback: (value: number) => void) {
    input.addEventListener("input", () => {
        const value = parseFloat(input.value);
        if (value > 0) callback(value);
    });
}

export function vectorToAngle(dir: Vector2) {
    return xyToAngle(dir.x, dir.y);
}

export function xyToAngle(x: number, y: number) {
    if (x === 0 && y === 0) return 0;
    let angle = Math.atan2(x, -y) * RAD_TO_DEG;
    if (angle < 0.0) angle += 360.0;
    return angle;
}
