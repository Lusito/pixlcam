/* eslint-disable */
import { Color } from "./draw/types";

export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

export const SCREEN_WIDTH = 640;
export const SCREEN_HEIGHT = 480;

export const WORLD_WIDTH = 6500;
export const WORLD_HEIGHT = 2889;

export const ROCKET_SPEED = 1400;
export const ROCKET_SIZE = 32;
export const PLAYER_SPEED = 800;
export const PLAYER_SIZE = 64;
export const AIM_SIZE = 32;
export const BOUND_DISTANCE = PLAYER_SIZE;

function createColor(hex: string): Color {
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    return [r, g, b, 1];
}

export const namedColors = {
    RED: createColor("bb2222"),
    GREEN: createColor("009900"),
    CYAN: createColor("44dddd"),
    WHITE: createColor("ffffff"),
    PINK: createColor("ff66ff"),
    OLIVE: createColor("bbbb22"),
};
