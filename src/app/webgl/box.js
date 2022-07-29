import { Geometry } from './geometry';

export class Box extends Geometry {
    constructor(renderer, width = 1, height = 1, depth = 1) {
        super(renderer);

        const position = [
             width / 2,  height / 2,  depth / 2,
             width / 2, -height / 2,  depth / 2,
            -width / 2, -height / 2,  depth / 2,
            -width / 2,  height / 2,  depth / 2,
             width / 2,  height / 2, -depth / 2,
             width / 2, -height / 2, -depth / 2,
            -width / 2, -height / 2, -depth / 2,
            -width / 2,  height / 2, -depth / 2,
        ];
        const uv3 = [
            1, 1, 1,
            1, 0, 1,
            0, 0, 1,
            0, 1, 1,
            1, 1, 0,
            1, 0, 0,
            0, 0, 0,
            0, 1, 0,
        ]
        const index = [
            0, 2, 1,
            2, 0, 3,
            4, 5, 6,
            6, 7, 4,
            0, 7, 3,
            7, 0, 4,
            1, 2, 6,
            6, 5, 1,
            0, 5, 4,
            5, 0, 1,
            3, 7, 6,
            6, 2, 3,
        ]
        this.createVertexBuffer('position', position);
        this.createIndexBuffer(index);
    }
}