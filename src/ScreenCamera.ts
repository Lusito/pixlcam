import { Camera } from "./Camera";

/**
 * A fixed camera that is centered on the screen.
 * This can be used to draw UI (like a HUD for example).
 */
export class ScreenCamera extends Camera {
    public override resize(width: number, height: number) {
        super.resize(width, height);
        this.moveTo(width / 2, height / 2);
    }

    public override setZoom() {
        throw new Error("Zoom is not meant to be used on the screen camera (yet?).");
    }
}
