let canvas, ctx;

let seedString;

let width,
  height,
  s = 56,
  cols = 8,
  rows = 12,
  margin = 0.125 * s;

let logoX = 0,
  logoY = 11;

let mainColors = ["#babec4", "#a9acaf"];
let highlightColors = [
  "#be1e2d",
  "#c2b59b",
  "#662d91",
  "#f5ba3d",
  "#ffdd00",
  "#e3038c",
  "#8dc63f",
  "#37673f",
  "#f26422",
  "#ffed96",
  "#a97c50",
  "#8299ce",
  "#abc8e9",
  "#f59cb0",
  "#db5c87",
  "#00bbd6",
  "#603913",
  "#414042",
  "#0083ca",
  "#00a651",
  "#d7e1f2",
  "#3b4d81",
  "#65c298",
  "#ed1c24",
  "#00a9a3",
];

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
  [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ],
];

// https://stackoverflow.com/a/7838871/
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};

function hash(str) {
  return Array.from(str).reduce(
    (hash, char) => 0 | (31 * hash + char.charCodeAt(0)),
    0
  );
}

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function findGetParameter(parameterName) {
  var result = null,
    tmp = [];
  location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}

function coverInit(seed, teamName) {
  canvas = document.getElementById("cover-canvas");
  ctx = canvas.getContext("2d");
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;

  ctx.fillStyle = "#f1f2f3";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#f1f2f3";
  ctx.fillRect(margin, margin, width - 2 * margin, height - 2 * margin);

  ctx.translate(margin, margin);

  seedString = seed;

  let selectedHlColors = [];
  let nC = (parseInt(seedString[3], 16) % 3) + 1;
  let iC = 0;
  while (selectedHlColors.length < nC && iC < seedString.length) {
    let tempColor =
      highlightColors[parseInt(seedString[iC], 16) % highlightColors.length];
    if (selectedHlColors.indexOf(tempColor) == -1) {
      selectedHlColors.push(tempColor);
    }
    iC++;
  }

  let family, complementaryFamily;

  family = parseInt(seedString[0], 16) % 8;
  complementaryFamily = family;
  for (let i = 0; i < seedString.length; i++) {
    if (parseInt(seedString[i], 16) % 8 != family) {
      complementaryFamily = parseInt(seedString[i], 16) % 8;
    }
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // logo
      if (y == logoY && x == logoX) {
        continue;
      }
      let i = x + y * cols;
      let char = parseInt(seedString[i % seedString.length], 16);

      if ([0, 1, 2, 3, 4, 5, 6].indexOf(char) != -1) {
        continue;
      }

      let helperHash = hash(
        char + " this here gives me some variation " + char
      ).toString(16);

      let color;
      if (["0", "1", "2"].indexOf(helperHash[2]) != -1) {
        color = selectedHlColors[i % selectedHlColors.length];
      } else {
        color = mainColors[i % mainColors.length];
      }

      let currentFamily;
      if (["0"].indexOf(helperHash[3]) != -1) {
        currentFamily = complementaryFamily;
      } else {
        currentFamily = family;
      }

      drawShape(x, y, s, color, currentFamily, char);
    }
  }

  // drawGrid(cols, rows, s);
  drawLogo();
  drawLabel(teamName);
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
    ctx.lineTo(x * size, rows * size);
    ctx.stroke();
  }
  for (let y = 1; y < rows; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * size);
    ctx.lineTo(cols * size, y * size);
    ctx.stroke();
  }
}

function drawLabel(teamName = "—") {
  let angle = 1 - (2 * parseInt(seedString[0], 16)) / 16;

  ctx.rotate((angle * Math.PI) / 180);
  ctx.save();
  ctx.fillStyle = "#f1f0eb";
  ctx.shadowBlur = 2;
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.roundRect(2.5 * s, 9.5 * s, 5 * s, 2 * s, s / 6).fill();
  ctx.restore();
  ctx.strokeStyle = "#ff0000";
  ctx.lineWidth = 0.5;

  let M = 0.125,
    m = M / 3;
  for (let i = 0; i < 2; i++) {
    let x = (2.5 + M) * s + i * m * s,
      y = (9.5 + M) * s + i * m * s,
      w = (5 - 2 * M) * s - i * m * s * 2,
      h = (2 - 2 * M) * s - i * m * s * 2;
    ctx.roundRect(x, y, w, h, s / 8).stroke();
  }

  // ctx.fillStyle = "#8f2540";
  ctx.fillStyle = "#1b339c";
  ctx.textBaseline = "top";
  ctx.font = "19px Supermarker";
  ctx.fillText("Caderno de Crônicas", (2.55 + 2 * M) * s, (9.55 + 2 * M) * s);

  ctx.fillStyle = "#223066";
  teamName = `Equipe “${teamName}”`;
  let maxWidth = (5 - 4 * M) * s,
    words = teamName.split(" "),
    lines = 0,
    currentLine = "";

  for (let i = 0; i < words.length; i++) {
    let w = ctx.measureText(currentLine + " " + words[i]).width;
    if (w > maxWidth) {
      // prints current line
      if (lines < 2) {
        ctx.fillText(
          currentLine,
          (2.55 + 2 * M) * s,
          (9.55 + 0.5 + 2 * M) * s + lines * 0.5 * s
        );
      }
      lines++;
      currentLine = words[i] + " ";
    } else {
      currentLine += words[i] + " ";
    }
  }

  if (lines < 2) {
    ctx.fillText(
      currentLine,
      (2.55 + 2 * M) * s,
      (9.55 + 0.5 + 2 * M) * s + lines * 0.5 * s
    );
  }

  ctx.rotate((-angle * Math.PI) / 180);
}

function drawLogo() {
  let img = new Image();
  img.src = "../img/onhb.svg";
  img.addEventListener(
    "load",
    () => {
      // ctx.fillStyle = "#ffffff";
      // ctx.fillRect(s * 0, s * 11, s, s);
      ctx.drawImage(
        img,
        s * (0.2 + logoX),
        s * (0.2 + logoY),
        s * 0.6,
        s * 0.6
      );
    },
    false
  );
}

function drawShape(ix, iy, size, color = "black", shapeFamily = 0, iShape = 0) {
  let x = ix * size,
    y = iy * size,
    cx = x + size / 2,
    cy = y + size / 2;

  let shapeFamilyCounts = [4, 4, 4, 2, 5, 4, 2, 2];
  iShape = iShape % shapeFamilyCounts[shapeFamily];
  ctx.fillStyle = color;

  // trinagles
  if (shapeFamily == 0) {
    switch (iShape) {
      case 0: //  _|
        processShape(shapes[4], x, y, size);
        ctx.fill();
        break;
      case 1: // |‾
        processShape(shapes[5], x, y, size);
        ctx.fill();
        break;
      case 2: // |_
        processShape(shapes[6], x, y, size);
        ctx.fill();
        break;
      case 3: // ‾|
        processShape(shapes[7], x, y, size);
        ctx.fill();
        break;
    }
  }

  // circles
  if (shapeFamily == 1) {
    switch (iShape) {
      case 0: // circle
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2, false);
        ctx.fill();
        break;
      case 1: // donut with 1/2 radius hole
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2, false);
        ctx.arc(cx, cy, size * 0.5 * 0.5, 0, Math.PI * 2, false);
        ctx.fill("evenodd");
        break;
      case 2: // donut with 3/4 radius hole
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2, false);
        ctx.arc(cx, cy, size * 0.5 * 0.75, 0, Math.PI * 2, false);
        ctx.fill("evenodd");
        break;
      case 3: // donut with 1/4 radius hole
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2, false);
        ctx.arc(cx, cy, size * 0.5 * 0.25, 0, Math.PI * 2, false);
        ctx.fill("evenodd");
        break;
    }
  }

  // semi-circles
  if (shapeFamily == 2) {
    switch (iShape) {
      case 0:
        // semi circles looking right
        ctx.beginPath();
        ctx.arc(x, cy, size * 0.5, Math.PI / 2, (Math.PI * 3) / 2, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.5, Math.PI / 2, (Math.PI * 3) / 2, true);
        ctx.fill();
        break;
      case 1:
        // semi circles looking left
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.5, Math.PI / 2, (Math.PI * 3) / 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + size, cy, size * 0.5, Math.PI / 2, (Math.PI * 3) / 2);
        ctx.fill();
        break;
      case 2:
        // semi circles looking down
        ctx.beginPath();
        ctx.arc(cx, y, size * 0.5, 0, Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.5, 0, Math.PI);
        ctx.fill();
        break;
      case 3:
        // semi circles looking up
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.5, 0, Math.PI, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, y + size, size * 0.5, 0, Math.PI, true);
        ctx.fill();
        break;
    }
  }

  // semi-circles that look at each other
  if (shapeFamily == 3) {
    switch (iShape) {
      case 0:
        // semi-circles vertically looking at each other
        ctx.beginPath();
        ctx.arc(cx, y, size * 0.5, 0, Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, y + size, size * 0.5, 0, Math.PI, true);
        ctx.fill();
        break;
      case 1:
        // semi-circles horizontally looking at each other
        ctx.beginPath();
        ctx.arc(x, cy, size * 0.5, Math.PI / 2, (Math.PI * 3) / 2, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + size, cy, size * 0.5, Math.PI / 2, (Math.PI * 3) / 2);
        ctx.fill();
        break;
    }
  }

  // squares
  if (shapeFamily == 4) {
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
      case 2: // diamond
        processShape(shapes[1], x, y, size);
        ctx.fill();
        break;
      case 3: // diamond with round hole
        processShape(shapes[1], x, y, size);
        ctx.arc(cx, cy, size * 0.5 * 0.25, 0, Math.PI * 2);
        ctx.fill("evenodd");
        break;
      case 4: // square with diamond shaped hole
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
    }
  }

  // circle+squares
  if (shapeFamily == 5) {
    switch (iShape) {
      case 0:
        // rect + semi circle looking right
        ctx.fillRect(x, y, size / 2, size);
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2, true);
        ctx.fill();
        break;
      case 1:
        // rect + semi circle looking left
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(cx, y, size / 2, size);
        break;
      case 2:
        // rect + semi circle looking down
        ctx.fillRect(x, y, size, size / 2);
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 3:
        // rect + semi circle looking up
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.fillRect(x, cy, size, size / 2);
        break;
    }
  }

  // stripes
  if (shapeFamily == 6) {
    switch (iShape) {
      case 0:
        // vertical strips
        let w = size / 11;
        for (let i = 0; i < 6; i++) {
          ctx.fillRect(x + i * w * 2, y, w, size);
        }
        break;
      case 1:
        // vertical strips
        let h = size / 11;
        for (let i = 0; i < 6; i++) {
          ctx.fillRect(x, y + i * h * 2, size, h);
        }
        break;
    }
  }

  // connected diamonds
  if (shapeFamily == 7) {
    switch (iShape) {
      case 0:
        processShape(shapes[2], x, y, size);
        ctx.fill();
        break;
      case 1:
        processShape(shapes[3], x, y, size);
        ctx.fill();
        break;
    }
  }
}
