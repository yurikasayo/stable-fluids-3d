uniform vec3 center;
uniform vec4 source;
uniform float dt;

vec4 calcColor(vec3 uv) {
    vec3 d = uv - center;
    float intencity = exp(-dot(d, d) * 200.0);

    vec4 color = texture(map, uv);
    color += dt * intencity * source;
    color.y += dt * 0.098;

    return color;
}