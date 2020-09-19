let diary = document.getElementById("diary");
let pages = document.querySelectorAll(".page");

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
  anime({
    targets: pages[i],
    rotateY: [0, -90],
    duration: 1500,
    easing: "easeInSine",
    begin: function (anim) {
      pages[i].style.zIndex = "100";
      if (i + 2 < pages.length) {
        pages[i + 2].style.display = "block";
      }
    },
    complete: function (anim) {
      pages[i].style.display = "none";
      pages[i].style.zIndex = "1";
      if (i + 1 < pages.length) {
        anime({
          targets: pages[i + 1],
          rotateY: [90, 0],
          duration: 1500,
          easing: "easeOutSine",
          begin: function (anim) {
            pages[i + 1].style.display = "block";
          },
          complete: function (anim) {
            if (i - 1 >= 0) {
              pages[i - 1].style.display = "none";
            }
          },
        });
      }
    },
  });
}

function retreatPage(pages, i) {
  anime({
    targets: pages[i],
    rotateY: [0, 90],
    duration: 1500,
    easing: "easeInSine",
    begin: function (anim) {
      pages[i].style.zIndex = "100";
      if (i - 2 >= 0) {
        pages[i - 2].style.display = "block";
      }
    },
    complete: function (anim) {
      pages[i].style.display = "none";
      pages[i].style.zIndex = "1";
      if (i - 1 >= 0) {
        pages[i - 1].style.display = "block";
        pages[i - 1].style.display = "100";
        anime({
          targets: pages[i - 1],
          rotateY: [-90, 0],
          duration: 1500,
          easing: "easeOutSine",
          complete: function (anim) {
            if (i + 1 < pages.length) {
              pages[i + 1].style.display = "none";
            }
          },
        });
      }
    },
  });
}
