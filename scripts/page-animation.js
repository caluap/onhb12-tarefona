let diary = document.getElementById("diary");
let pages = document.querySelectorAll(".page");

let animating = false;
let animDuration = 1500;

for (let i = 0; i < pages.length; i++) {
  pages[i].addEventListener(
    "click",
    function () {
      if (i % 2 == 0) {
        advancePage(pages, i);
      } else {
        retreatPage(pages, i);
      }
    },
    false
  );
}

function advancePage(pages, i) {
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
              if (i - 1 >= 0) {
                pages[i - 1].style.visibility = "hidden";
              }
              animating = false;
            },
          });
        }
      },
    });
  }
}

function retreatPage(pages, i) {
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
              if (i + 1 < pages.length) {
                pages[i + 1].style.visibility = "hidden";
              }
              animating = false;
            },
          });
        }
      },
    });
  }
}
