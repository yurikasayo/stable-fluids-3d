uniform sampler3D divergence;
uniform float rho;
uniform float dt;

vec4 calcColor(vec3 uv) {
    float p = -texture(divergence, uv).x * rho / dt;
    
    vec3 cell = 1.0 / resolution;
    p += texture(map, uv + vec3(cell.x, 0.0, 0.0)).x / (cell.x * cell.x);
    p += texture(map, uv - vec3(cell.x, 0.0, 0.0)).x / (cell.x * cell.x);
    p += texture(map, uv + vec3(0.0, cell.y, 0.0)).x / (cell.y * cell.y);
    p += texture(map, uv - vec3(0.0, cell.y, 0.0)).x / (cell.y * cell.y);
    p += texture(map, uv + vec3(0.0, 0.0, cell.z)).x / (cell.z * cell.z);
    p += texture(map, uv - vec3(0.0, 0.0, cell.z)).x / (cell.z * cell.z);

    p /= 2.0 * (1.0 / (cell.x * cell.x) + 1.0 / (cell.y * cell.y) + 1.0 / (cell.z * cell.z));

    vec4 color = vec4(p, 0.0, 0.0, 0.0);

    return color;
}