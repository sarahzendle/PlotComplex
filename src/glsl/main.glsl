#include utils.glsl;

varying vec2 vUv; 

void main() {
    vec2 injectedEq = /* !EXPRESSION! */;

    // Adjust newPosition for multi-valued roots
    // real part
    // vec3 newPosition = vec3(position.x, complexRe(injectedEq, 1.0), position.y);
    // imaginary part
    // vec3 newPosition = vec3(position.x, complexIm(injectedEq, 1.0), position.y);
    // modulus
    // vec3 newPosition = vec3(position.x, complexMagnitude(injectedEq, 1.0), position.y);
    // argument
    vec3 newPosition = vec3(position.x, complexArgument(injectedEq, 1.0), position.y);
    // custom
    // vec3 newPosition = vec3(position.x, complexDisplay(injectedEq, 1.0), position.y);

    vUv = injectedEq;

    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * modelViewPosition; 
}
