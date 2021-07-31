export interface Vector2 {
    x: number;
    y: number;
}

// prettier-ignore
export type Matrix4 = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number
];

export interface CameraBounds {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
}
