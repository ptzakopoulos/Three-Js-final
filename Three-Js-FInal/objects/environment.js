import * as THREE from "three";
import * as CANNON from "cannon-es";
import { camera, scene } from "../localModules/setup/setUp";
import { World } from "cannon-es";

//Texture Loader
const loader = new THREE.TextureLoader();
const textures = {
  wall: loader.load("./images/wall.jpg"),
};
textures.wall.wrapS = THREE.RepeatWrapping;
textures.wall.wrapT = THREE.RepeatWrapping;
textures.wall.repeat.set(4, 1);
//____________________________________________________________CANNON SET UP ______________________________________________________
//Setting Up Cannon
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0),
});

const timeStep = 1 / 60;

//____________________________________________________________ GROUND ___________________________________________________________
//Plane
const groundBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(150, 150, 0.05)),
  type: CANNON.Body.STATIC,
});

const groundMaterial = new CANNON.Material();
groundMaterial.friction = 0.5;
groundMaterial.restitution = 0.5;
groundBody.collisionResponse = true;
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

const floorGeometry = new THREE.BoxGeometry(300, 300, 0.1);
const floorMaterial = new THREE.MeshPhongMaterial({
  color: 0xf0f0f0,
  side: THREE.DoubleSide,
});

//Floor
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true;
floor.name = "Floor";

scene.add(floor);
//____________________________________________________________ WALLS ___________________________________________________________
//Wall
const wallGeometry = new THREE.BoxGeometry(60, 10, 4);
const wallMaterial = new THREE.MeshPhongMaterial({
  map: textures.wall,
});

//Front Wall

const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);

const frontWallBody = new CANNON.Body({
  mass: 1000,
  shape: new CANNON.Box(new CANNON.Vec3(30, 5, 2)),
});
const leftWallBody = new CANNON.Body({
  mass: 1000,
  shape: new CANNON.Box(new CANNON.Vec3(30, 5, 2)),
});
const rightWallBody = new CANNON.Body({
  mass: 1000,
  shape: new CANNON.Box(new CANNON.Vec3(30, 5, 2)),
});

frontWallBody.position.set(0, 5, -4);
leftWallBody.position.set(-30, 5, 28);
leftWallBody.quaternion.setFromEuler(0, -Math.PI / 2, 0);
rightWallBody.position.set(30, 5, 28);
rightWallBody.quaternion.setFromEuler(0, Math.PI / 2, 0);
frontWallBody.collisionResponse = true;
leftWallBody.collisionResponse = true;
rightWallBody.collisionResponse = true;

frontWall.position.copy(frontWallBody.position);
frontWall.rotation.copy(frontWallBody.quaternion);
leftWall.position.copy(leftWallBody.position);
leftWall.quaternion.copy(leftWallBody.quaternion);
rightWall.position.copy(rightWallBody.position);
rightWall.quaternion.copy(rightWallBody.quaternion);

const frontWallMaterial = new CANNON.Material();
frontWallMaterial.friction = 0.8;
frontWallMaterial.restitution = 0.5;
frontWallMaterial.collisionResponse = true;

world.addBody(frontWallBody);
world.addBody(leftWallBody);
world.addBody(rightWallBody);
scene.add(frontWall);
scene.add(leftWall);
scene.add(rightWall);

frontWall.receiveShadow = true;

//____________________________________________________________ SCREEN ___________________________________________________________
const screenDimensions = {
  width: 0,
  height: 0,
};

const bodies = {
  screen: undefined,
  base: undefined,
};

class Screen {
  constructor(attributes) {
    this.Create = () => {
      const screenGroup = new THREE.Group();
      screenGroup.name = "Group";
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
        side: THREE.DoubleSide,
      });

      const screen = new THREE.Mesh(screenGeometry, screenMaterial);
      screen.castShadow = true;
      screen.name = "Screen";

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
      base.name = "Base";

      screenGroup.add(base, screen);

      scene.add(screenGroup);

      return screenGroup;
    };
  }
}

//____________________________________________________________ PLAYER ___________________________________________________________
//player
const playerGeometry = new THREE.BoxGeometry(2, 6, 2);
const playerMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.name = "Player";

scene.add(player);

const playerBody = new CANNON.Body({
  mass: 50,
  shape: new CANNON.Box(new CANNON.Vec3(1, 3, 1)),
});
const playerCMaterial = new CANNON.Material();
playerBody.collisionResponse = true;
playerCMaterial.friction = 0.99;
playerCMaterial.restitution = 0.5;
playerBody.linearDamping = 0.9999;
playerBody.quaternion.setFromEuler(0, 0, 0);
playerBody.position.set(10, 4, 12);

world.addBody(playerBody);

//____________________________________________________________ UPDATES ___________________________________________________________
const updatingFunction = () => {
  world.step(timeStep);
  floor.position.copy(groundBody.position);
  floor.quaternion.copy(groundBody.quaternion);
  playerBody.position.y = 4;
  player.position.copy(playerBody.position);
  //   player.quaternion.copy(playerBody.quaternion);
  camera.position.copy(player.position);
  camera.position.z = player.position.z;
  //   camera.quaternion.copy(player.quaternion);
  requestAnimationFrame(updatingFunction);
};
requestAnimationFrame(updatingFunction);

export { Screen, screenDimensions, bodies, player, playerBody };
