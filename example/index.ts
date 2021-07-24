/* eslint-disable */
import { CueFocusCamera } from "../src";
import { DebugCircle } from "./debug/DebugCircle";
import { DebugGrid } from "./debug/DebugGrid";
import { createDebugShader, DebugShader } from "./debug/DebugShader";

const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 480;

const WORLD_WIDTH = 1920;
const WORLD_HEIGHT = 1080;

const PLAYER_SPEED = 200;
const PLAYER_SIZE = 32;

const GRID_COLOR: [number, number, number, number] = [1, 1, 1, 1];
const DESTINATION_COLOR: [number, number, number, number] = [0, 1, 0, 1];
const PLAYER_COLOR: [number, number, number, number] = [0, 1, 1, 1];
const PROJECTED_COLOR: [number, number, number, number] = [0.5, 0.5, 1, 1];
const CAMERA_COLOR: [number, number, number, number] = [1, 0, 0, 1];

type Keys = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

class Player {
    public x = WORLD_WIDTH / 2;
    public y = WORLD_HEIGHT / 2;
    public velX = 0;
    public velY = 0;

    private readonly keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
    };

    public constructor() {
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
        window.addEventListener("keydown", (e) => this.onKeyDown(e));
    }

    public onKeyDown(e: KeyboardEvent) {
        if (e.code in this.keys) this.keys[e.code as Keys] = true;
    }

    public onKeyUp(e: KeyboardEvent) {
        if (e.code in this.keys) this.keys[e.code as Keys] = false;
    }

    public update(deltaTime: number) {
        let moveX = 0;
        let moveY = 0;
        if (this.keys.ArrowRight) moveX += 1;
        if (this.keys.ArrowLeft) moveX -= 1;
        if (this.keys.ArrowUp) moveY -= 1;
        if (this.keys.ArrowDown) moveY += 1;

        if (moveX || moveY) {
            const f = PLAYER_SPEED / Math.sqrt(moveX ** 2 + moveY ** 2);
            this.velX = moveX * f;
            this.velY = moveY * f;
        } else {
            this.velX = 0;
            this.velY = 0;
        }

        this.x = Math.max(PLAYER_SIZE, Math.min(WORLD_WIDTH - PLAYER_SIZE, this.x + this.velX * deltaTime));
        this.y = Math.max(PLAYER_SIZE, Math.min(WORLD_HEIGHT - PLAYER_SIZE, this.y + this.velY * deltaTime));
    }
}

class Game {
    private gl: WebGLRenderingContext;
    private debugShader: DebugShader;
    private camera = new CueFocusCamera(150);
    private playerCircle: DebugCircle;
    private player = new Player();
    private projectedCircle: DebugCircle;
    private destinationCircle: DebugCircle;
    private cameraCircle: DebugCircle;
    private grid: DebugGrid;
    // Todo: DebugGrid to be able to show movement
    // Todo: DebugCrosshair for the camera

    public constructor() {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.gl = canvas.getContext("webgl") as WebGLRenderingContext;
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE);
        this.gl.enable(this.gl.BLEND);

        this.debugShader = createDebugShader(this.gl);
        this.playerCircle = new DebugCircle(this.gl, this.debugShader, 20);
        this.projectedCircle = new DebugCircle(this.gl, this.debugShader, 20);
        this.destinationCircle = new DebugCircle(this.gl, this.debugShader, 20);
        this.cameraCircle = new DebugCircle(this.gl, this.debugShader, 20);
        this.grid = new DebugGrid(this.gl, this.debugShader, 100);
        this.grid.set(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

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
        this.grid.render(GRID_COLOR);
        this.playerCircle.set(x, y, PLAYER_SIZE);
        this.playerCircle.render(PLAYER_COLOR);
        this.projectedCircle.set(this.camera.getProjectedX(), this.camera.getProjectedY(), 30);
        this.projectedCircle.render(PROJECTED_COLOR);
        this.destinationCircle.set(this.camera.getDestinationX(), this.camera.getDestinationY(), 8);
        this.destinationCircle.render(DESTINATION_COLOR);
        this.cameraCircle.set(this.camera.getX(), this.camera.getY(), 5);
        this.cameraCircle.render(CAMERA_COLOR);
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
