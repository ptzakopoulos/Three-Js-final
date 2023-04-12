import * as THREE from "three";
import { camera, scene } from "./setup/setUp.js";
export default () => {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let target;
  window.addEventListener("mousemove", (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);
    target = raycaster.intersectObjects(scene.children);
  });

  const objects = [...scene.children];

  objects.shift(); //Camera
  objects.shift(); //Light
  objects.shift(); //Floor

  const objectDetect = () => {
    objects.forEach((e) => {
      //link focus
      if (
        camera.position.x <= e.position.x + 4 &&
        camera.position.x >= e.position.x - 4 &&
        camera.position.z <= e.position.z + 6 &&
        camera.position.z >= e.position.z - 6
      ) {
        const githubLink = e.children.find((r) => r.name == "Github");
        githubLink == undefined ? NaN : githubLink.element.focus();
      } else {
        const githubLink = e.children.find((r) => r.name == "Github");
        githubLink == undefined ? NaN : githubLink.element.blur();
      }
    });
    requestAnimationFrame(objectDetect);
  };
  requestAnimationFrame(objectDetect);
  return target;
};
