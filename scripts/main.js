let notebook;

document.fonts.load('1rem "Supermarker"').then(() => {
  data.seed =
    sha256(data.team_member_1) +
    sha256(data.team_member_2) +
    sha256(data.team_member_3);
  notebook = document.getElementById("notebook");
  notebook.classList.add(`variation-${data.seed[0]}`);

  setTimeout(() => {
    coverInit(data.seed, data.team_name);
  }, 1200);

  titlePage();
  innerPages();
  prepareAnimations();
  setTimeout(() => {
    notebook.classList.remove("loading");
  }, 2000);
});
