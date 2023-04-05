import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer";
import { screenDimensions } from "../objects/screen.js";
//Text

class Frame {
  constructor(url) {
    this.html =
      url == undefined
        ? undefined
        : url.local == undefined
        ? undefined
        : `../views/${url.local}.html`;
    this.frame = url.online;
  }
  Create() {
    const h1 = document.createElement("div");
    h1.classList.add("html-screen");
    let innerHTML;
    this.html == undefined
      ? (innerHTML = `<iframe src='${this.frame}' frameborder='0' id='frame'></iframe>`)
      : (() => {
          fetch(this.html)
            .then((res) => res.text())
            .then((code) => {
              h1.innerHTML = code;
            });
        })();

    h1.innerHTML = innerHTML;

    const screenDisplay = new CSS3DObject(h1);
    const width = (screenDimensions.width * 0.00522) / 10;
    const height = (screenDimensions.height * 0.004675) / 5;
    screenDisplay.scale.set(width, height, 100);
    screenDisplay.position.set(0, 0, 0);

    // cssScene.add(screenDisplay);

    //Gitub Link
    const a = document.createElement("a");
    a.setAttribute("href", "http://www.github.com");
    a.setAttribute("target", "__blank");
    a.classList.add("github");
    a.textContent = "GitHub Link";
    const gitHub = new CSS3DObject(a);
    gitHub.position.set(0, 3, 0);

    gitHub.scale.set(0.0525, 0.04675, 100);

    const cssScene = new THREE.Scene();
    cssScene.add(gitHub, screenDisplay);

    return cssScene;
  }
}

export { Frame };
