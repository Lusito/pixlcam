/* eslint-disable */
import { colors } from "./constants";
import { Color } from "./draw/types";
import type { Game } from "./Game";
import { ModeKey } from "./modes/AbstractMode";
import { positiveNumListener } from "./utils";

const legend = document.getElementById("legend")!;

export function hideElement(element: HTMLElement) {
    element = element.closest("label") || element;
    element.style.display = "none";
}

export function showElement(element: HTMLElement) {
    element = element.closest("label") || element;
    element.style.display = "";
}

export class Sidebar {
    public readonly mode = document.getElementById("mode") as HTMLSelectElement;
    public readonly snapToPixel = document.getElementById("snapToPixel") as HTMLInputElement;
    public readonly zoom = document.getElementById("zoom") as HTMLInputElement;
    public readonly maxSpeed = document.getElementById("maxSpeed") as HTMLInputElement;
    public readonly acceleration = document.getElementById("acceleration") as HTMLInputElement;
    public readonly slowDistance = document.getElementById("slowDistance") as HTMLInputElement;
    public readonly lockDistance = document.getElementById("lockDistance") as HTMLInputElement;
    public readonly maxVelocityInfluence = document.getElementById("maxVelocityInfluence") as HTMLInputElement;
    public readonly velocityInfluenceFactor = document.getElementById("velocityInfluenceFactor") as HTMLInputElement;
    public readonly maxAimInfluence = document.getElementById("maxAimInfluence") as HTMLInputElement;
    public readonly aimInfluenceFactor = document.getElementById("aimInfluenceFactor") as HTMLInputElement;
    public readonly aimInfluenceLerp = document.getElementById("aimInfluenceLerp") as HTMLInputElement;
    public readonly debug = document.getElementById("debug") as HTMLInputElement;

    public readonly cameraCurrent: HTMLInputElement;
    public readonly cameraDesired: HTMLInputElement;
    public readonly combinedAimInfluence: HTMLInputElement;
    public readonly cameraSlowDistance: HTMLInputElement;
    public readonly targetProjected: HTMLInputElement;
    public readonly targetAim: HTMLInputElement;
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
        this.combinedAimInfluence = this.addToLegend("⨉ Combined Aim Influence", colors.CAMERA_DESIRED);
        this.cameraSlowDistance = this.addToLegend("◯ Camera Slow Distance", colors.SLOW_DISTANCE);
        this.targetProjected = this.addToLegend("☐ Target Projected", colors.TARGET_PROJECTED);
        this.targetAim = this.addToLegend("☐ Target Aim", colors.TARGET_AIM);
        this.cueInner = this.addToLegend("◯ Cue Inner Radius", colors.CUE_INNER);
        this.cueOuter = this.addToLegend("◯ Cue Outer Radius", colors.CUE_OUTER);
    }

    private hideAll() {
        hideElement(this.maxSpeed);
        hideElement(this.acceleration);
        hideElement(this.slowDistance);
        hideElement(this.lockDistance);
        hideElement(this.cameraDesired);
        hideElement(this.combinedAimInfluence);
        hideElement(this.cameraSlowDistance);
        hideElement(this.targetProjected);
        hideElement(this.targetAim);
        hideElement(this.cueInner);
        hideElement(this.cueOuter);
        hideElement(this.speed);
        hideElement(this.maxVelocityInfluence);
        hideElement(this.velocityInfluenceFactor);
        hideElement(this.maxAimInfluence);
        hideElement(this.aimInfluenceFactor);
        hideElement(this.aimInfluenceLerp);
    }

    public setupUI(game: Game) {
        this.hideAll();
        game.mode.onEnable();
        const { camera } = game.mode;
        this.snapToPixel.checked = camera.snapToPixel;
        this.zoom.value = camera.getZoom().toFixed(2);

        this.snapToPixel.addEventListener("input", () => {
            for (const key in game.modes) {
                const mode = game.modes[key as ModeKey];
                mode.camera.snapToPixel = this.snapToPixel.checked;
            }
        });
        positiveNumListener(this.zoom, (value) => {
            for (const key in game.modes) {
                const mode = game.modes[key as ModeKey];
                mode.camera.setZoom(value);
            }
        });
        this.mode.addEventListener("change", () => {
            this.hideAll();
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
