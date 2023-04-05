import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

//Local Modules
import {
  renderer,
  scene,
  camera,
  cssCamera,
  cssRenderer,
  cssScene,
} from "./localModules/setup/setUp.js";
import { Spotlight } from "./localModules/lights/lights.js";
import Responsive from "./localModules/setup/responsive.js";
import cameraControll from "./localModules/camera/camera-controllers.js";
//Local Scenarios
import { Screen } from "./objects/screen.js";
import { Frame } from "./htmlContent/htmlContent.js";

//Camera Controllers
// const orbit = new OrbitControls(camera, renderer.domElement);

//Shadows ON
renderer.shadowMap.enabled = true;

//light
const spotLight = new Spotlight(0xffffff, { x: 0, y: 100, z: 50 }, 1);
spotLight.Create();
spotLight.Place();
spotLight.Handler().castShadow = true;
spotLight.Handler().angle = 0.2;

//Plane
const planeGeometry = new THREE.PlaneGeometry(300, 300);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xf0f0f0,
  side: THREE.DoubleSide,
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;

scene.add(plane);

//Screen
const screen = new Screen({ screenColor: 0x00ff00 }).Create();
screen.position.set(-15, 3, 5);
screen.rotation.y = 1;

const screen2 = new Screen({ screenColor: 0xff0000 }).Create();
screen2.position.set(0, 3, 0);
const content2 = new Frame({
  local: "testContent",
}).Create();

const screen3 = new Screen({ screenColor: 0x0000ff }).Create();
screen3.position.set(11, 3, 0);
const content3 = new Frame({
  online: " http://tzakopoulosp.gr/index.html",
  // local: "testContent",
}).Create();
screen2.add(content3);

//Environment Render & Update
camera.position.set(0, 4, 36);
cssCamera.position.set(0, 4, 36);

const test = () => {
  const iframe = document.getElementsByTagName("iframe");
  if (iframe.length == 0) {
    setTimeout(() => {
      test();
    }, 100);
  }
};
test();

// orbit.update();
scene.rotation.y += 2;
camera.lookAt(0, 3, 1);
cssCamera.lookAt(0, 3, 1);
cameraControll();
renderer.render(scene, camera);
const animatie = () => {
  const animation = requestAnimationFrame(animatie);
  if (camera.position.z > 20) {
    camera.position.z -= 0.1;
    cssCamera.position.z -= 0.1;
  } else {
    cancelAnimationFrame(animation);
  }
  cssRenderer.render(cssScene, cssCamera);
};
requestAnimationFrame(animatie);
Responsive();
