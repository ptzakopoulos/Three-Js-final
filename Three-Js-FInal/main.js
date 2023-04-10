import * as THREE from "three";
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
import { Screen } from "./objects/screen.js";
import { Frame } from "./htmlContent/htmlContent.js";

//Camera Controllers
// const orbit = new OrbitControls(camera, renderer.domElement);

//Texture Loader
const loader = new THREE.TextureLoader();
const textures = {
  wall: loader.load("./images/wall.jpg"),
};

//Shadows ON
renderer.shadowMap.enabled = true;

//light
const spotLight = new Spotlight(0xffffff, { x: 0, y: 300, z: 50 }, 1);
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

//Floor
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;

scene.add(plane);

//Wall
const wallGeometry = new THREE.BoxGeometry(10, 10, 1);
const wallMaterial = new THREE.MeshPhongMaterial({
  map: textures.wall,
});

const wall = new THREE.Mesh(wallGeometry, wallMaterial);
const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
wall.position.set(0, 5, -2);
wall2.position.set(10, 5, -2);

scene.add(wall2);
scene.add(wall);

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

// ____________________ TESTS_________________
console.log("Na deiksw me posa FPS trexei");

const stats = new Stats();
document.body.appendChild(stats.dom);
stats.dom.style.transform = "translate(50px,50px) scale(2)";
const fpsDisplay = () => {
  stats.update();
  requestAnimationFrame(fpsDisplay);
};
requestAnimationFrame(fpsDisplay);
