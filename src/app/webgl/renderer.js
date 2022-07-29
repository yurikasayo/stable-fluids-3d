export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        const gl = this.gl = canvas.getContext('webgl2');
        if (!gl) {
            alert('WebGL2 unsupported.');
        }

        if (!gl.getExtension("EXT_color_buffer_float")) {
            alert("need EXT_color_buffer_float")
        }
        if (!gl.getExtension("OES_texture_float_linear")) {
            alert("need OES_texture_float_linear")
        }
        gl.enable(gl.CULL_FACE);

        this.geometries = [];
        this.shader = null;
        this.uniforms = [];
        this.camera = null;
    }

    resize(width, height) {
        this.gl.viewport(0, 0, width, height);
    }

    set(geometries, shader, uniforms, camera, useLinear = false) {
        if (Array.isArray(geometries)) {
            this.geometries = geometries;
        } else {
            this.geometries = [geometries];
        }
        this.shader = shader;
        this.uniforms = uniforms;
        this.camera = camera;
        this.useLinear = useLinear;
    }

    render({framebuffer = null, buffers = null, useAlpha = true, clearColor = null, clearDepth = null}) {
        const gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

        if (buffers) {
            gl.drawBuffers(buffers);
        } 

        if (useAlpha) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        } else {
            gl.disable(gl.BLEND);
        }
        
        if (clearColor) {
            gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        if (clearDepth) {
            gl.clearDepth(clearDepth);
            gl.clear(gl.DEPTH_BUFFER_BIT);
        }

        gl.useProgram(this.shader.program);
        this.setUniforms();

        for (let geometry of this.geometries) {
            this.setAttributes(geometry);
            if (this.camera) this.setUniform(this.shader.uniforms["modelMatrix"].location, geometry.modelMatrix, this.shader.uniforms["modelMatrix"].type);
            gl.drawElements(gl.TRIANGLES, geometry.indexLength, gl.UNSIGNED_BYTE, 0);
        }

        gl.flush();

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    setAttributes(geometry) {
        const gl = this.gl;
        const shader = this.shader;

        for (let key in geometry.vbos) {
            if (key in shader.attributes) {
                gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vbos[key]);
                gl.enableVertexAttribArray(shader.attributes[key].location);
                gl.vertexAttribPointer(shader.attributes[key].location, shader.attributes[key].size, gl.FLOAT, false, 0, 0);
            }
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.ibo);
    }

    setUniforms() {
        const gl = this.gl;
        const shader = this.shader;
        const uniforms = this.uniforms;

        let textureId = 0;

        for (let key in uniforms) {
            if (key in shader.uniforms) {
                if (shader.uniforms[key].type == "sampler2D") {
                    gl.activeTexture(gl.TEXTURE0 + textureId);
                    gl.bindTexture(gl.TEXTURE_2D, uniforms[key]);
                    if (this.useLinear) {
                        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    } else {
                        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    }
                    this.setUniform(shader.uniforms[key].location, textureId, shader.uniforms[key].type);
                    textureId++;
                } else if (shader.uniforms[key].type == "sampler3D") {
                    gl.activeTexture(gl.TEXTURE0 + textureId);
                    gl.bindTexture(gl.TEXTURE_3D, uniforms[key]);
                    this.setUniform(shader.uniforms[key].location, textureId, shader.uniforms[key].type);
                    textureId++;
                } else {
                    this.setUniform(shader.uniforms[key].location, uniforms[key], shader.uniforms[key].type);  
                }
            }
        }

        if (this.camera) {
            this.setUniform(shader.uniforms["viewMatrix"].location, this.camera.viewMatrix, shader.uniforms["viewMatrix"].type);
            this.setUniform(shader.uniforms["projectionMatrix"].location, this.camera.projectionMatrix, shader.uniforms["projectionMatrix"].type);
        }
    }

    setUniform(location, value, type) {
        const gl = this.gl;

        switch (type) {
            case 'int':
            case 'sampler2D':
            case 'sampler3D':
                gl.uniform1i(location, value);
                break;

            case 'float':
                gl.uniform1f(location, value);
                break;

            case 'vec2':
                gl.uniform2fv(location, value);
                break;

            case 'vec3':
                gl.uniform3fv(location, value);
                break;

            case 'vec4':
                gl.uniform4fv(location, value);
                break;

            case 'mat4':
                gl.uniformMatrix4fv(location, false, value);
                break;

            default:
                break;
        }
    }

    clearColor(framebuffer, buffers, color) {
        const gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        if (buffers) {
            gl.drawBuffers(buffers);
        }
        gl.clearColor(color[0], color[1], color[2], color[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.flush();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}