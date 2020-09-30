let utterance,
  synth = window.speechSynthesis,
  playButton = document.getElementById("play-synthesis"),
  listeningMachine = document.getElementById("listening-machine");

function setupAudio() {
  if (hiddenTeamMode) {
    utterance = new SpeechSynthesisUtterance(data.alt_text);
    utterance.lang = "pt-BR";
    synth.onend = function () {
      playButton.innerText = `Ouvir a descrição`;
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
}

function closeListeningMachine() {
  listeningMachine.style.display = "none";
  document.body.style.overflowY = "scroll";
  if (synth.speaking) {
    stahp();
  }
}

function readImageDescription() {
  if (!synth.speaking) {
    synth.speak(utterance);
    playButton.innerText = `Parar de ouvir`;
  } else {
    stahp();
  }
}
