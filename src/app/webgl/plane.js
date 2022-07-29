import { Geometry } from './geometry';

export class Plane extends Geometry {
    constructor(renderer, width = 2, height = 2) {
        super(renderer);

        const position = [
             width / 2,  height / 2,  0,
             width / 2, -height / 2,  0,
            -width / 2, -height / 2,  0,
            -width / 2,  height / 2,  0,
        ];
        const uv2 = [
            1, 1,
            1, 0,
            0, 0,
            0, 1,
        ];
        const index = [
            0, 2, 1,
            2, 0, 3,
        ]
        this.createVertexBuffer('position', position);
        this.createVertexBuffer('uv2', uv2);
        this.createIndexBuffer(index);
    }
}