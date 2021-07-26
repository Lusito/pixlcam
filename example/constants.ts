/* eslint-disable */
import { Color } from "./debug/types";

export const SCREEN_WIDTH = 640;
export const SCREEN_HEIGHT = 480;

export const WORLD_WIDTH = 6500 / 2;
export const WORLD_HEIGHT = Math.round(2889 / 2);

export const PLAYER_SPEED = 400;
export const PLAYER_SIZE = 32;
export const BOUND_SIZE = 16;
export const BOUND_DISTANCE = BOUND_SIZE + PLAYER_SIZE;

function createColor(r: number, g: number, b: number): Color {
    return [r, g, b, 1];
}

export const colors = {
    GRID: createColor(1, 1, 1),
    BOUND: createColor(0.03, 0.4, 0.24),
    CAMERA_DESIRED: createColor(0, 1, 0),
    SLOW_DISTANCE: createColor(0.5, 1, 0.8),
    PLAYER: createColor(1, 1, 1),
    PLAYER_PROJECTED: createColor(0.5, 0.5, 1),
    CAMERA: createColor(1, 0, 0),
};
