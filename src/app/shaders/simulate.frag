#version 300 es

precision mediump float;
precision mediump sampler3D;

in vec2 vUv2;

out vec4 outColor[gl_MaxDrawBuffers];

uniform sampler3D map;
uniform float startZ;
uniform vec3 resolution;

vec4 calcColor(vec3 uv);

void main() {
    vec4 color[gl_MaxDrawBuffers];

    for (int i = 0; i < gl_MaxDrawBuffers; i++) {
        color[i] = calcColor(vec3(vUv2, (startZ + float(i) + 0.5) / resolution.z));
    }

    outColor = color;
}