export class Framebuffer {
    constructor(renderer, width, height, depth, double = true, initValue = null) {
        this.renderer = renderer;
        this.size = {width, height, depth};

        if (double) {
            this.frameId = 0;
            this.frame = new Array(2);
            this.frame[0] = this.createFramebuffer(width, height, depth, initValue);
            this.frame[1] = this.createFramebuffer(width, height, depth, initValue);
            this.texture = this.frame[1].texture;
        } else {
            this.frame = this.createFramebuffer(width, height, depth, initValue);
            this.texture = this.frame.texture;
        }

        this.isDouble = double;
    }

    createFramebuffer(width, height, depth, initValue) {
        const gl = this.renderer.gl;

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_3D, texture);
    
        if (initValue != null) {
            const initialData = new Float32Array(4 * width * height * depth);
            initialData.fill(initValue);
            gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA32F, width, height, depth, 0, gl.RGBA, gl.FLOAT, initialData);
        } else {
            gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA32F, width, height, depth, 0, gl.RGBA, gl.FLOAT, null);
        }
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    
        const list = []
        for (let j = 0; j < depth; j += 8) {
            const framebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    
            const layers = Math.min(8, depth - j);
            const buffers = []
            for (let i = 0; i < layers; i++) {
                gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, texture, 0, i+j);
                buffers.push(gl.COLOR_ATTACHMENT0 + i);
            }
    
            list.push({framebuffer, buffers});
        }
    
        gl.bindTexture(gl.TEXTURE_3D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return {texture, list};
    }

    render(useAlpha, clearColor, clearDepth) {
        const currentFrame = this.isDouble ? this.frame[this.frameId] : this.frame;

        this.renderer.resize(this.size.width, this.size.height);
        this.renderer.uniforms["resolution"] = [this.size.width, this.size.height, this.size.depth];    
        for (let i = 0; i < currentFrame.list.length; i++) {   
            this.renderer.uniforms["startZ"] = i * 8;
            this.renderer.render({
                framebuffer: currentFrame.list[i].framebuffer,
                buffers: currentFrame.list[i].buffers,
                useAlpha: useAlpha,
                clearColor: clearColor,
                clearDepth: clearDepth,
            })
        }

        this.texture = currentFrame.texture;
        if (this.isDouble) this.frameId = 1 - this.frameId;
    }

    clearColor(color) {
        const currentFrame = this.isDouble ? this.frame[this.frameId] : this.frame;
        for (let i = 0; i < currentFrame.list.length; i++) {   
            this.renderer.clearColor(currentFrame.list[i].framebuffer, currentFrame.list[i].buffers, color);
        }
        this.texture = currentFrame.texture;
        if (this.isDouble) this.frameId = 1 - this.frameId;
    }
}