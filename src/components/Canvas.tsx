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
scene.background = new THREE.Color('gray');
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.up.set(0, -1, 0); //left-handed coordinate system
camera.position.set(5, -3, 5);

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

      //need a left-handed coordinate system to match math convention
      let flipGroup = new THREE.Group();
      flipGroup.scale.y = -1;
      scene.add(flipGroup);

      var geometry: THREE.BufferGeometry;
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(canvasParent.clientWidth, canvasParent.clientHeight);
      canvasParent.appendChild(renderer.domElement);

      const plotType = appModel.plotType;
      if (plotType == 'surface') {
        geometry = new THREE.PlaneGeometry(9, 9, 250, 250);
      }
      else if (plotType == 'sphere') {
        geometry = new THREE.SphereGeometry(1, 250, 250);
        geometry.translate(0, 1, 0);
      }
      else {
        throw new Error(`Plot type '${plotType}' is not supported`);
      }

      try {
        const expression = appModel.inputValue;
        const glslExpression = parseFunction(expression);

        appModel.state = 'good';

        const material = new THREE.ShaderMaterial({
          vertexShader: getVertexShader(glslExpression, appModel.plotType),
          fragmentShader: getFragmentShader(glslExpression, plotType),
          side: THREE.DoubleSide,
        });
        const geom = new THREE.Mesh(geometry, material);
        flipGroup.add(geom);

        const axesHelper = new THREE.AxesHelper(1);
        flipGroup.add(axesHelper);

        const animate = function () {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };

        animate();

        return () => {
          canvasParent.removeChild(renderer.domElement);
          scene.remove(geom);
          scene.remove(axesHelper);
        };
      } catch (e) {
        appModel.state = 'bad';
        console.error(e);
      }
    }),
    [appModel.inputValue, appModel.plotType],
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
