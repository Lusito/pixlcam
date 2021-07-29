/* eslint-disable */
import { colors } from "./constants";
import { Color } from "./draw/types";
import type { Game } from "./Game";

const legend = document.getElementById("legend")!;

export class Sidebar {
    private readonly game: Game;
    private readonly cameraType = document.getElementById("cameraType") as HTMLSelectElement;
    private readonly snapToPixel = document.getElementById("snapToPixel") as HTMLInputElement;
    private readonly zoom = document.getElementById("zoom") as HTMLInputElement;
    private readonly maxSpeed = document.getElementById("maxSpeed") as HTMLInputElement;
    private readonly acceleration = document.getElementById("acceleration") as HTMLInputElement;
    private readonly slowDistance = document.getElementById("slowDistance") as HTMLInputElement;
    private readonly lockDistance = document.getElementById("lockDistance") as HTMLInputElement;
    private readonly maxProjectionDistance = document.getElementById("maxProjectionDistance") as HTMLInputElement;

    public readonly cameraCurrent: HTMLInputElement;
    public readonly cameraDesired: HTMLInputElement;
    public readonly cameraSlowDistance: HTMLInputElement;
    public readonly playerProjected: HTMLInputElement;
    public readonly cueInner: HTMLInputElement;
    public readonly cueOuter: HTMLInputElement;

    public constructor(game: Game) {
        this.game = game;
        this.setupUI();

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

    private setupUI() {
        const { camera } = this.game;
        this.snapToPixel.checked = camera.snapToPixel;
        this.zoom.value = camera.getZoom().toFixed(2);
        this.maxSpeed.value = camera.maxSpeed.toFixed(2);
        this.acceleration.value = camera.acceleration.toFixed(2);
        this.slowDistance.value = camera.slowDistance.toFixed(2);
        this.lockDistance.value = camera.lockDistance.toFixed(2);
        this.maxProjectionDistance.value = camera.maxProjectionDistance.toFixed(2);

        this.snapToPixel.addEventListener("input", () => {
            this.game.camera.snapToPixel = this.snapToPixel.checked;
        });
        this.zoom.addEventListener("input", () => {
            const value = parseFloat(this.zoom.value);
            if (value > 0) this.game.camera.setZoom(value);
        });
        this.maxSpeed.addEventListener("input", () => {
            const value = parseFloat(this.maxSpeed.value);
            if (value > 0) this.game.camera.maxSpeed = value;
        });
        this.acceleration.addEventListener("input", () => {
            const value = parseFloat(this.acceleration.value);
            if (value > 0) this.game.camera.acceleration = value;
        });
        this.slowDistance.addEventListener("input", () => {
            const value = parseFloat(this.slowDistance.value);
            if (value >= 0) this.game.camera.slowDistance = value;
        });
        this.lockDistance.addEventListener("input", () => {
            const value = parseFloat(this.lockDistance.value);
            if (value >= 0) this.game.camera.lockDistance = value;
        });
        this.maxProjectionDistance.addEventListener("input", () => {
            const value = parseFloat(this.maxProjectionDistance.value);
            if (value >= 0) this.game.camera.maxProjectionDistance = value;
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
