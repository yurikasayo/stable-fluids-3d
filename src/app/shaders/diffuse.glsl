uniform sampler3D map0;
uniform float viscosity;
uniform float dt;

vec4 calcColor(vec3 uv) {
    vec4 color = texture(map0, uv);

    vec3 cell = 1.0 / resolution;
    color += texture(map, uv + vec3(cell.x, 0.0, 0.0)) * dt * viscosity / (cell.x * cell.x);
    color += texture(map, uv - vec3(cell.x, 0.0, 0.0)) * dt * viscosity / (cell.x * cell.x);
    color += texture(map, uv + vec3(0.0, cell.y, 0.0)) * dt * viscosity / (cell.y * cell.y);
    color += texture(map, uv - vec3(0.0, cell.y, 0.0)) * dt * viscosity / (cell.y * cell.y);
    color += texture(map, uv + vec3(0.0, 0.0, cell.z)) * dt * viscosity / (cell.z * cell.z);
    color += texture(map, uv - vec3(0.0, 0.0, cell.z)) * dt * viscosity / (cell.z * cell.z);

    color /= 1.0 + dt * viscosity * 2.0 * (1.0 / (cell.x * cell.x) + 1.0 / (cell.y * cell.y) + 1.0 / (cell.z * cell.z));

    return color;
}