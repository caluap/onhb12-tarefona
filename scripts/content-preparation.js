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

function innerPages() {
  let sizeCalcBox = document.getElementById("size-calc-box"),
    lineHeight = sizeCalcBox.offsetHeight,
    lineLimit = 20;

  sizeCalcBox.innerHTML = "";
  let paragraphs = [];
  let parts = data.main_text.split("\n");
  parts.forEach((part) => {
    let trimmedString = part.trim();
    let lastSpace = trimmedString.lastIndexOf(" ");
    if (lastSpace != -1) {
      trimmedString =
        trimmedString.substring(0, lastSpace) +
        `\xa0` +
        trimmedString.substring(lastSpace + 1);
    }
    if (trimmedString.length > 0) {
      paragraphs.push(trimmedString);
    }
  });

  let pages = [],
    currentText;

  paragraphs.forEach((paragraph) => {
    currentText = paragraph;
    let hasEndedProcessing = false;
    do {
      // TODO: needs to detect if this is the start of a new paragraph in a
      //  new page and, if so, it needs to have indentation!
      let node = document.createElement("p");
      node.innerHTML = currentText;
      sizeCalcBox.appendChild(node);
      let lines = sizeCalcBox.offsetHeight / lineHeight;
      if (lines > lineLimit) {
        // Breaks it word by word until the limit is reached.
        sizeCalcBox.lastChild.innerHTML = "";
        let words = currentText.split(" ");
        let foundBreakpoint = false;
        let i = 0;
        // appends each word until the line limit is reached.
        // saves the page and continues from where it stopped
        for (; i < words.length; i++) {
          if (!foundBreakpoint) {
            let oldS = sizeCalcBox.lastChild.innerHTML;
            sizeCalcBox.lastChild.innerHTML += words[i] + " ";
            lines = sizeCalcBox.offsetHeight / lineHeight;
            if (lines > lineLimit) {
              foundBreakpoint = true;
              sizeCalcBox.lastChild.innerHTML = oldS;
              pages.push(linkify(sizeCalcBox.innerHTML));
              sizeCalcBox.innerHTML = ``;
              currentText = words[i];
            }
          } else {
            currentText += " " + words[i];
          }
        }
      } else {
        hasEndedProcessing = true;
      }
    } while (!hasEndedProcessing);
  });

  // has ended the week so if there's still stuff in the
  // sizeCalcBox “buffer” it needs to be saved as well.
  if (sizeCalcBox.innerHTML != ``) {
    pages.push(linkify(sizeCalcBox.innerHTML));
    sizeCalcBox.innerHTML = ``;
  }

  pages.forEach((page) => {
    let pageNode = document.createElement("div");
    pageNode.classList.add("page");
    let pageContentBox = document.createElement("div");
    pageContentBox.classList.add("page-content-box");
    pageContentBox.innerHTML = page;
    pageNode.appendChild(pageContentBox);
    notebook.appendChild(pageNode);
  });

  let pageNum = document.querySelectorAll(".page").length;

  // needs an empty page so the flyleaf lines up with the back-cover
  if (pageNum % 2 != 0) {
    let pageNode = document.createElement("div");
    pageNode.classList.add("page");
    notebook.appendChild(pageNode);
  }

  let node = document.createElement("div");
  node.classList.add("page", "flyleaf");
  notebook.appendChild(node);

  node = document.createElement("div");
  node.classList.add("page", "back-cover");
  notebook.appendChild(node);
}
