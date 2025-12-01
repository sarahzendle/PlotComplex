#include utils.glsl;

varying vec4 fPosition; 

void main() {
    fPosition = vec4(position, 1.0);
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}