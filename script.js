let canvas, ctx;

let width, height;

let shapes = [
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
  ],
  [
    { x: 0, y: 0.5 },
    { x: 0.5, y: 1 },
    { x: 1, y: 0.5 },
    { x: 0.5, y: 0 },
  ],
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0.5, y: 0.5 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: 0.5, y: 0.5 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0.5, y: 0.5 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 0.5, y: 0.5 },
  ],
];

function init() {
  canvas = document.getElementById("cover-canvas");
  ctx = canvas.getContext("2d");
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  let s = 40,
    cols = width / s,
    rows = height / s;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let i = x + y * cols;
      let color = i % 2 == 0 ? "red" : "green";
      let iShape = i % 11;
      drawShape(x, y, s, color, "white", iShape);
    }
  }

  drawGrid(cols, rows, s);
}

function processShape(
  shape,
  initX,
  initY,
  s,
  beginPath = true,
  closePath = true
) {
  if (beginPath) {
    ctx.beginPath();
  }
  for (let i = 0; i < shape.length; i++) {
    let x = shape[i].x * s + initX,
      y = shape[i].y * s + initY;
    if (i == 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  if (closePath) {
    ctx.closePath();
  }
}

function drawGrid(cols, rows, size) {
  ctx.strokeStyle = "#666";
  for (let x = 1; x < cols; x++) {
    ctx.beginPath();
    ctx.moveTo(x * size, 0);
    ctx.lineTo(x * size, height);
    ctx.stroke();
  }
  for (let y = 1; y < rows; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * size);
    ctx.lineTo(width, y * size);
    ctx.stroke();
  }
}

function drawShape(
  ix,
  iy,
  size,
  color = "black",
  bgcolor = "white",
  iShape = 0
) {
  let x = ix * size,
    y = iy * size,
    cx = x + size / 2,
    cy = y + size / 2;

  ctx.fillStyle = color;
  switch (iShape) {
    case 0: // square
      processShape(shapes[0], x, y, size); // square
      ctx.fill();
      break;
    case 1: // square with cut out circle
      processShape(shapes[0], x, y, size); // square
      ctx.arc(cx, cy, size * 0.5 * 0.5, 0, Math.PI * 2, false);
      ctx.fill();
      break;
    case 2:
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2, false);
      ctx.fill();
      break;
      break;
    case 3: // donut with 1/2 radius hole
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2, false);
      ctx.arc(cx, cy, size * 0.5 * 0.5, 0, Math.PI * 2, false);
      ctx.fill("evenodd");
      break;
    case 4: // donut with 3/4 radius hole
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2, false);
      ctx.arc(cx, cy, size * 0.5 * 0.75, 0, Math.PI * 2, false);
      ctx.fill("evenodd");
      break;
    case 5: // donut with 1/4 radius hole
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2, false);
      ctx.arc(cx, cy, size * 0.5 * 0.25, 0, Math.PI * 2, false);
      ctx.fill("evenodd");
      break;
    case 6: // diamond
      processShape(shapes[1], x, y, size);
      ctx.fill();
      break;
    case 7: // diamond with round hole
      processShape(shapes[1], x, y, size);
      ctx.arc(cx, cy, size * 0.5 * 0.25, 0, Math.PI * 2);
      ctx.fill("evenodd");
      break;
    case 8: // square with diamond shaped hole
      processShape(shapes[0], x, y, size);
      processShape(
        shapes[1],
        x + size * 0.1464796582,
        y + size * 0.1464796582,
        size * 0.7071335686,
        false,
        false
      );
      ctx.fill("evenodd");
      break;
    case 9:
      processShape(shapes[2], x, y, size);
      ctx.fill();
      break;
    case 10:
      processShape(shapes[3], x, y, size);
      ctx.fill();
      break;
  }
}
