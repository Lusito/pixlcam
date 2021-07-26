/* eslint-disable prefer-destructuring */
// prettier-ignore
export type Matrix4 = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number
];

const createMatrix4 = (): Matrix4 => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function snapToPixel(value: number, viewportSize: number) {
    if (viewportSize % 2 === 0) return Math.round(value);
    return Math.round(value + 0.5) - 0.5;
}

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
            // fixme: adjust for zoom. What if zoom is not a power of 2
            this.modelView[12] = -snapToPixel(this.x, this.viewportWidth);
            this.modelView[13] = snapToPixel(this.y, this.viewportHeight);
        } else {
            this.modelView[12] = -this.x;
            this.modelView[13] = this.y;
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
