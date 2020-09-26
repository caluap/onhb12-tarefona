let notebook,
  mobile = false,
  mobileBreakpoint = 900,
  pages,
  iPage = 0,
  navButs;

function detectMobile() {
  let w = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  let newlyMobile = w < mobileBreakpoint;
  // detects a change in size which should redo the pagination
  if (newlyMobile && !mobile) {
    notebook.classList.add("mobile");
    if (iPage == 1) {
      // flyleaf
      iPage++;
    }
    for (let i = 0; i < pages.length; i++) {
      if (i == iPage) {
        pages[i].setAttribute("style", "visibility: visible;");
      } else {
        pages[i].setAttribute("style", "visibility: hidden;");
      }
    }
  } else if (!newlyMobile && mobile) {
    notebook.classList.remove("mobile");
    if (iPage > 0) {
      if (iPage % 2 == 0) {
        iPage--;
        pages[iPage].setAttribute("style", "visibility: visible;");
      } else {
        if (iPage + 1 < pages.length) {
          pages[iPage + 1].setAttribute("style", "visibility: visible;");
        }
      }
    }
  }

  mobile = newlyMobile;
  updateButs();
}

(function () {
  document.fonts.load('1rem "Supermarker"').then(() => {
    window.addEventListener("resize", detectMobile);
    data.seed =
      sha256(data.team_member_1) +
      sha256(data.team_member_2) +
      sha256(data.team_member_3);
    notebook = document.getElementById("notebook");
    notebook.classList.add(`variation-${data.seed[0]}`);
    navButs = document.querySelectorAll("#navigation button");

    coverInit(data.seed, data.team_name);

    titlePage();
    imgPage();
    innerPages();
    prepareAnimations();
    detectMobile();
    notebook.classList.remove("loading");
  });
})();
