import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import {
  renderer,
  scene,
  camera,
  canvas,
  cssCamera,
  cssRenderer,
  cssScene,
} from "../localModules/setup/setUp.js";

const loader = new THREE.TextureLoader();
const screenDimensions = {
  width: 0,
  height: 0,
};

class Screen {
  constructor(attributes) {
    this.Create = () => {
      const aboutRoom = new THREE.Group();
      //Screen
      const screenColor =
        attributes == undefined
          ? 0x3f3f3f
          : attributes.screenColor == undefined
          ? 0x3f3f3f
          : attributes.screenColor;

      const screenGeometry = new THREE.PlaneGeometry(10, 5);

      screenDimensions.width = screenGeometry.parameters.width;
      screenDimensions.height = screenGeometry.parameters.height;
      const screenMaterial = new THREE.MeshPhongMaterial({
        // map: loader.load("../images/test.png"),
        color: screenColor,
        // side: THREE.DoubleSide,
      });

      const screen = new THREE.Mesh(screenGeometry, screenMaterial);
      screen.castShadow = true;

      //Base
      const baseColor =
        attributes == undefined
          ? 0x000000
          : attributes.baseColor == undefined
          ? 0x000000
          : attributes.baseColor;

      const baseGeometry = new THREE.BoxGeometry(3, 1, 1);
      const baseMaterial = new THREE.MeshPhongMaterial({ color: baseColor });

      const base = new THREE.Mesh(baseGeometry, baseMaterial);

      base.position.y = -2.5;

      aboutRoom.add(base, screen);

      scene.add(aboutRoom);

      return aboutRoom;
    };
  }
}

export { Screen, screenDimensions };
