import { Color } from "../draw/types";

const legend = document.getElementById("legend")!;

export class DebugCheckbox {
    private readonly label: HTMLLabelElement;
    private readonly checkbox: HTMLInputElement;

    public constructor(label: string, color?: Color) {
        this.label = document.createElement("label");

        this.checkbox = document.createElement("input");
        this.checkbox.type = "checkbox";
        this.checkbox.checked = true;
        this.label.appendChild(this.checkbox);

        const span = document.createElement("span");
        span.textContent = label;
        if (color) {
            const r = Math.round(color[0] * 255);
            const g = Math.round(color[1] * 255);
            const b = Math.round(color[2] * 255);
            const a = color[3].toFixed(2);
            span.style.color = `rgba(${r}, ${g}, ${b}, ${a})`;
        }
        this.label.appendChild(span);

        legend.appendChild(this.label);
        this.hide();
    }

    public get checked() {
        return this.checkbox.checked;
    }

    public set checked(value: boolean) {
        this.checkbox.checked = value;
    }

    public show() {
        this.label.style.display = "";
        return this;
    }

    public hide() {
        this.label.style.display = "none";
        return this;
    }
}
