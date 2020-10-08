let utterance,
  synth = window.speechSynthesis,
  playButton = document.getElementById("play-synthesis"),
  listeningMachine = document.getElementById("listening-machine"),
  iWord,
  altTextP;

function setupAudio() {
  if (hiddenTeamMode) {
    altTextP = document.getElementById("visible-alt-text");
    utterance = new SpeechSynthesisUtterance(data.alt_text);
    utterance.lang = "pt-BR";
    synth.onend = function () {
      stahp();
    };
    utterance.onboundary = function () {
      iWord++;
      updateHighlightedWord();
    };
  }
}

function openListeningMachine() {
  listeningMachine.style.display = "grid";
  document.body.style.overflowY = "hidden";
}

function stahp() {
  synth.cancel();
  playButton.innerText = `Ouvir a descrição`;
  let current = document.querySelector(
    `#visible-alt-text span:nth-child(${iWord})`
  );
  if (current) {
    current.classList.remove("highlighted-word");
  }
}

function closeListeningMachine() {
  listeningMachine.style.display = "none";
  document.body.style.overflowY = "scroll";
  if (synth.speaking) {
    stahp();
  }
}

function updateHighlightedWord() {
  if (iWord != 0) {
    let previous = document.querySelector(
      `#visible-alt-text span:nth-child(${iWord - 1})`
    );
    if (previous) {
      previous.classList.remove("highlighted-word");
    }
  }
  let current = document.querySelector(
    `#visible-alt-text span:nth-child(${iWord})`
  );
  if (current) {
    current.classList.add("highlighted-word");
  }
}

function readImageDescription() {
  if (!synth.speaking) {
    synth.speak(utterance);
    iWord = 0;
    updateHighlightedWord();
    playButton.innerText = `Parar de ouvir`;
  } else {
    stahp();
  }
}
