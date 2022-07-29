uniform sampler3D velocity;
uniform float dt;

vec4 calcColor(vec3 uv) {
    vec3 p = uv - dt * texture(velocity, uv).xyz;

    vec4 color = texture(map, p);

    return color;
}