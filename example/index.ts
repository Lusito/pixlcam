/* eslint-disable */
import { CameraCue, CueFocusCamera } from "../src";
import { BOUND_SIZE, colors, PLAYER_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH, WORLD_HEIGHT, WORLD_WIDTH } from "./constants";
import { DebugCircle } from "./debug/DebugCircle";
import { DebugGrid } from "./debug/DebugGrid";
import { DebugRect } from "./debug/DebugRect";
import { createDebugShader, DebugShader } from "./debug/DebugShader";
import { Player } from "./Player";
import { Sidebar } from "./Sidebar";

export class Game {
    private readonly gl: WebGLRenderingContext;
    private readonly debugShader: DebugShader;
    public readonly camera = new CueFocusCamera(150);
    private readonly player = new Player();
    private readonly circle: DebugCircle;
    private readonly grid: DebugGrid;
    private readonly boundRects: DebugRect[] = [];
    private readonly cueCircle: DebugCircle;
    private readonly cueInnerCircle: DebugCircle;
    private readonly cueOuterCircle: DebugCircle;
    private readonly cue: CameraCue = {
        x: WORLD_WIDTH / 2 + 250,
        y: WORLD_HEIGHT / 2 - 250,
        innerRadius: 150,
        outerRadius: 400,
    };
    private readonly sidebar: Sidebar;

    public constructor() {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.gl = canvas.getContext("webgl") as WebGLRenderingContext;
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE);
        this.gl.enable(this.gl.BLEND);
        this.camera.setCue(this.cue);

        this.debugShader = createDebugShader(this.gl);
        this.circle = new DebugCircle(this.gl, this.debugShader, 20);
        this.grid = new DebugGrid(this.gl, this.debugShader, 100).set(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.boundRects.push(new DebugRect(this.gl, this.debugShader).set(0, 0, BOUND_SIZE, WORLD_HEIGHT));
        this.boundRects.push(new DebugRect(this.gl, this.debugShader).set(0, 0, WORLD_WIDTH, BOUND_SIZE));
        this.boundRects.push(
            new DebugRect(this.gl, this.debugShader).set(WORLD_WIDTH - BOUND_SIZE, 0, BOUND_SIZE, WORLD_HEIGHT)
        );
        this.boundRects.push(
            new DebugRect(this.gl, this.debugShader).set(0, WORLD_HEIGHT - BOUND_SIZE, WORLD_WIDTH, BOUND_SIZE)
        );
        this.cueCircle = new DebugCircle(this.gl, this.debugShader, 20).set(this.cue.x, this.cue.y, 8);
        this.cueInnerCircle = new DebugCircle(this.gl, this.debugShader, 20).set(
            this.cue.x,
            this.cue.y,
            this.cue.innerRadius
        );
        this.cueOuterCircle = new DebugCircle(this.gl, this.debugShader, 20).set(
            this.cue.x,
            this.cue.y,
            this.cue.outerRadius
        );

        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_HEIGHT;
        this.gl.viewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.camera.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.camera.setBounds({
            xMin: 0,
            yMin: 0,
            xMax: WORLD_WIDTH,
            yMax: WORLD_HEIGHT,
        });
        const { x, y, velX, velY } = this.player;
        this.camera.setPlayer(x, y, velX, velY);
        this.camera.updateForced();

        this.sidebar = new Sidebar(this);
    }

    public update(deltaTime: number) {
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.player.update(deltaTime);
        const { x, y, velX, velY } = this.player;
        this.camera.setPlayer(x, y, velX, velY);
        this.camera.update(deltaTime);

        this.debugShader.use();
        this.debugShader.uMVMatrix.set(false, this.camera.modelView);
        this.debugShader.uPMatrix.set(false, this.camera.projection);
        this.grid.stroke(colors.GRID);

        // fixme: dedicated colors
        this.cueCircle.fill(colors.CAMERA);
        this.cueInnerCircle.stroke(colors.CAMERA_DESIRED);
        this.cueOuterCircle.stroke(colors.PLAYER_PROJECTED);

        if (this.sidebar.playerCurrent.checked) {
            this.circle.set(x, y, PLAYER_SIZE);
            this.circle.fill(colors.PLAYER);
        }

        if (this.sidebar.cameraDesired.checked) {
            this.circle.set(this.camera.getDesiredX(), this.camera.getDesiredY(), 8);
            this.circle.stroke(colors.CAMERA_DESIRED);
        }
        if (this.sidebar.cameraSlowDistance.checked) {
            this.circle.set(this.camera.getDesiredX(), this.camera.getDesiredY(), this.camera.slowDistance);
            this.circle.stroke(colors.SLOW_DISTANCE);
        }
        if (this.sidebar.playerProjectect.checked) {
            this.circle.set(this.camera.getProjectedX(), this.camera.getProjectedY(), PLAYER_SIZE);
            this.circle.stroke(colors.PLAYER_PROJECTED);
        }
        if (this.sidebar.cameraCurrent.checked) {
            this.circle.set(this.camera.getX(), this.camera.getY(), 5);
            this.circle.fill(colors.CAMERA);
        }
        for (const rect of this.boundRects) {
            rect.fill(colors.BOUND);
        }
    }
}

function init() {
    const game = new Game();

    let lastTime = 0;
    function render(time: number) {
        const deltaTime = (time - lastTime) / 1000;
        lastTime = time;

        game.update(deltaTime);

        window.requestAnimationFrame(render);
    }

    window.requestAnimationFrame(render);
}

init();
