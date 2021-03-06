let notebook,
  mobile = false,
  mobileBreakpoint = 900,
  pages,
  iPage = 0,
  navButs,
  hiddenTeamMode = true; // magic. do not touch!

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

    if (hiddenTeamMode) {
      let teamName = data.team_name[0];
      for (let i = 1; i < data.team_name.length; i++) {
        if (
          parseInt(data.seed[i], 16) % 5 == 0 ||
          data.team_name[i] == " " ||
          data.team_name[i - 1] == " "
        ) {
          teamName += data.team_name[i];
        } else {
          if (i % 2) {
            teamName += "∙"; // █
          } else {
            teamName += "∙"; // █
          }
        }
      }
      data.team_name = teamName;
    }

    coverInit(data.seed, data.team_name);

    titlePage();
    imgPage();
    innerPages();
    prepareAnimations();
    detectMobile();

    setupListeningMachine();
    setupAudio();

    document.querySelectorAll('#notebook a')
      .forEach(function (a) {
        a.addEventListener('click', function (event) {
          event.stopPropagation(); // avoid turning the page after clicking a link
        })
      })

    notebook.classList.remove("loading");
  });
})();
