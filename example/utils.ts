export function positiveNumListener(input: HTMLInputElement, callback: (value: number) => void) {
    input.addEventListener("input", () => {
        const value = parseFloat(input.value);
        if (value > 0) callback(value);
    });
}
