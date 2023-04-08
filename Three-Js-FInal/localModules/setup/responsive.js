import {
  camera,
  renderer,
  scene,
  cssRenderer,
  cssScene,
  cssCamera,
} from "./setUp.js";

export default () => {
  const render = () => {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    cssCamera.aspect =
      cssRenderer.domElement.clientWidth / cssRenderer.domElement.clientHeight;
    camera.updateProjectionMatrix();
    cssCamera.updateProjectionMatrix();
    const width = canvas.clientHeight;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
};
