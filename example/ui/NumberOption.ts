/* eslint-disable */

const options = document.getElementById("options")!;

export class NumberOption {
    private readonly label: HTMLLabelElement;
    private readonly input: HTMLInputElement;
    private readonly fractionDigits: number;

    public constructor(label: string, props: Partial<HTMLInputElement>, fractionDigits = 2) {
        this.label = document.createElement("label");
        this.fractionDigits = fractionDigits;

        const span = document.createElement("span");
        span.textContent = `${label}:`;
        this.label.appendChild(span);

        this.input = document.createElement("input");
        this.input.type = "number";
        for (const key of Object.keys(props)) {
            const value = props[key as keyof HTMLInputElement];
            if (value !== undefined) (this.input as any)[key] = value;
        }
        this.label.appendChild(this.input);

        options.appendChild(this.label);
        this.hide();
    }

    public get value() {
        return parseFloat(this.input.value);
    }

    public set value(value: number) {
        this.input.value = value.toFixed(this.fractionDigits);
    }

    public show() {
        this.label.style.display = "";
        return this;
    }

    public hide() {
        this.label.style.display = "none";
        return this;
    }

    public addListener(callback: (value: number) => void) {
        this.input.addEventListener("input", () => {
            const value = this.value;
            if (value > 0) callback(value);
        });
    }
}
