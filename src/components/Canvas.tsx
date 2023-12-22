import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { useEffect, useRef } from 'react';
import { fullSize } from '../styles';
import { getFragmentShader, getVertexShader } from '../glsl';

import { parseFunction } from '../compiler/main';
import { appModel } from '../App';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

export const Canvas = observer(() => {
  const canvasParentRef = useRef<HTMLDivElement>(null);

  useEffect(
    action(() => {
      if (!canvasParentRef.current) return;

      const canvasParent = canvasParentRef.current;
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(canvasParent.clientWidth, canvasParent.clientHeight);
      canvasParent.appendChild(renderer.domElement);

      const geometry = new THREE.PlaneGeometry(5, 5, 100, 100);

      const expression = appModel.inputValue;
      try {
        const glslExpression = parseFunction(expression);

        appModel.state = 'good';

        const material = new THREE.ShaderMaterial({
          vertexShader: getVertexShader(glslExpression),
          fragmentShader: getFragmentShader(),
          side: THREE.DoubleSide,
        });
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        const axesHelper = new THREE.AxesHelper(5)
        scene.add(axesHelper);

        camera.position.z = 5;

        const animate = function () {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };

        animate();

        return () => {
          canvasParent.removeChild(renderer.domElement);
          scene.remove(plane);
          scene.remove(axesHelper);
        };
      } catch (e) {
        appModel.state = 'bad';
        console.error(e);
      }
    }),
    [appModel.inputValue],
  );

  useEffect(() => {
    if (!canvasParentRef.current) return;

    const canvasParent = canvasParentRef.current;

    const updateSize = () => {
      const { width, height } = canvasParent.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    // Start observing the parent element
    resizeObserver.observe(canvasParent);

    // Clean up
    return () => {
      resizeObserver.unobserve(canvasParent);
    };
  }, []);

  return <div css={[fullSize]} ref={canvasParentRef} />;
});
