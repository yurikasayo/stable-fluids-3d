import * as glMatrix from 'gl-matrix';
import { Box } from './webgl/box';
import { Shader } from './webgl/shader';
import { Camera } from './webgl/camera';
import vertexShader from './shaders/color.vert';
import fragmentShader from './shaders/colorVolume.frag';

export class Display {
    constructor(renderer, width, height) {
        this.renderer = renderer;
        this.size = {width, height};

        this.displayCube = new Box(this.renderer);

        this.shader = new Shader(this.renderer, vertexShader, fragmentShader);
        this.shader.createAttributes({position: 3});
        this.shader.createUniforms({
            modelMatrix: 'mat4', 
            viewMatrix: 'mat4', 
            projectionMatrix: 'mat4', 
            map: 'sampler3D',
            size: 'vec3',
        });

        this.camera = new Camera();
        this.camera.setRadius(3);
        this.camera.perspective(Math.PI / 4, width / height, 0.001, 20);

        this.rotation = {dtheta: 0, dphi: 0, decay: 0.95};
    }

    updateCamera() {
        this.camera.rotate(this.rotation.dtheta, this.rotation.dphi);
        this.rotation.dtheta *= this.rotation.decay;
        this.rotation.dphi *= this.rotation.decay;
    }

    resize(width, height) {
        this.size = {width, height};
        this.camera.perspective(Math.PI / 4, width / height, 0.001, 20);
    }

    setTexture(texture) {
        this.texture = texture;
    }

    render() {
        this.renderer.resize(this.size.width, this.size.height);
        this.renderer.set(this.displayCube, this.shader, {map: this.texture, size: [1, 1, 1]}, this.camera, true);
        this.renderer.render({
            clearColor: [0.0, 0.0, 0.0, 1.0],
            clearDepth: 1.0,
        });
    }
}