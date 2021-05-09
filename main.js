const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const a = (2 * Math.PI) / 6;
const r = 50;

function getColor() {
  const colors = ['lightyellow', 'yellow', 'darkgreen', 'lightgreen', 'grey', 'brown'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function init() {
  // let tiles = [];
  // for (let x = 0; x < 10; x++) {
  //   const row = [];
  //   for (let y = 0; y < 10; y++) {
  //     row.push({ x, y, color: getColor(), isHovered: false });
  //   }
  //   tiles.push(row);
  // }

  // let corners = [];

  // drawAll(tiles);

  // let mouseIsDown = false;
  // canvas.addEventListener('mousedown', () => {
  //   mouseIsDown = true;
  // });
  // canvas.addEventListener('mouseup', () => {
  //   mouseIsDown = false;
  // });

  // canvas.addEventListener('mousemove', (event) => {
  //   if (!mouseIsDown) {
  //     return;
  //   }

  //   console.log(event.offsetX, event.offsetY);
  // });

  var canvas = new fabric.Canvas('canvas2', { selection: false });

  function regularPolygonPoints(sideCount, radius) {
    var sweep = (Math.PI * 2) / sideCount;
    var cx = radius;
    var cy = radius;
    var points = [];
    for (var i = 0; i < sideCount; i++) {
      var x = cx + radius * Math.cos(i * sweep);
      var y = cy + radius * Math.sin(i * sweep);
      points.push({ x: x, y: y });
    }
    return points;
  }

  // create a rectangle object
  var rect = new fabric.Polygon(regularPolygonPoints(6, 30), {
    left: 250,
    top: 150,
    angle: 0,
    fill: 'green',
    hasControls: false,
    selectable: false,
    hoverCursor: 'pointer',
    padding: 0,
    perPixelTargetFind: true,
    id: 'myid',
    type: 'asfd',
    x: 34,
  });

  var rect2 = new fabric.Polygon(regularPolygonPoints(6, 30), {
    left: 255,
    top: 155,
    angle: 0,
    fill: 'yellow',
    hasControls: false,
    selectable: false,
    hoverCursor: 'pointer',
    padding: 0,
    perPixelTargetFind: true,
    id: 'myid2',
    type: 'asfd',
    x: 34,
  });
  // rect.on('mousedown', function () {
  //   console.log('selected a rectangle');
  // });

  // "add" rectangle onto canvas
  canvas.add(rect);
  canvas.add(rect2);

  canvas.on('mouse:down', function (options) {
    console.log(options.e.clientX, options.e.clientY);
    console.log(options);
  });

  canvas.on('mouse:wheel', function (opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.setZoom(zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  });
}

function drawAll(tiles) {
  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < tiles[i].length; j++) {
      drawAtCoordinate(tiles[i][j].x, tiles[i][j].y);
    }
  }
}

init();

function drawAtCoordinate(x, y) {
  const totalOffsetX = 100;
  const totalOffsetY = 100;
  const distance = 5;

  const isOffset = y % 2 !== 0;

  let pxX, pxY;
  pxX = (r * 3 + distance * 2) * x + totalOffsetX;
  pxY = ((Math.sqrt(3) * r) / 2 + distance / 2) * y + totalOffsetY;

  if (isOffset) {
    pxX += r * 1.5 + distance;
  }
  drawHexagon(pxX, pxY, `${x}|${y}`);
}

function drawHexagon(x, y, label) {
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.fillStyle = getColor();

  for (let i = 0; i < 6; i++) {
    ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'black';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y);
}
