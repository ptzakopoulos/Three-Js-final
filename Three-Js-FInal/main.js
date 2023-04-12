import * as THREE from "three";
import * as CANNON from "cannon-es";
// import * as Stats from "stats";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

//Local Modules
import {
  renderer,
  scene,
  camera,
  cssRenderer,
} from "./localModules/setup/setUp.js";
import { Spotlight } from "./localModules/lights/lights.js";
import Responsive from "./localModules/setup/responsive.js";
import cameraControll from "./localModules/camera/camera-controllers.js";
import target from "./localModules/interactivity.js";
//Local Scenarios
import { Screen, screenDimensions, bodies } from "./objects/environment.js";
import { Frame } from "./htmlContent/htmlContent.js";

//Shadows ON
renderer.shadowMap.enabled = true;

//light
const spotLight = new Spotlight(0xffffff, { x: 0, y: 300, z: 50 }, 1);
spotLight.Create();
spotLight.Place();
spotLight.Handler().castShadow = true;
spotLight.Handler().angle = 0.2;

//Screen
const screen = new Screen({ screenColor: 0x00ff00 }).Create();
const content1 = new Frame({ local: "testContent" }).Create();
screen.position.set(-15, 3, 0);
content1.forEach((e) => {
  screen.add(e);
});

const screen2 = new Screen({ screenColor: 0xff0000 }).Create();
screen2.position.set(0, 3, 0);
const content2 = new Frame({
  online: " http://tzakopoulosp.gr/index.html",
}).Create();
content2.forEach((e) => {
  screen2.add(e);
});

const screen3 = new Screen({ screenColor: 0x0000ff }).Create();
screen3.position.set(15, 3, 0);

//Environment Render & Update
camera.position.set(0, 4, 36);

//3d Objects Interavtivity with movement
target();

// orbit.update();

camera.lookAt(0, 3, 1);
cameraControll();
renderer.render(scene, camera);
cssRenderer.render(scene, camera);

Responsive();

const stats = new Stats();
document.body.appendChild(stats.dom);
const fpsDisplay = () => {
  //FPS updates
  stats.update();
  requestAnimationFrame(fpsDisplay);
};
requestAnimationFrame(fpsDisplay);

// ____________________ TESTS_________________
