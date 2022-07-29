#version 300 es

#define ITERATION 80.0

precision highp float;
precision highp sampler3D;

in vec3 vPos;
in vec3 vCameraPos;

uniform sampler3D map;
uniform vec3 size;

out vec4 outColor;

void main() {
    vec3 ray = normalize(vPos - vCameraPos) * length(size);

    outColor = vec4(0.1);
    vec3 texCoord = vec3(0.5) + vec3(vPos + ray) / size;
    for (float i = 1.0; i <= ITERATION; i++) {
        vec3 texCoord = vec3(0.5) + vec3(vPos + ray * (ITERATION - i) / ITERATION) / size;

        if (texCoord.x >= 0.0 && texCoord.x <= 1.0
         && texCoord.y >= 0.0 && texCoord.y <= 1.0
         && texCoord.z >= 0.0 && texCoord.z <= 1.0) {
            vec4 color = texture(map, texCoord);
            color = vec4(length(color.xyz));
            float cutOffAlpha = 0.01 * step(0.2, color.a);
            outColor = color * cutOffAlpha + outColor * (1.0 - cutOffAlpha);
        }
    }
}