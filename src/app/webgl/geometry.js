import * as glMatrix from 'gl-matrix';

export class Geometry {
    constructor(renderer) {
        this.gl = renderer.gl;
        
        this.vbos = [];
        this.ibo = null;

        this.modelMatrix = glMatrix.mat4.create();
    }

    createVertexBuffer(name, list) {
        const gl = this.gl;

        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.vbos[name] = vbo;
    }

    createIndexBuffer(list) {
        const gl = this.gl;

        const ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(list), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        this.ibo = ibo;

        this.indexLength = list.length;
    }
}