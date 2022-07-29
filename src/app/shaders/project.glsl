uniform sampler3D pressure;
uniform float rho;
uniform float dt;

vec4 calcColor(vec3 uv) {
    vec4 color = texture(map, uv);

    vec3 cell = 1.0 / resolution;
    float x0 = texture(pressure, uv - vec3(cell.x, 0.0, 0.0)).x / (2.0 * cell.x);
    float x1 = texture(pressure, uv + vec3(cell.x, 0.0, 0.0)).x / (2.0 * cell.x);
    float y0 = texture(pressure, uv - vec3(0.0, cell.y, 0.0)).x / (2.0 * cell.y);
    float y1 = texture(pressure, uv + vec3(0.0, cell.y, 0.0)).x / (2.0 * cell.y);
    float z0 = texture(pressure, uv - vec3(0.0, 0.0, cell.z)).x / (2.0 * cell.z);
    float z1 = texture(pressure, uv + vec3(0.0, 0.0, cell.z)).x / (2.0 * cell.z);
    
    color.xyz -= dt / rho * vec3(x1 - x0, y1 - y0, z1 - z0);

    return color;
}