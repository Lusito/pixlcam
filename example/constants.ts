/* eslint-disable */
import { Color } from "./draw/types";

export const DEG_TO_RAD = Math.PI / 180;

export const SCREEN_WIDTH = 640;
export const SCREEN_HEIGHT = 480;

export const WORLD_WIDTH = 6500;
export const WORLD_HEIGHT = 2889;

export const PLAYER_SPEED = 800;
export const PLAYER_SIZE = 64;
export const AIM_SIZE = 32;
export const BOUND_SIZE = 32;
export const BOUND_DISTANCE = BOUND_SIZE + PLAYER_SIZE;

function createColor(hex: string): Color {
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    return [r, g, b, 1];
}

export const colors = {
    BOUND: createColor("4444dd"),
    CAMERA: createColor("bb2222"),
    CAMERA_DESIRED: createColor("009900"),
    SLOW_DISTANCE: createColor("44dddd"),
    TARGET_PROJECTED: createColor("ffffff"),
    TARGET_AIM: createColor("44dddd"),

    CUE_INNER: createColor("ff66ff"),
    CUE_OUTER: createColor("bbbb22"),
};
