import * as Stats from 'stats-js';
import { Renderer } from './webgl/renderer';
import { Display } from './display';
import { Simulator } from './simulator';

export class MyApp {
    constructor(canvas, debug) {
        this.canvas = canvas;
        this.debug = debug;

        this.setSize();

        this.renderer = new Renderer(canvas);
        this.display = new Display(this.renderer, canvas.width, canvas.height);

        const textureSize = {
            width: 64,
            height: 64,
            depth: 64,
        };
        this.simulator = new Simulator(this.renderer, textureSize);

        this.mouse = {x: 0, y: 0, dx: 0, dy: 0, down: false};
        window.addEventListener('resize', this.resize.bind(this));
        this.canvas.addEventListener('mousemove', e => this.mousemove(e));
        this.canvas.addEventListener('mousedown', this.mousedown.bind(this));
        this.canvas.addEventListener('mouseup', this.mouseup.bind(this));

        if (this.debug) {
            this.setDebug();
        }

        this.loop();
    }

    setSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // const pixelRatio = Math.min(window.devicePixelRatio, 2);
        const pixelRatio = 1;

        this.canvas.width = Math.floor(width * pixelRatio);
        this.canvas.height = Math.floor(height * pixelRatio);

        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
    }

    resize() {
        this.setSize();
        this.renderer.resize(this.canvas.width, this.canvas.height);
        this.display.resize(this.canvas.width, this.canvas.height);
    }

    mousemove(e) {
        this.mouse.x = e.x / window.innerWidth;
        this.mouse.y = (window.innerHeight - e.y) / window.innerHeight;
        this.mouse.dx = e.movementX;
        this.mouse.dy = -e.movementY;

        const position = this.display.camera.inverseProjection(this.mouse.x * 2 - 1, this.mouse.y * 2 - 1);
        if (Math.abs(position[0]) < 0.5 && Math.abs(position[1]) < 0.5 && Math.abs(position[2]) < 0.5) {
            const movement = this.display.camera.inverseProjection(this.mouse.dx * window.innerWidth / window.innerHeight, this.mouse.dy);
            this.simulator.add(
                [movement[0] * 10, movement[1] * 10, movement[2] * 10, 0],
                [position[0] + 0.5, position[1] + 0.5, position[2] + 0.5]
            );
        }     

        // this.simulator.addForce(
        //     [this.mouse.dx, this.mouse.dy, 0.0, 0.0],
        //     [this.mouse.x / window.innerWidth, this.mouse.y / window.innerHeight]
        // );


        if (this.mouse.down == true) {
            // this.simulator.addSource(
            //     [Math.sqrt(this.mouse.dx * this.mouse.dx + this.mouse.dy * this.mouse.dy), 0.0, 0.0, 0.0],
            //     [this.mouse.x / window.innerWidth, this.mouse.y / window.innerHeight]
            // )
            this.display.rotation.dtheta = -Math.PI * this.mouse.dx / window.innerWidth;
            this.display.rotation.dphi = Math.PI * this.mouse.dy / window.innerHeight;
        }
    }

    mousedown() {
        this.mouse.down = true;
    }

    mouseup() {
        this.mouse.down = false;
    }

    loop() {
        requestAnimationFrame(this.loop.bind(this));

        if (this.debug) {
            this.stats.end();
            this.stats.begin();
        }

        this.simulator.render();
        
        this.display.updateCamera();
        this.display.setTexture(this.simulator.velocity.texture);
        this.display.render();
    }

    setDebug() {
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
    }
}