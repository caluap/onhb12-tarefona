let canvas, ctx;

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
];

function init() {
  canvas = document.getElementById("cover-canvas");
  ctx = canvas.getContext("2d");

  let width = canvas.offsetWidth,
    height = canvas.offsetHeight,
    s = 40,
    cols = width / s,
    rows = height / s;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let i = x + y * cols;
      let color = i % 2 == 0 ? "red" : "green";
      let iShape = i % 3;
      drawShape(x, y, s, color, "white", iShape);
    }
  }
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

function drawShape(
  ix,
  iy,
  size,
  color = "black",
  bgcolor = "white",
  shapeIndex = 0
) {
  let x = ix * size,
    y = iy * size,
    cx = x + size / 2,
    cy = y + size / 2;

  ctx.fillStyle = color;
  switch (shapeIndex) {
    case 0: // square
      ctx.beginPath();
      processShape(shapes[0], x, y, size); // square
      ctx.fill();
      break;
    case 1: // square with cut out circle
      ctx.beginPath();
      processShape(shapes[0], x, y, size); // square
      ctx.arc(cx, cy, size * 0.5 * 0.5, 0, Math.PI * 2, false);
      ctx.fill();
      break;
    case 2: // donut with 1/2 radius hole
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2, false);
      ctx.arc(cx, cy, size * 0.5 * 0.5, 0, Math.PI * 2, false);
      ctx.fill("evenodd");
      break;
    case 3: // donut with 3/4 radius hole
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2, false);
      ctx.arc(cx, cy, size * 0.5 * 0.75, 0, Math.PI * 2, false);
      ctx.fill("evenodd");
      break;
    case 4: // donut with 1/4 radius hole
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2, false);
      ctx.arc(cx, cy, size * 0.5 * 0.25, 0, Math.PI * 2, false);
      ctx.fill("evenodd");
      break;
    case 5: // diamond
      ctx.beginPath();
      processShape(shapes[1], x, y, size);
      ctx.fill();
      break;
    case 6: // square with diamond shaped hole
      ctx.beginPath();
      processShape(shapes[0], x, y, size, false, true);
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
  }
}
