let notebook;

document.fonts.load('1rem "Supermarker"').then(() => {
  let seedString = "";
  for (let i = 0; i < rows * cols; i++) {
    seedString += Number(randInt(0, 15)).toString(16);
  }
  notebook = document.getElementById("notebook");
  console.log(seedString);
  notebook.classList.add(`variation-${seedString[0]}`);
  coverInit(seedString);
  // diary.classList.remove("loading");
});
