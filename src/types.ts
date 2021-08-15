/** A 2D vector. */
export interface Vector2 {
    x: number;
    y: number;
}

// prettier-ignore
/** A 4x4 matrix. */
export type Matrix4 = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number
];

/** Limits for the camera to be kept inside. */
export interface CameraBounds {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
}
