#include utils.glsl;

varying vec3 vUv; 

void main() {
    vec2 injectedEq = /* !EXPRESSION! */;

    vec3 newPosition = vec3(position.x, injectedEq.x, injectedEq.y);

    // vUv = position; 
    vUv = newPosition;

    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * modelViewPosition; 
}