import { Matrix4, Vector2 } from "./types";

/** @returns A new 4x4 matrix initialized with 0. */
export const createMatrix4 = (): Matrix4 => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

/**
 * An easing function used to smoothen camera movement.
 * @param t A value between 0 and 1.
 * @returns A value between 0 and 1.
 */
export const ease = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * Linear interpolation between 2 values.
 * @param start The value to start from.
 * @param end The value to move towards.
 * @param lerpFactor The percentage amount to move. A value between 0 and 1.
 * @param lock If the distance between from and to is smaller than lock, the return value will snap to end.
 * @returns The start value moved with lerpFactor towards the end value.
 */
export function lerpScalar(start: number, end: number, lerpFactor = 0.1, lock = 0.001) {
    const len = end - start;
    if (len < lock) return end;
    return start + len * lerpFactor;
}

/**
 * Linear interpolation between 2 points.
 * Moves the input point with lerpFactor towards the end point value.
 * @param point The point to move.
 * @param endX The x value to move towards.
 * @param endY The y value to move towards.
 * @param lerpFactor The percentage amount to move. A value between 0 and 1.
 * @param lock If the distance between from and to is smaller than lock, the return value will snap to end.
 */
export function lerpVector(point: Vector2, endX: number, endY: number, lerpFactor = 0.1, lock = 0.001) {
    const dx = endX - point.x;
    const dy = endY - point.y;
    const len = Math.sqrt(dx ** 2 + dy ** 2);
    if (len < lock) {
        point.x = endX;
        point.y = endY;
    } else {
        point.x += dx * lerpFactor;
        point.y += dy * lerpFactor;
    }
}

/**
 * Restrict a camera position to be contained within the specified bounds according to its viewport size.
 * If the width of the bounds is smaller than the viewportSize, the center will be returned.
 * @param input The value to restrict.
 * @param min The minimum value of the bound.
 * @param max The maximum value of the bound.
 * @param viewportSize The size of the viewport. Min and max will be reduced by half of this value.
 * @returns The restricted value.
 */
export function restrictToBounds(input: number, min: number, max: number, viewportSize: number) {
    const width = max - min;
    if (width <= viewportSize) return min + width * 0.5;

    min += viewportSize * 0.5;
    if (input < min) return min;

    max -= viewportSize * 0.5;
    if (input > max) return max;

    return input;
}

/**
 * Snap a value to a pixel depending on viewport size and zoom level.
 * If viewport size is divisible by 2, the zoomed value will be snapped to integers.
 * Otherwise the zoomed value will be snapped to .5 values instead.
 * @param value The value to snap.
 * @param viewportSize The viewport size.
 * @param zoom The zoom level of the camera.
 * @returns The adjusted value.
 */
export function snapToPixel(value: number, viewportSize: number, zoom: number) {
    // fixme: does this really matter?
    const zoomed = value * zoom;
    const val = viewportSize % 2 === 0 ? Math.round(zoomed) : Math.round(zoomed + 0.5) - 0.5;
    return val / zoom;
}
