let diary = document.getElementById("diary");
let pages = document.querySelectorAll(".page");

for (let i = 0; i < pages.length; i++) {
  pages[i].addEventListener(
    "click",
    function () {
      let next = null,
        nextPlusOne = null;
      if (i + 1 < pages.length) {
        next = pages[i + 1];
      }
      if (i + 2 < pages.length) {
        nextPlusOne = pages[i + 2];
      }

      if (i % 2 == 0) {
        advancePage(pages[i], next, nextPlusOne);
      } else {
        let previous = null,
          previousMinusOne = null;
        if (i - 1 > 0) {
          previous = pages[i - 1];
        }
        if (i - 2 > 0) {
          previous = pages[i - 2];
        }

        retreatPage(pages[i], previous, previousMinusOne, next, nextPlusOne);
      }
    },
    false
  );
}

function advancePage(current, next, nextPlustOne) {
  console.log(">>");
  anime({
    targets: current,
    rotateY: [0, -90],
    duration: 1500,
    easing: "easeInSine",
    begin: function (anim) {
      current.style.zIndex = "100";
      if (nextPlustOne) {
        nextPlustOne.style.display = "block";
      }
    },
    complete: function (anim) {
      current.style.display = "none";
      current.style.zIndex = "1";
      if (next) {
        anime({
          targets: next,
          rotateY: [90, 0],
          duration: 1500,
          easing: "easeOutSine",
          begin: function (anim) {
            next.style.display = "block";
          },
        });
      }
    },
  });
}

function retreatPage(current, previous, previousMinusOne, next, nextPlusOne) {
  console.log("<<");
  anime({
    targets: current,
    rotateY: [0, 90],
    duration: 1500,
    easing: "easeInSine",
    begin: function (anim) {
      current.style.zIndex = "100";
      if (previousMinusOne) {
        previousMinusOne.style.display = "block";
      }
    },
    complete: function (anim) {
      current.style.display = "none";
      current.style.zIndex = "1";
      if (next) {
        next.style.diary = "none";
      }
      if (previous) {
        console.log(previous);
        previous.style.display = "block";
        anime({
          targets: previous,
          rotateY: [-90, 0],
          duration: 1500,
          easing: "easeOutSine",
        });
      }
    },
  });
}
