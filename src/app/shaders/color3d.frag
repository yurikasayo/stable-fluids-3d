#version 300 es

precision highp float;
precision highp sampler3D;

in vec2 vUv2;

out vec4 outColor[gl_MaxDrawBuffers];

uniform sampler3D map;
uniform float startZ;
uniform vec3 resolution;

void main() {
    vec4 color[gl_MaxDrawBuffers];

    for (int i = 0; i < gl_MaxDrawBuffers; i++) {
        color[i] = texture(map, vec3(vUv2, (startZ + float(i) + 0.5) / resolution.z));
    }

    outColor = color;
}