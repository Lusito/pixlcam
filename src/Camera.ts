/* eslint-disable prefer-destructuring */

import { createMatrix4, snapToPixel } from "./utils";

export class Camera {
    protected x = 0;

    protected y = 0;

    public snapToPixel = true;

    public readonly projection = createMatrix4();

    public readonly modelView = createMatrix4();

    protected zoom = 1;

    protected viewportWidth = 0;

    protected viewportHeight = 0;

    public constructor() {
        this.projection[10] = -1;
        this.projection[14] = -1;
        this.projection[15] = 1;
        this.modelView[0] = 1;
        this.modelView[5] = -1;
        this.modelView[10] = -1;
        this.modelView[15] = 1;
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    public getZoom() {
        return this.zoom;
    }

    public setZoom(zoom: number) {
        this.zoom = zoom;
        this.updateProjection();
    }

    public moveTo(x: number, y: number) {
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

    public resize(width: number, height: number) {
        this.viewportWidth = width;
        this.viewportHeight = height;
        this.updateProjection();
    }

    protected updateProjection() {
        this.projection[0] = (2 * this.zoom) / this.viewportWidth;
        this.projection[5] = (2 * this.zoom) / this.viewportHeight;
    }
}
