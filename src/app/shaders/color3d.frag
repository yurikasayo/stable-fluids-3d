#version 300 es

precision highp float;
precision highp sampler3D;

in vec2 vUv2;

out vec4 outColor[8];

uniform sampler3D map;
uniform float startZ;
uniform vec3 resolution;

void main() {
    outColor[0] = texture(map, vec3(vUv2, (startZ + 0.5) / resolution.z));
    outColor[1] = texture(map, vec3(vUv2, (startZ + 1.5) / resolution.z));
    outColor[2] = texture(map, vec3(vUv2, (startZ + 2.5) / resolution.z));
    outColor[3] = texture(map, vec3(vUv2, (startZ + 3.5) / resolution.z));
    outColor[4] = texture(map, vec3(vUv2, (startZ + 4.5) / resolution.z));
    outColor[5] = texture(map, vec3(vUv2, (startZ + 5.5) / resolution.z));
    outColor[6] = texture(map, vec3(vUv2, (startZ + 6.5) / resolution.z));
    outColor[7] = texture(map, vec3(vUv2, (startZ + 7.5) / resolution.z));
}