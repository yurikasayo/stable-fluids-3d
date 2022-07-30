import GUI from 'lil-gui';
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
        this.canvas.addEventListener('touchmove', e => this.touchmove(e));

        this.setGui();
        if (this.debug) {
            this.setStats();
        }

        this.loop();
    }

    setSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixelRatio = Math.min(window.devicePixelRatio, 2);

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

        if (this.mouse.down == true) {
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

    touchmove() {
        e.preventDefault();
        const touches = e.touches;

        if (touches.length == 1) {
            const x = touches[0].pageX;
            const y = window.innerHeight - touches[0].pageY;
            
            this.mouse.dx = x - this.mouse.x;
            this.mouse.dy = y - this.mouse.y;
            this.mouse.x = x;
            this.mouse.y = y;

            const position = this.display.camera.inverseProjection(this.mouse.x * 2 - 1, this.mouse.y * 2 - 1);
            if (Math.abs(position[0]) < 0.5 && Math.abs(position[1]) < 0.5 && Math.abs(position[2]) < 0.5) {
                const movement = this.display.camera.inverseProjection(this.mouse.dx * window.innerWidth / window.innerHeight, this.mouse.dy);
                this.simulator.add(
                    [movement[0] * 10, movement[1] * 10, movement[2] * 10, 0],
                    [position[0] + 0.5, position[1] + 0.5, position[2] + 0.5]
                );
            } else {
                this.display.rotation.dtheta = -Math.PI * this.mouse.dx / window.innerWidth;
                this.display.rotation.dphi = Math.PI * this.mouse.dy / window.innerHeight;
            }
        }
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

    setGui() {
        this.gui = new GUI();
        this.guiObject = {};
        
        this.gui.add(this.display.param, "alphaScale").min(0).max(1).step(0.01);
        this.gui.add(this.display.param, "cutoffAlpha").min(0).max(1).step(0.01);
        this.gui.add(this.simulator.param, "mouseScale").min(0.0005).max(0.02).step(0.0005);
        this.gui.add(this.simulator.param, "viscosity").min(1e-4).max(1e-2).step(1e-4);
        this.gui.add(this.simulator.param, "rho").min(10).max(1000).step(1);
    }

    setStats() {
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
    }
}