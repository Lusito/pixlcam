/* eslint-disable */
import { Color } from "./draw/types";

export const DEG_TO_RAD = Math.PI / 180;

export const SCREEN_WIDTH = 640;
export const SCREEN_HEIGHT = 480;

export const WORLD_WIDTH = 6500;
export const WORLD_HEIGHT = 2889;

export const PLAYER_SPEED = 800;
export const PLAYER_SIZE = 64;
export const BOUND_SIZE = 32;
export const BOUND_DISTANCE = BOUND_SIZE + PLAYER_SIZE;

function createColor(r: number, g: number, b: number): Color {
    return [r, g, b, 1];
}

export const colors = {
    BOUND: createColor(0.03, 0.4, 0.24),
    CAMERA_DESIRED: createColor(0, 1, 0),
    SLOW_DISTANCE: createColor(0.5, 1, 0.8),
    PLAYER_PROJECTED: createColor(0.95, 0.69, 0.77),
    CAMERA: createColor(1, 0, 0),
};
