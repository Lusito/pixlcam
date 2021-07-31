import { Matrix4, Vector2 } from "./types";

export const createMatrix4 = (): Matrix4 => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export const ease = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;

export function lerp(p: Vector2, x: number, y: number, lerpFactor = 0.1, lock = 0.001) {
    const dx = x - p.x;
    const dy = y - p.y;
    const len = Math.sqrt(dx ** 2 + dy ** 2);
    if (len < lock) {
        p.x = x;
        p.y = y;
    } else {
        p.x += dx * lerpFactor;
        p.y += dy * lerpFactor;
    }
}

export function restrictToBounds(input: number, min: number, max: number, viewportSize: number) {
    if (max - min <= viewportSize) return min + (max - min) / 2;

    min += viewportSize / 2;
    if (input < min) return min;

    max -= viewportSize / 2;
    if (input > max) return max;

    return input;
}

export function snapToPixel(value: number, viewportSize: number, zoom: number) {
    const zoomed = value * zoom;
    const val = viewportSize % 2 === 0 ? Math.round(zoomed) : Math.round(zoomed + 0.5) - 0.5;
    return val / zoom;
}
