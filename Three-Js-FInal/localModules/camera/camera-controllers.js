import { camera, scene } from "../setup/setUp.js";

export default (e) => {
  let pointerX, pointerY;
  let cameraRotation;
  let forward, backward, left, right;
  let isJumping = false;
  let isPaused = false;
  let isStarted;
  let cameraSensitivity = 0.001;
  const arrow = document.getElementById("arrow");
  let options;
  let counter = 0;
  const start = document.getElementById("start");
  let altCamRight, altCamLeft;

  //Start Screen
  start.addEventListener("click", (e) => {
    document.body.requestPointerLock();
    document.getElementById("startContainer").style.display = "none";
    isPaused = undefined;
  });

  //Camera Rotation
  window.addEventListener("mousemove", (e) => {
    isPaused == undefined
      ? (camera.rotation.y -= e.movementX * cameraSensitivity)
      : NaN;
  });

  //Options events
  //Continue
  const optionEvents = [
    //Continue
    () => {
      const pauseMenu = document.getElementById("isPaused");
      pauseMenu.style.display = "none";
      isPaused = undefined;
    },
    //Sensitivity
    () => {},
    //Settings
    () => {},
    //Restart
    () => {
      location.reload();
    },
    //Exit
    () => {
      // const win = window.open("http://www.youtube.com");
      // const win = window.document;
      const win = window.open("index.html");
      win.close();
    },
  ];

  //Movement + Controllers
  const objects = [...scene.children];
  objects.shift[0]; //Camera
  objects.shift[0]; //Light
  objects.shift[0]; //Floor
  window.addEventListener("keydown", (e) => {
    const speed = 0.1;
    switch (true) {
      case e.key == "w" && !forward && !isPaused:
        forward = setInterval(() => {
          camera.position.z -= Math.cos(camera.rotation.y) * speed;
          camera.position.x -= Math.sin(camera.rotation.y) * speed;
          document.getElementById(e.key).classList.add("isPressed");
        }, 10);
        break;
      case e.key == "s" && !backward && !isPaused:
        // camera.position.z += 0.5;
        backward = setInterval(() => {
          camera.position.z += Math.cos(camera.rotation.y) * speed;
          camera.position.x += Math.sin(camera.rotation.y) * speed;
          document.getElementById(e.key).classList.add("isPressed");
        }, 10);
        break;
      case e.key == "a" && !left && !isPaused:
        // camera.position.x -= 0.5;
        left = setInterval(() => {
          camera.position.x -= Math.cos(camera.rotation.y) * speed;
          camera.position.z += Math.sin(camera.rotation.y) * speed;
          document.getElementById(e.key).classList.add("isPressed");
        }, 10);
        break;
      case e.key == "d" && !right && !isPaused:
        // camera.position.x += 0.5;
        right = setInterval(() => {
          camera.position.x += Math.cos(camera.rotation.y) * speed;
          camera.position.z -= Math.sin(camera.rotation.y) * speed;
          document.getElementById(e.key).classList.add("isPressed");
        }, 10);
        break;
      case e.key == " " && isJumping == false && !isPaused:
        jump();
        break;
      case e.key == "e":
        if (!isPaused) {
          const pauseMenu = document.getElementById("isPaused");
          pauseMenu.style.display = "flex";
          isPaused = true;
        } else {
          const pauseMenu = document.getElementById("isPaused");
          pauseMenu.style.display = "none";
          isPaused = undefined;
        }
        options = [...document.getElementsByClassName("paused-bt")];
        arrow.style.top = `${options[0].offsetTop}px`;
        arrow.style.left = `${options[0].offsetLeft - 50}px`;
        options[0].focus();
        options.forEach((option, index) => {
          option.addEventListener("click", optionEvents[index]);
        });
        break;
      case e.key == "q":
        document.body.requestPointerLock();
        break;
      case e.key == "ArrowDown" && counter < options.length - 1 && isPaused:
        counter++;
        arrow.style.top = `${options[counter].offsetTop}px`;
        arrow.style.left = `${options[counter].offsetLeft - 50}px`;
        options[counter].focus();
        break;
      case e.key == "ArrowUp" && counter > 0 && isPaused:
        counter--;
        arrow.style.top = `${options[counter].offsetTop}px`;
        arrow.style.left = `${options[counter].offsetLeft - 50}px`;
        options[counter].focus();
        break;
      case e.key == "ArrowRight" && !altCamRight:
        if (!isPaused) {
          altCamRight = setInterval(() => {
            camera.rotation.y -= cameraSensitivity * 10;
          }, 10);
        }
        break;
      case e.key == "ArrowLeft" && !altCamLeft:
        altCamLeft = setInterval(() => {
          camera.rotation.y += cameraSensitivity * 10;
        }, 10);
        break;
    }
  });

  //Movement Clear
  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "w":
        clearInterval(forward);
        forward = undefined;
        document.getElementById(e.key).classList.remove("isPressed");
        break;
      case "s":
        clearInterval(backward);
        backward = undefined;
        document.getElementById(e.key).classList.remove("isPressed");
        break;
      case "a":
        clearInterval(left);
        left = undefined;
        document.getElementById(e.key).classList.remove("isPressed");
        break;
      case "d":
        clearInterval(right);
        right = undefined;
        document.getElementById(e.key).classList.remove("isPressed");
        break;
      case "ArrowRight":
        clearInterval(altCamRight);
        altCamRight = undefined;
        break;
      case "ArrowLeft":
        clearInterval(altCamLeft);
        altCamLeft = undefined;
        break;
    }
  });

  ///Jump
  let angle = 0;
  let maxHeight = 0.7;

  const jump = () => {
    isJumping = true;
    setTimeout(() => {
      if (camera.position.y >= 4) {
        camera.position.y += Math.cos(angle) * maxHeight;
        angle += 0.09;
        jump();
      } else {
        camera.position.y = 4;
        angle = 0;
        isJumping = false;
      }
    }, 10);
  };
};
