uniform int bc;

vec4 calcColor(vec3 uv) {
    vec3 cell = 1.0 / resolution;
    
    vec4 bnd = vec4(0.0);
    float num = 0.0;
    if (uv.x < cell.x)     {
        vec4 bndX = texture(map, uv + vec3(cell.x, 0.0, 0.0));
        if (bc == 1) bndX.x *= -1.0;
        bnd += bndX;
        num++;
    } else if (uv.x > 1.0 - cell.x * 2.0) {
        vec4 bndX = texture(map, uv - vec3(cell.x, 0.0, 0.0));
        if (bc == 1) bndX.x *= -1.0;
        bnd += bndX;
        num++;
    }
    if (uv.y < cell.y) {
        vec4 bndY = texture(map, uv + vec3(0.0, cell.y, 0.0));
        if (bc == 1) bndY.y *= -1.0;
        bnd += bndY;
        num++;
    } else if (uv.y > 1.0 - cell.y * 2.0) {
        vec4 bndY = texture(map, uv - vec3(0.0, cell.y, 0.0));
        if (bc == 1) bndY.y *= -1.0;
        bnd += bndY;
        num++;
    }
    if (uv.z < cell.z) {
        vec4 bndZ = texture(map, uv + vec3(0.0, 0.0, cell.z));
        if (bc == 1) bndZ.z *= -1.0;
        bnd += bndZ;
        num++;
    } else if (uv.z > 1.0 - cell.z * 2.0) {
        vec4 bndZ = texture(map, uv - vec3(0.0, 0.0, cell.z));
        if (bc == 1) bndZ.z *= -1.0;
        bnd += bndZ;
        num++;
    }

    if (num > 0.0) {
        return bnd / num;
    } else {
        return texture(map, uv);
    }
}