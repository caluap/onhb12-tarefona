let imgPageEl = document.getElementById("img-page"),
  sizeCalcBox = document.getElementById("size-calc-box"),
  lineHeight = sizeCalcBox.offsetHeight;
lineLimit = 19;

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
    currentText,
    indent = false;

  paragraphs.forEach((paragraph) => {
    currentText = paragraph;
    let hasEndedProcessing = false;
    do {
      let node = document.createElement("p");
      if (indent) {
        node.setAttribute("class", "indented");
      }
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
              if (i == 0) {
                indent = true;
              } else {
                indent = false;
              }
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

  let lastEl = imgPageEl;

  pages.forEach((page) => {
    let pageNode = document.createElement("div");
    pageNode.classList.add("page");
    let pageContentBox = document.createElement("div");
    pageContentBox.classList.add("page-content-box");
    pageContentBox.innerHTML = page;
    pageNode.appendChild(pageContentBox);
    lastEl.insertAdjacentElement("afterend", pageNode);
    lastEl = pageNode;
  });

  let pageNum = document.querySelectorAll(".page").length;

  // needs an empty page so the flyleaf lines up with the back-cover
  if (pageNum % 2 != 0) {
    let pageNode = document.createElement("div");
    pageNode.classList.add("page");
    lastEl.insertAdjacentElement("afterend", pageNode);
  }
}

function setupImg(
  idCaptionEl,
  captionPs,
  imgSrc,
  imgAlt,
  imgContainerEl,
  tape
) {
  let captionEl = document.getElementById(idCaptionEl);
  captionPs.forEach((text) => {
    let p = document.createElement("p");
    p.innerHTML = text;
    captionEl.appendChild(p);
  });

  let maxHeight = lineHeight * lineLimit - captionEl.offsetHeight - tape * 2;
  let img = document.createElement("img");
  img.setAttribute("src", imgSrc);
  img.setAttribute("alt", imgAlt);
  img.setAttribute("style", `max-height: ${maxHeight}px`);
  img.onload = () => {
    let figC = document.getElementById(imgContainerEl);
    figC.appendChild(img);
    let ratio = img.offsetHeight / img.offsetWidth;
    let width = maxHeight / ratio;
    figC.setAttribute(
      "style",
      `width: ${width}px; max-width: ${sizeCalcBox.offsetWidth}px;`
    );
  };
}

function imgPage() {
  let tape = document.querySelector(".tape").offsetHeight;

  // sets up “main image” page
  setupImg(
    "caption",
    [linkify(data.img_caption)],
    data.main_img,
    data.alt_text,
    "main-img",
    tape
  );

  // sets up the page that presents the team.
  let credits = [
    `Crônica criada pela equipe <span class="team-name">“${data.team_name}”</span>, de <span class="place-of-origin">${data.city}, ${data.state}.</span>`,
    `Participaram da equipe <span class="team-member">${data.alleged_team_member_1}</span>, <span class="team-member">${data.alleged_team_member_2}</span>, e <span class="team-member">${data.alleged_team_member_3}</span>, sob orientação de <span class="team-member">${data.alleged_team_advisor}</span>.`,
  ];
  setupImg(
    "about-the-team",
    credits,
    data.team_picture,
    data.team_picture_description,
    "team-img",
    tape
  );
}
