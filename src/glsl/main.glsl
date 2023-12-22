#include utils.glsl;

varying vec2 vUv; 

void main() {
    vec2 injectedEq = /* !EXPRESSION! */;

    // vec3 newPosition = vec3(injectedEq.x, complexMagnitude(injectedEq), injectedEq.y);
    vec3 newPosition = vec3(position.x, complexMagnitude(injectedEq), position.y);
    // vec3 newPosition = vec3(position.x, complexMagnitude(injectedEq) * (complexArgument(injectedEq)), position.y);

    // vUv = position; 
    vUv = injectedEq;

    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * modelViewPosition; 
}