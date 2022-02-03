/* eslint-disable */

import { Vector2 } from "../src";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
ctx.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);

type Dot = Vector2 & { color: string };
type Cue = Dot & { factor: number };

const dot = (x: number, y: number, color: string): Dot => ({ x, y, color });
const cue = (x: number, y: number, color: string, factor: number): Cue => ({ x, y, color, factor });

function drawCircle(center: Vector2, radius: number, color: string, fill?: boolean): void {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
    if (fill) {
        ctx.fillStyle = color;
        ctx.fill();
    }
    ctx.strokeStyle = color;
    ctx.stroke();
}

const drawDot = (center: Dot) => drawCircle(center, 2, center.color, true);

function dist(p1: Vector2, p2: Vector2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

const player = dot(20, 40, "black");
const cue1 = cue(200, 0, "green", 1);
const cue2 = cue(0, 200, "blue", 1);
const cue3 = cue(0, -200, "gray", 0.1);
const draggables = [cue1, cue2, cue3];

function update() {
    const cues = [cue1, cue2, cue3];

    const out = dot(0, 0, "red");
    let outFactor = 0;
    for (const c of cues) {
        out.x += (c.x - player.x) * c.factor;
        out.y += (c.y - player.y) * c.factor;
        outFactor += c.factor;
    }
    let maxPct = 0;
    for (const c of cues) {
        const pct = c.factor / outFactor;
        if (pct > maxPct) maxPct = pct;
    }
    out.x *= maxPct;
    out.y *= maxPct;
    out.x += player.x;
    out.y += player.y;

    const dots = [player, cue1, cue2, cue3, out];

    ctx.clearRect(-ctx.canvas.width * 0.5, -ctx.canvas.height * 0.5, ctx.canvas.width, ctx.canvas.height);
    dots.forEach(drawDot);
}
update();

const mousePoint = dot(0, 0, "white");
function updateMousePoint(e: MouseEvent, dest: Vector2) {
    dest.x = e.clientX - canvas.clientWidth / 2;
    dest.y = e.clientY - canvas.clientHeight / 2;
}

let dragging: Dot | null = null;
window.addEventListener("mousedown", (e) => {
    updateMousePoint(e, mousePoint);
    dragging = null;
    for (const draggable of draggables) {
        if (dist(draggable, mousePoint) < 5) {
            dragging = draggable;
            return;
        }
    }
});
window.addEventListener("mouseup", (e) => {
    dragging = null;
});

window.addEventListener("mousemove", (e) => {
    if (dragging) {
        updateMousePoint(e, dragging);
        // const f = 200 / vecLength(dragging);
        // dragging.x *= f;
        // dragging.y *= f;
        update();
    }
});
