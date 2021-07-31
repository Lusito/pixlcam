/* eslint-disable */
import { colors } from "./constants";
import { Color } from "./draw/types";
import type { Game } from "./Game";
import { ModeKey } from "./modes/AbstractMode";

const legend = document.getElementById("legend")!;

export class Sidebar {
    public readonly mode = document.getElementById("mode") as HTMLSelectElement;
    public readonly snapToPixel = document.getElementById("snapToPixel") as HTMLInputElement;
    public readonly zoom = document.getElementById("zoom") as HTMLInputElement;
    public readonly maxSpeed = document.getElementById("maxSpeed") as HTMLInputElement;
    public readonly acceleration = document.getElementById("acceleration") as HTMLInputElement;
    public readonly slowDistance = document.getElementById("slowDistance") as HTMLInputElement;
    public readonly lockDistance = document.getElementById("lockDistance") as HTMLInputElement;

    public readonly cameraCurrent: HTMLInputElement;
    public readonly cameraDesired: HTMLInputElement;
    public readonly cameraSlowDistance: HTMLInputElement;
    public readonly playerProjected: HTMLInputElement;
    public readonly cueInner: HTMLInputElement;
    public readonly cueOuter: HTMLInputElement;
    public readonly speed = document.getElementById("speed") as HTMLInputElement;
    public readonly currentZoom = document.getElementById("currentZoom") as HTMLInputElement;

    public constructor() {
        const sidebar = document.getElementById("sidebar");
        if (sidebar) {
            sidebar.addEventListener("keydown", (e) => e.stopImmediatePropagation());
            sidebar.addEventListener("keyup", (e) => e.stopImmediatePropagation());
            sidebar.addEventListener("keypress", (e) => e.stopImmediatePropagation());
        }

        this.cameraCurrent = this.addToLegend("＋ Camera Current", colors.CAMERA);
        this.cameraDesired = this.addToLegend("⨉ Camera Desired", colors.CAMERA_DESIRED);
        this.cameraSlowDistance = this.addToLegend("◯ Camera Slow Distance", colors.SLOW_DISTANCE);
        this.playerProjected = this.addToLegend("☐ Player Projected", colors.PLAYER_PROJECTED);
        this.cueInner = this.addToLegend("◯ Cue Inner Radius", colors.CUE_INNER);
        this.cueOuter = this.addToLegend("◯ Cue Outer Radius", colors.CUE_OUTER);
    }

    public setupUI(game: Game) {
        game.mode.onEnable();
        const { camera } = game.mode;
        this.snapToPixel.checked = camera.snapToPixel;
        this.zoom.value = camera.getZoom().toFixed(2);

        this.snapToPixel.addEventListener("input", () => {
            const { camera } = game.mode;
            camera.snapToPixel = this.snapToPixel.checked;
        });
        this.zoom.addEventListener("input", () => {
            const value = parseFloat(this.zoom.value);
            if (value > 0) game.mode.camera.setZoom(value);
        });
        this.mode.addEventListener("change", () => {
            game.setMode(this.mode.value as ModeKey);
        });
    }

    private addToLegend(label: string, color: Color, disabled?: boolean) {
        const element = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        element.appendChild(checkbox);
        if (disabled) checkbox.disabled = true;

        const span = document.createElement("span");
        span.textContent = label;
        const r = Math.round(color[0] * 255);
        const g = Math.round(color[1] * 255);
        const b = Math.round(color[2] * 255);
        const a = color[3].toFixed(2);
        span.style.color = `rgba(${r}, ${g}, ${b}, ${a})`;
        element.appendChild(span);

        legend.appendChild(element);
        return checkbox;
    }
}
