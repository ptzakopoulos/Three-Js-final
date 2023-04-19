export default () => {
  let isMoving = false;
  let isClicking = false;
  let isIn = false;

  const projects = [...document.getElementsByClassName("project")];

  const projectMovementMechanic = (e) => {
    if (
      isMoving == true &&
      isClicking == true &&
      projects.some((i) => i == e.target)
    ) {
      const pointerX = e.clientX;
      const pointerY = e.clientY;
      e.target.style.left = `${pointerX - e.target.offsetWidth / 2}px`;
      e.target.style.top = `${pointerY - e.target.offsetHeight / 2}px`;
    }
  };

  // Projects Event Listeners
  projects.forEach((prj) => {
    prj.addEventListener("mousedown", (e) => {
      isClicking = true;
      e.preventDefault();
      projectMovementMechanic(e);
    });
    prj.addEventListener("mouseenter", () => {
      isIn = true;
    });
    prj.addEventListener("mouseleave", () => {
      isIn = false;
    });
    prj.addEventListener("dblclick", (e) => {
      const browser = document.getElementById("browser");
      browser.style.display = "flex";
    });
    prj.addEventListener("contextmenu", (e) => {
      const options = document.getElementById("options");
      options.style.display = "flex";
      if (e.target.offsetLeft <= window.innerWidth / 2) {
        options.style.left = `${e.target.offsetLeft + e.target.offsetWidth}px`;
      } else {
        options.style.left = `${e.target.offsetLeft - options.offsetWidth}px`;
      }
      if (e.target.offsetTop <= window.innerHeight / 2) {
        options.style.top = `${e.target.offsetTop}px`;
      } else {
        options.style.top = `${
          e.target.offsetTop + e.target.offsetWidth - options.offsetHeight
        }px`;
      }
    });
  });

  //Window Event Listener
  window.addEventListener("mousemove", (e) => {
    isMoving = true;
    projectMovementMechanic(e);
  });

  window.addEventListener("mouseup", (e) => {
    isClicking = false;
  });

  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  window.addEventListener("mousedown", (e) => {
    const options = document.getElementById("options");
    if (e.target != options && e.target.parentElement != options) {
      options.style.display = "none";
    }
  });

  //Options Event Adjustments
  const openOption = document.getElementById("open");
  openOption.addEventListener("click", (e) => {
    const browser = document.getElementById("browser");
    browser.style.display = "flex";
  });

  //Browser - Close Button Event Listener
  const closeButton = document.getElementById("close");

  closeButton.addEventListener("click", (e) => {
    const browser = document.getElementById("browser");
    browser.style.display = "none";
  });

  //Browser - Link Event Listeners
  const link = document.getElementById("link");
  link.addEventListener("focus", (e) => {
    e.target.select();
  });
};
