#version 300 es

in vec3 position;
in vec2 uv2;

out vec2 vUv2;

void main() {
    gl_Position = vec4(position, 1.0);

    vUv2 = uv2;
}