import * as glMatrix from 'gl-matrix';

export class Camera {
    constructor() {
        this.viewMatrix = glMatrix.mat4.create();
        this.projectionMatrix = glMatrix.mat4.create();

        this.radius = 0;
        this.theta = 0;
        this.phi = 0;
        this.position = glMatrix.vec3.create();
    }

    setRadius(radius) {
        this.radius = radius;

        glMatrix.vec3.set(this.position, 0, 0, this.radius);
        glMatrix.mat4.lookAt(this.viewMatrix, this.position, [0, 0, 0], [0, 1, 0]);
    }

    rotate(dtheta, dphi) {
        this.theta += dtheta;
        this.phi = Math.min(Math.max(this.phi + dphi, -Math.PI / 2), Math.PI / 2);
        
        const rotateMatrix = glMatrix.mat4.create();
        glMatrix.mat4.rotateY(rotateMatrix, rotateMatrix, this.theta);
        glMatrix.mat4.rotateX(rotateMatrix, rotateMatrix, this.phi);
        glMatrix.vec3.transformMat4(this.position, [0, 0, this.radius], rotateMatrix);

        glMatrix.mat4.lookAt(this.viewMatrix, this.position, [0, 0, 0], [0, 1, 0]);
    }

    perspective(fovy, aspect, near, far) {
        glMatrix.mat4.perspective(this.projectionMatrix, fovy, aspect, near, far);
    }

    inverseProjection(x, y) {
        const matrix = glMatrix.mat4.create();
        glMatrix.mat4.multiply(matrix, this.projectionMatrix, this.viewMatrix);
        
        const origin = glMatrix.vec3.fromValues(0, 0, 0);
        glMatrix.vec3.transformMat4(origin, origin, matrix);

        const position = glMatrix.vec3.fromValues(x, y, origin[2]);
        glMatrix.mat4.invert(matrix, matrix);
        glMatrix.vec3.transformMat4(position, position, matrix);

        return position;
    }
}