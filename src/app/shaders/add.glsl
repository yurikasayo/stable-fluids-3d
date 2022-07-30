uniform vec3 center;
uniform vec4 source;
uniform float dt;
uniform float mouseScale;

vec4 calcColor(vec3 uv) {
    vec3 d = uv - center;
    float intencity = exp(-dot(d, d) / mouseScale);

    vec4 color = texture(map, uv);
    color += dt * intencity * source;

    return color;
}