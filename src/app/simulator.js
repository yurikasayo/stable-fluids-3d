import { Framebuffer } from './webgl/framebuffer';
import { Plane } from './webgl/plane';
import { Shader } from './webgl/shader';

import vertexShader from './shaders/simulate.vert';
import colorFragmentShader from './shaders/color3d.frag';
import simulateFragmentShader from './shaders/simulate.frag';
import boundaryShader from './shaders/boundary.glsl';
import addShader from './shaders/add.glsl';
import advectShader from './shaders/advect.glsl';
import diffuseShader from './shaders/diffuse.glsl';
import divergenceShader from './shaders/divergence.glsl';
import poissonShader from './shaders/poisson.glsl';
import projectShader from './shaders/project.glsl';

export class Simulator {
    constructor(renderer, size) {
        this.renderer = renderer;

        this.size = size;
        this.velocity = new Framebuffer(this.renderer, this.size.width, this.size.height, this.size.depth, true, 0.0);
        this.pressure = new Framebuffer(this.renderer, this.size.width, this.size.height, this.size.depth, true, 0.0);
        this.tmpframe = new Framebuffer(this.renderer, this.size.width, this.size.height, this.size.depth, true, null);

        this.plane = new Plane(this.renderer, 2, 2);

        this.colorShader = new Shader(this.renderer, vertexShader, colorFragmentShader);
        this.colorShader.createAttributes({position: 3, uv2: 2});
        this.colorShader.createUniforms({
            startZ: 'float',
            resolution: 'vec3',
            map: 'sampler3D',
        });
        this.boundaryShader = new Shader(this.renderer, vertexShader, simulateFragmentShader + boundaryShader);
        this.boundaryShader.createAttributes({position: 3, uv2: 2});
        this.boundaryShader.createUniforms({
            startZ: 'float',
            resolution: 'vec3',
            map: 'sampler3D',
            bc: 'int',
        });
        this.addShader = new Shader(this.renderer, vertexShader, simulateFragmentShader + addShader);
        this.addShader.createAttributes({position: 3, uv2: 2});
        this.addShader.createUniforms({
            startZ: 'float',
            resolution: 'vec3',
            map: 'sampler3D',
            center: 'vec3',
            source: 'vec4',
            dt: 'float',
        });
        this.advectShader = new Shader(this.renderer, vertexShader, simulateFragmentShader + advectShader);
        this.advectShader.createAttributes({position: 3, uv2: 2});
        this.advectShader.createUniforms({
            startZ: 'float',
            resolution: 'vec3',
            map: 'sampler3D',
            velocity: 'sampler3D',
            dt: 'float',
        });
        this.diffuseShader = new Shader(this.renderer, vertexShader, simulateFragmentShader + diffuseShader);
        this.diffuseShader.createAttributes({position: 3, uv2: 2});
        this.diffuseShader.createUniforms({
            startZ: 'float',
            resolution: 'vec3',
            map: 'sampler3D',
            map0: 'sampler3D',
            viscosity: 'float',
            dt: 'float',
        });
        this.divergenceShader = new Shader(this.renderer, vertexShader, simulateFragmentShader + divergenceShader);
        this.divergenceShader.createAttributes({position: 3, uv2: 2});
        this.divergenceShader.createUniforms({
            startZ: 'float',
            resolution: 'vec3',
            map: 'sampler3D',
        });
        this.poissonShader = new Shader(this.renderer, vertexShader, simulateFragmentShader + poissonShader);
        this.poissonShader.createAttributes({position: 3, uv2: 2});
        this.poissonShader.createUniforms({
            startZ: 'float',
            resolution: 'vec3',
            map: 'sampler3D',
            divergence: 'sampler3D',
            rho: 'float',
            dt: 'float',
        });
        this.projectShader = new Shader(this.renderer, vertexShader, simulateFragmentShader + projectShader);
        this.projectShader.createAttributes({position: 3, uv2: 2});
        this.projectShader.createUniforms({
            startZ: 'float',
            resolution: 'vec3',
            map: 'sampler3D',
            pressure: 'sampler3D',
            rho: 'float',
            dt: 'float',
        });
    }

    setRenderer(shader, uniforms) {
        this.renderer.set(this.plane, shader, uniforms, null);
    }
    
    add(source, center) {
        // add force
        let uniforms = {
            map: this.velocity.texture, 
            source: source, 
            center: center, 
            dt: 1 / 30,
        };
        this.setRenderer(this.addShader, uniforms);
        this.velocity.render(false);

        uniforms = {
            map: this.velocity.texture, 
            bc: 1,
        };
        this.setRenderer(this.boundaryShader, uniforms);
        this.velocity.render(false);
    }

    render() {
        // advect
        let uniforms = {
            map: this.velocity.texture, 
            velocity: this.velocity.texture,
            dt: 1 / 30, 
        };
        this.setRenderer(this.advectShader, uniforms);
        this.velocity.render(false);

        uniforms = {
            map: this.velocity.texture,
            bc: 1,
        };
        this.setRenderer(this.boundaryShader, uniforms);
        this.velocity.render(false);

        // diffuse
        uniforms = {
            map: this.velocity.texture,
        };
        this.setRenderer(this.colorShader, uniforms);
        this.tmpframe.render(false);

        for (let i = 0; i < 5; i++) {
            uniforms = {
                map: this.velocity.texture,
                map0: this.tmpframe.texture,
                viscosity: 1e-3,
                dt: 1 / 30,
            };
            this.setRenderer(this.diffuseShader, uniforms);
            this.velocity.render(false);
        }
        uniforms = {
            map: this.velocity.texture, 
            bc: 1,
        };
        this.setRenderer(this.boundaryShader, uniforms);
        this.velocity.render(false);
        
        // project
        uniforms = {
            map: this.velocity.texture,
        }
        this.setRenderer(this.divergenceShader, uniforms);
        this.tmpframe.render(false);

        uniforms = {
            map: this.tmpframe.texture, 
            bc: 0,
        };
        this.setRenderer(this.boundaryShader, uniforms);
        this.tmpframe.render(false);

        for (let i = 0; i < 5; i++) {
            uniforms = {
                map: this.pressure.texture,
                divergence: this.tmpframe.texture,
                rho: 1.0,
                dt: 1 / 30,
            };
            this.setRenderer(this.poissonShader, uniforms);
            this.pressure.render(false);
        }
        uniforms = {
            map: this.pressure.texture, 
            bc: 0,
        };
        this.setRenderer(this.boundaryShader, uniforms);
        this.pressure.render(false);

        uniforms = {
            map: this.velocity.texture,
            pressure: this.pressure.texture,
            rho: 1.0,
            dt: 1 / 30,
        };
        this.setRenderer(this.projectShader, uniforms);
        this.velocity.render(false);

        uniforms = {
            map: this.velocity.texture,
            bc: 1,
        };
        this.setRenderer(this.boundaryShader, uniforms);
        this.velocity.render(false);
    }
}