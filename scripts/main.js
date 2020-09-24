let notebook;

// source: https://stackoverflow.com/a/8943487/888094
function linkify(text) {
  if (typeof text !== "string") {
    return;
  }

  let urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return text.replace(urlRegex, function (url) {
    return `<a href="${url}" target="_blank">${url}</a>`;
  });
}

function titlePage() {
  let title = data.title,
    authorship,
    themes,
    epigraph = data.epigraph,
    epigraphsAuthorship = data.epigraph_authorship;
  // authors
  authorship = `Escrito por ${data.alleged_team_member_1[0]}., ${data.alleged_team_member_2[0]}. e ${data.alleged_team_member_3[0]}., sob orientação de ${data.alleged_team_advisor[0]}.`;

  // themes
  themes = "Uma crônica sobre <br />";
  for (let i = 0; i < data.themes.length; i++) {
    let theme = data.themes[i].split(" ").join("&nbsp;");
    if (i == data.themes.length - 1) {
      // last one
      themes += `e ${theme}.`;
    } else {
      themes += `${theme}, `;
    }
  }

  let titlePage = document.getElementById("title-page");
  titlePage.querySelector(".title").innerHTML = title;
  titlePage.querySelector(".authorship").innerHTML = authorship;
  titlePage.querySelector(".theme").innerHTML = themes;
  titlePage.querySelector(".epigraph .main-text").innerHTML = epigraph;
  titlePage.querySelector(
    ".epigraph .epigraph-author"
  ).innerHTML = epigraphsAuthorship;
}

function innerPages() {}

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
  setTimeout(() => {
    notebook.classList.remove("loading");
  }, 2000);
});
