export class Shader {
    constructor(renderer, vertexShader, fragmentShader) {
        this.gl = renderer.gl;

        this.createShader(vertexShader, fragmentShader);
        
        this.attributes = [];
        this.uniforms = [];
    }

    createShader(vertexShader, fragmentShader) {
        const gl = this.gl;

        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(this.vertexShader, vertexShader);
        gl.shaderSource(this.fragmentShader, fragmentShader);

        gl.compileShader(this.vertexShader);
        gl.compileShader(this.fragmentShader);

        if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the vertex shader: ' + gl.getShaderInfoLog(this.vertexShader));
            gl.deleteShader(this.vertexShader);
            return null;
        }
    
        if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the fragment shader: ' + gl.getShaderInfoLog(this.fragmentShader));
            gl.deleteShader(this.fragmentShader);
            return null;
        }

        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            alert(gl.getProgramInfoLog(this.program))
        }
        gl.useProgram(this.program);
    }

    createAttributes(attributes) {
        const gl = this.gl;
        for (let key in attributes) {
            const attributeLocation = gl.getAttribLocation(this.program, key);
            this.attributes[key] = {
                location: attributeLocation,
                size: attributes[key],
            };
        }
    }

    createUniforms(uniforms) {
        const gl = this.gl;
        for (let key in uniforms) {
            const uniformLocation = gl.getUniformLocation(this.program, key);
            this.uniforms[key] = {
                location: uniformLocation,
                type: uniforms[key]
            };
        }
    }
}