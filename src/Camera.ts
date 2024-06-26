/* eslint-disable prefer-destructuring */

import { CameraBounds } from "./types";
import { createMatrix4, restrictToBounds, snapToPixel } from "./utils";

/**
 * A simple 2D camera, which optionally snaps position values to pixels.
 */
export class Camera {
    protected x = 0;

    protected y = 0;

    protected bounds: CameraBounds | null = null;

    /** If set to true, the position will be snapped to pixels. */
    public snapToPixel = true;

    /** The projection matrix of this camera. Do not modify outside of camera code. */
    public readonly projection = createMatrix4();

    /** The model view matrix of this camera. Do not modify outside of camera code. */
    public readonly modelView = createMatrix4();

    protected zoom = 1;

    protected viewportWidth = 0;

    protected viewportHeight = 0;

    /** Creates a new camera object. */
    public constructor() {
        this.projection[10] = -1;
        this.projection[14] = -1;
        this.projection[15] = 1;
        this.modelView[0] = 1;
        this.modelView[5] = -1;
        this.modelView[10] = -1;
        this.modelView[15] = 1;
    }

    /** @returns The current x position of the camera (before snapping to pixels). */
    public getX() {
        return this.x;
    }

    /** @returns The current y position of the camera (before snapping to pixels). */
    public getY() {
        return this.y;
    }

    /** @returns The zoom value of the camera. */
    public getZoom() {
        return this.zoom;
    }

    /** @returns The current viewport width. */
    public getViewportWidth() {
        return this.viewportWidth;
    }

    /** @returns The current viewport height. */
    public getViewportHeight() {
        return this.viewportHeight;
    }

    /**
     * Set the zoom value and update the projection matrix accordingly.
     * @param zoom The new zoom value.
     */
    public setZoom(zoom: number) {
        this.zoom = zoom;
        this.updateProjection();
    }

    /**
     * Set the camera to the specified coordinates and apply pixel snapping if configured.
     * @param x The new x position of the camera.
     * @param y The new y position of the camera.
     */
    protected setPosition(x: number, y: number) {
        if (this.bounds) {
            const { xMin, xMax, yMin, yMax } = this.bounds;
            x = restrictToBounds(x, xMin, xMax, this.viewportWidth / this.zoom);
            y = restrictToBounds(y, yMin, yMax, this.viewportHeight / this.zoom);
        }

        this.x = x;
        this.y = y;

        if (this.snapToPixel) {
            this.modelView[12] = -snapToPixel(x, this.viewportWidth, this.zoom);
            this.modelView[13] = snapToPixel(y, this.viewportHeight, this.zoom);
        } else {
            this.modelView[12] = -x;
            this.modelView[13] = y;
        }
    }

    /**
     * Move the camera to the specified coordinates and apply pixel snapping if configured.
     * @param x The new x position of the camera.
     * @param y The new y position of the camera.
     */
    public moveTo(x: number, y: number) {
        this.setPosition(x, y);
    }

    /**
     * Set the new viewport size of the camera.
     * @param width The new width of the viewport.
     * @param height The new height of the viewport.
     */
    public resize(width: number, height: number) {
        this.viewportWidth = width;
        this.viewportHeight = height;
        this.updateProjection();
    }

    /** Update the projection matrix to adjust for new viewport size or zoom value. */
    protected updateProjection() {
        this.projection[0] = (2 * this.zoom) / this.viewportWidth;
        this.projection[5] = (2 * this.zoom) / this.viewportHeight;
    }

    /**
     * Set camera bounds.
     * @param bounds The new bounds or null to remove the current bounds.
     */
    public setBounds(bounds: CameraBounds | null) {
        this.bounds = bounds;
        this.setPosition(this.x, this.y);
    }

    /** @returns The current camera bounds or null. */
    public getBounds() {
        return this.bounds;
    }
}
