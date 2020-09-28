let animating = false;
let animDuration = 1500;

function prepareAnimations() {
  pages = document.querySelectorAll(".page");
  for (let i = 0; i < pages.length; i++) {
    pages[i].addEventListener(
      "click",
      function () {
        if (i % 2 == 0) {
          advancePage(i);
        } else {
          retreatPage(i);
        }
      },
      false
    );
  }
}

function advancePage(i = null) {
  if (mobile) {
    if (i + 1 < pages.length) {
      let newI;
      if (pages[i + 1].classList.contains("flyleaf")) {
        newI = i + 2;
      } else {
        newI = i + 1;
      }
      pages[i].style.visibility = "hidden";
      pages[newI].style.visibility = "visible";
      iPage = newI;
    }
    updateButs();
    return;
  }
  if (!animating) {
    animating = true;
    anime({
      targets: pages[i],
      rotateY: [0, -90],
      duration: animDuration / 2,
      easing: "easeInQuad",
      begin: function (anim) {
        pages[i].style.zIndex = "100";
        if (i + 2 < pages.length) {
          pages[i + 2].style.visibility = "visible";
        }
      },
      complete: function (anim) {
        if (mobile) {
          updateButs();
          animating = false;
          return;
        }
        pages[i].style.visibility = "hidden";
        pages[i].style.zIndex = "1";
        if (i + 1 < pages.length) {
          anime({
            targets: pages[i + 1],
            rotateY: [90, 0],
            duration: animDuration / 2,
            easing: "easeOutQuad",
            begin: function (anim) {
              pages[i + 1].style.visibility = "visible";
            },
            complete: function (anim) {
              if (mobile) {
                updateButs();
                animating = false;
                return;
              }
              if (i - 1 >= 0) {
                pages[i - 1].style.visibility = "hidden";
              }
              iPage = i + 1;
              animating = false;
            },
          });
        }
      },
    });
  }
}

function retreatPage(i = null) {
  if (mobile && i != null) {
    advancePage(i);
    return;
  }
  if (!animating) {
    animating = true;
    anime({
      targets: pages[i],
      rotateY: [0, 90],
      duration: animDuration / 2,
      easing: "easeInQuad",
      begin: function (anim) {
        pages[i].style.zIndex = "100";
        if (i - 2 >= 0) {
          pages[i - 2].style.visibility = "visible";
        }
      },
      complete: function (anim) {
        if (mobile) {
          updateButs();
          animating = false;
          return;
        }
        pages[i].style.visibility = "hidden";
        pages[i].style.zIndex = "1";
        if (i - 1 >= 0) {
          pages[i - 1].style.visibility = "visible";
          pages[i - 1].style.display = "100";
          anime({
            targets: pages[i - 1],
            rotateY: [-90, 0],
            duration: animDuration / 2,
            easing: "easeOutQuad",
            complete: function (anim) {
              if (mobile) {
                updateButs();
                animating = false;
                return;
              }
              if (i + 1 < pages.length) {
                pages[i + 1].style.visibility = "hidden";
              }
              iPage = i - 2;
              animating = false;
            },
          });
        }
      },
    });
  }
}

function updateButs() {
  if (iPage == 0) {
    navButs[0].style.visibility = "hidden";
  } else if (iPage == pages.length - 1) {
    navButs[1].style.visibility = "hidden";
  } else {
    navButs[0].style.visibility = "visible";
    navButs[1].style.visibility = "visible";
  }
}

function flipPage(delta) {
  if (delta == 1 && (iPage == 0 || iPage == pages.length - 3)) {
    delta = 2;
  }
  if (delta == -1 && (iPage == pages.length - 1 || iPage == 2)) {
    delta = -2;
  }
  let newI = iPage + delta;
  if (newI >= 0 && newI < pages.length) {
    pages[iPage].setAttribute("style", "visibility: hidden;");
    iPage = newI;
    pages[iPage].setAttribute("style", "visibility: visible;");
  }
  updateButs();
}
