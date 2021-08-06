varying vec2 vUv;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 1000. * (1.0 / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}