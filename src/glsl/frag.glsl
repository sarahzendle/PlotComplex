#include utils.glsl;

varying vec3 vUv; 

void main() {
    gl_FragColor = vec4(vUv.x, vUv.y, vUv.z, 1.0);
}