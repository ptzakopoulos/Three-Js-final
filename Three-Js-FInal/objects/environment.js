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
const groundCMaterial = new CANNON.Material();

const groundBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(150, 150, 0.05)),
  type: CANNON.Body.STATIC,
  material: groundCMaterial,
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

const wallCMaterial = new CANNON.Material();

const frontWallBody = new CANNON.Body({
  mass: 1000,
  shape: new CANNON.Box(new CANNON.Vec3(30, 5, 2)),
  material: wallCMaterial,
});
const leftWallBody = new CANNON.Body({
  mass: 1000,
  shape: new CANNON.Box(new CANNON.Vec3(30, 5, 2)),
  material: wallCMaterial,
});
const rightWallBody = new CANNON.Body({
  mass: 1000,
  shape: new CANNON.Box(new CANNON.Vec3(30, 5, 2)),
  material: wallCMaterial,
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
const playerGeometry = new THREE.BoxGeometry(4, 6, 4);
const playerMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.name = "Player";

scene.add(player);

const cameraFocusGeometry = new THREE.BoxGeometry(1, 1, 1);
const cameraFocusMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});

const cameraFocus = new THREE.Mesh(cameraFocusGeometry, cameraFocusMaterial);

cameraFocus.position.set(
  player.position.x,
  player.position.y,
  player.position.z - 2
);

// player.add(cameraFocus);

const playerCMaterial = new CANNON.Material();

const playerBody = new CANNON.Body({
  mass: 50,
  shape: new CANNON.Box(new CANNON.Vec3(2, 3, 2)),
  material: playerCMaterial,
});

playerBody.collisionResponse = true;
playerBody.linearDamping = 0.1;
playerBody.quaternion.setFromEuler(0, 0, 0);
playerBody.position.set(10, 4, 12);

world.addBody(playerBody);

//____________________________________________________________ Bouncing Ball _____________________________________________________

const ballBodies = [];
const ballMeshes = [];

class ballLauncher {
  constructor(playerBody, wasLaunched) {
    this.position = playerBody.position;
    this.pointZ = -Math.cos(player.rotation.y);
    this.pointX = -Math.sin(player.rotation.y);
    this.pointY = camera.rotation.x;
  }
  Launch() {
    const b1 = Math.floor(Math.random() * 10) * Math.pow(16, 0);
    const b2 = Math.floor(Math.random() * 10) * Math.pow(16, 1);
    const g1 = Math.floor(Math.random() * 10) * Math.pow(16, 2);
    const g2 = Math.floor(Math.random() * 10) * Math.pow(16, 3);
    const r1 = Math.floor(Math.random() * 10) * Math.pow(16, 4);
    const r2 = Math.floor(Math.random() * 10) * Math.pow(16, 5);
    const color = b1 + b2 + g1 + g2 + r1 + r2;
    if (wasLaunched) {
    } else {
      const ballGeometry = new THREE.SphereGeometry(0.5, 64);
      const ballMaterial = new THREE.MeshBasicMaterial({
        color: color,
      });

      const ball = new THREE.Mesh(ballGeometry, ballMaterial);

      scene.add(ball);

      const ballCMaterial = new CANNON.Material();

      const ballBody = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Sphere(0.5),
        material: ballCMaterial,
      });

      ballBody.linearDamping = 0.31;
      ballBody.angularVelocity.set(-5, 0, 0);

      world.addBody(ballBody);

      const groundBallContactMaterial = new CANNON.ContactMaterial(
        groundCMaterial,
        ballCMaterial,
        {
          friction: 0.5,
          restitution: 1,
        }
      );

      const playerBallContactMaterial = new CANNON.ContactMaterial(
        playerCMaterial,
        ballCMaterial,
        {
          friction: 0.5,
          restitution: 1,
        }
      );

      const wallBallContactMaterial = new CANNON.ContactMaterial(
        wallCMaterial,
        ballCMaterial,
        {
          friction: 0.5,
          restitution: 1,
        }
      );

      world.addContactMaterial(groundBallContactMaterial);
      world.addContactMaterial(playerBallContactMaterial);

      const forceX = this.pointX * 6000;
      const forceY = this.pointY * 5000;
      const forceZ = this.pointZ * 6000;
      const force = new CANNON.Vec3(forceX, forceY, forceZ); //How much force we apply
      const point = new CANNON.Vec3(0, 0, 0); //Where in the body we apply it
      // ballBody.position.copy(playerBody.position);

      ballBody.position.set(
        playerBody.position.x - Math.sin(player.rotation.y),
        player.position.y,
        player.position.z - Math.cos(player.rotation.y)
      );

      ballBody.applyForce(force, point);

      ballMeshes.push(ball);
      ballBodies.push(ballBody);
      if (world.bodies.length > 70) {
        for (let i = 0; i <= 10; i++) {
          world.removeBody(ballBodies[i]);
          scene.remove(ballMeshes[i]);
          ballMeshes.shift();
          ballBodies.shift();
        }
      }

      const update = () => {
        ball.position.copy(ballBody.position);
        requestAnimationFrame(update);
      };
      update();
    }
  }
  ballMesh() {
    return this.ballMesh;
  }
}

//____________________________________________________________ Desk + PC + Chair ______________________________________________________

const desk = new THREE.Group();

//---------- Desk Top ----------
const deskTopGeometry = new THREE.BoxGeometry(10, 0.2, 5);
const deskTopMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

const deskTop = new THREE.Mesh(deskTopGeometry, deskTopMaterial);

//---------- Desk Legs ----------
const deskLegGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 64);
const deskLegMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });

const leg = {
  topLeft: new THREE.Mesh(deskLegGeometry, deskLegMaterial),
  topRight: new THREE.Mesh(deskLegGeometry, deskLegMaterial),
  bottomLeft: new THREE.Mesh(deskLegGeometry, deskLegMaterial),
  bottomRight: new THREE.Mesh(deskLegGeometry, deskLegMaterial),
};

deskTop.position.set(0, 2, 0);

leg.topLeft.position.set(-4.5, 1, -2);
leg.topRight.position.set(4.5, 1, -2);
leg.bottomLeft.position.set(-4.5, 1, 2);
leg.bottomRight.position.set(4.5, 1, 2);

//---------- PC ----------
const pc = new THREE.Group();
//---------- PC Screen ----------
const pcScreenGeometry = new THREE.BoxGeometry(8, 4, 0.1);
const pcScreenMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const pcScreen = new THREE.Mesh(pcScreenGeometry, pcScreenMaterial);

pcScreen.position.set(0, 2, 0);

//---------- PC Base ----------
const pcBase = new THREE.Group();
//---------- PC Base - BackSupport ----------
const backSupportGeometry = new THREE.BoxGeometry(4, 2, 0.3);
const backSupportMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

const backSupport = new THREE.Mesh(backSupportGeometry, backSupportMaterial);

//---------- PC Base - Body ----------
const pcBaseBody = new THREE.Group();

const baseBodyGeometry = new THREE.BoxGeometry(0.5, 2, 0.2);
const baseBodyMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const baseBodyUpper = new THREE.Mesh(baseBodyGeometry, baseBodyMaterial);
baseBodyUpper.rotation.x = 0.785398;

const baseBodyMid = new THREE.Mesh(baseBodyGeometry, baseBodyMaterial);
baseBodyMid.position.set(0, -1.65, -0.68);

const baseBodyBottomGeometry = new THREE.BoxGeometry(4, 1, 0.3);
const baseBodyBottomMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

const baseBodyBottom = new THREE.Mesh(
  baseBodyBottomGeometry,
  baseBodyBottomMaterial
);
baseBodyBottom.rotation.x = 1.5708;
baseBodyBottom.position.set(0, -2.3, -0.5);

pcBaseBody.add(baseBodyUpper, baseBodyMid, baseBodyBottom);
pcBaseBody.position.set(0, -0.5, -0.8);

pcBase.add(backSupport, pcBaseBody);
pcBase.position.set(0, 2, -0.15);

pc.add(pcScreen, pcBase);
pc.position.set(0, 3, 0);

//---------- Keyboard ----------

const keyBoardGeometry = new THREE.BoxGeometry(4, 2, 0.2);
const keyBoardMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });

const keyBoard = new THREE.Mesh(keyBoardGeometry, keyBoardMaterial);
keyBoard.rotation.x = 1.5708;
keyBoard.position.set(0, 2.2, 1.2);

//---------- Mouse ----------

desk.add(
  deskTop,
  leg.topLeft,
  leg.topRight,
  leg.bottomLeft,
  leg.bottomRight,
  pc,
  keyBoard
);
desk.position.set(0, 0, 27);

scene.add(desk);

//____________________________________________________________ Interactions ___________________________________________________________

let wasLaunched = false;
window.addEventListener("mousedown", (e) => {
  const ballLaunching = new ballLauncher(playerBody, wasLaunched);
  ballLaunching.Launch();
  wasLaunched = true;
});

window.addEventListener("mouseup", (e) => {
  wasLaunched = false;
});

//____________________________________________________________ UPDATES ___________________________________________________________
const updatingFunction = () => {
  world.step(timeStep);
  floor.position.copy(groundBody.position);
  floor.quaternion.copy(groundBody.quaternion);
  // playerBody.position.y = 4;
  player.position.copy(playerBody.position);
  //   player.quaternion.copy(playerBody.quaternion);
  camera.position.copy(player.position);
  camera.position.z = player.position.z;
  //   camera.quaternion.copy(player.quaternion);

  requestAnimationFrame(updatingFunction);
};
requestAnimationFrame(updatingFunction);

export { Screen, screenDimensions, bodies, player, playerBody, cameraFocus };
