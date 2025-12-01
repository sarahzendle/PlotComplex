#include utils.glsl;

varying vec4 fPosition;

//maps vector on sphere to corresponding stereographic projection vector on plane
vec2 projection(vec3 p) {
float u = (2.0*p.x) / (2.0 - p.y);
float v = (2.0*p.z) / (2.0 - p.y);
return vec2(u, v);
}

void main() {
    vec2 z = projection(vec3(fPosition));
    z = /* !EXPRESSION! */;

    float l = complexMagnitude(z);
    l = l/(1.0+l);

    gl_FragColor = vec4(hsl2rgb(vec3(complexArgument(z)/ 6.283185307, 1.0, l)), 1.0);
}