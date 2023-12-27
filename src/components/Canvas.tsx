import * as math from 'mathjs';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { useEffect, useRef } from 'react';
import { fullSize } from '../styles';
import { getFragmentShader, getVertexShader } from '../glsl';

import { nodeToGLSL, nodeToJS } from '../compiler/main';
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

      
      
      
      try {
        const expression = appModel.inputValue;
        const fnNode = math.parse(expression);

        console.log(nodeToJS(fnNode, 0))
        
        appModel.state = 'good';
        
        
        const sheetsCount = 6;
        const planes: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial, THREE.Object3DEventMap>[] = [];
        for (let i = 0; i < sheetsCount; i++) {
          const glslExpression = nodeToGLSL(fnNode, i);
          const geometry = new THREE.PlaneGeometry(9, 9, 250, 250);
          const material = new THREE.ShaderMaterial({
            vertexShader: getVertexShader(glslExpression),
            fragmentShader: getFragmentShader(),
            side: THREE.DoubleSide,
          });
          const plane = new THREE.Mesh(geometry, material);
          planes.push(plane)
          scene.add(plane);
        }

        const axesHelper = new THREE.AxesHelper(1);
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
          planes.forEach(plane => scene.remove(plane));
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

    resizeObserver.observe(canvasParent);

    return () => {
      resizeObserver.unobserve(canvasParent);
    };
  }, []);

  return <div css={[fullSize]} ref={canvasParentRef} />;
});
