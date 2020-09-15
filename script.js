let canvas, ctx;

function init() {
  canvas = document.getElementById("cover-canvas");
  ctx = canvas.getContext("2d");

  let width = canvas.offsetWidth,
    height = canvas.offsetHeight,
    s = 40,
    cols = width / s,
    rows = height / s;

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let color = (x + y) % 2 == 0 ? "red" : "green";
      drawShape(x, y, s, s, color);
    }
  }
}

function drawShape(
  ix,
  iy,
  width,
  height,
  color = "black",
  bgcolor = "white",
  shapeIndex = 0
) {
  let x = ix * width,
    y = iy * height;

  ctx.fillStyle = color;
  switch (shapeIndex) {
    // square
    case 0:
      ctx.fillRect(x, y, width, height);
      break;
  }
}
