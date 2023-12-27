#include utils.glsl;

varying vec2 vUv; 

void main() {
    // constant lightness
    // float l = 1.0;
    // modulus
    float l = complexMagnitude(vUv, 1.0);
    // real
    // float l = complexRe(vUv, 1.0);
    // imaginary
    // float l = complexIm(vUv, 1.0);
    l = l / (1.0 + l);

    float angle = complexArgument(vUv, 1.0) / (2.0 * PI);
    // float angle = complexRe(vUv, 1.0);
    // float angle = complexIm(vUv, 1.0);
    // float angle = complexMagnitude(vUv, 1.0);

    gl_FragColor = vec4(hsl2rgb(vec3(angle / (2.0 * PI), 1.0, l)), 1.0);
}
