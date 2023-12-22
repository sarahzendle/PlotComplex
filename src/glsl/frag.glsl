#include utils.glsl;

varying vec2 vUv; 

void main() {
    float l = complexMagnitude(vUv);
    l = l/(1.0+l);


    gl_FragColor = vec4(hsl2rgb(vec3(complexArgument(vUv)/ 6.283185307, 1.0, l)), 1.0);
}