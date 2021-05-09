const canvas = new fabric.Canvas('canvas', { selection: false });
// const ctx = canvas.getContext('2d');

const a = (2 * Math.PI) / 6;
const r = 30;

function getColor() {
  const colors = ['lightyellow', 'yellow', 'darkgreen', 'lightgreen', 'grey', 'brown'];
  return colors[Math.floor(Math.random() * colors.length)];
}

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

function init() {
  let tiles = [];
  for (let x = 0; x < 10; x++) {
    const row = [];
    for (let y = 0; y < 10; y++) {
      row.push({ x, y, color: getColor(), isHovered: false });
    }
    tiles.push(row);
  }

  let corners = [];

  drawAll(tiles);

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
      drawAtCoordinate(tiles[i][j]);
    }
  }
}

init();

function drawAtCoordinate(info) {
  const totalOffsetX = 100;
  const totalOffsetY = 100;
  const distance = 5;

  const isOffset = info.y % 2 !== 0;

  let pxX, pxY;
  pxX = (r * 3 + distance * 2) * info.x + totalOffsetX;
  pxY = ((Math.sqrt(3) * r) / 2 + distance / 2) * info.y + totalOffsetY;

  if (isOffset) {
    pxX += r * 1.5 + distance;
  }
  drawHexagon(pxX, pxY, info.color, `${info.x}|${info.y}`);
}

function drawHexagon(x, y, color, label) {
  console.log(r);
  var rect = new fabric.Polygon(regularPolygonPoints(6, r), {
    left: x,
    top: y,
    angle: 0,
    fill: color,
    hasControls: false,
    selectable: false,
    hoverCursor: 'pointer',
    padding: 0,
    perPixelTargetFind: true,
    id: 'myid2',
    type: 'asfd',
    x: 34,
  });

  canvas.add(rect);

  // ctx.fillStyle = 'black';
  // ctx.textBaseline = 'middle';
  // ctx.textAlign = 'center';
  // ctx.fillText(label, x, y);
}
