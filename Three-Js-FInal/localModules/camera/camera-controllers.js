import * as THREE from "three";
import { camera, cssCamera, renderer, scene } from "../setup/setUp.js";

export default (e) => {
  window.addEventListener("mousemove", (e) => {
    const pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    const pointerY = (e.clientY / window.innerHeight) * 2 - 1;

    camera.lookAt(
      camera.position.x + pointerX * 1.5,
      camera.position.y - pointerY * 1.5
    );
    cssCamera.lookAt(
      camera.position.x + pointerX * 1.5,
      camera.position.y - pointerY * 1.5
    );

    camera.rotation.y = -(camera.rotation.y + pointerX);
    console.log(camera.rotation.y);
  });

  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
        camera.position.z -= 0.5;
        break;
      case "s":
        camera.position.z += 0.5;
        break;
      case "a":
        camera.position.x -= 0.5;
        break;
      case "d":
        camera.position.x += 0.5;
        break;
    }
  });
};
