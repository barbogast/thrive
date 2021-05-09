var stage = new Konva.Stage({
  container: 'container', // id of container <div>
  width: 500,
  height: 500,
  draggable: true,
});

var layer = new Konva.Layer();

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
const hexagonPoints = regularPolygonPoints(6, r);

function init() {
  let tiles = [];
  for (let x = 0; x < 20; x++) {
    const row = [];
    for (let y = 0; y < 20; y++) {
      row.push({ x, y, color: getColor(), isHovered: false });
    }
    tiles.push(row);
  }

  let corners = [];

  drawAll(tiles);

  stage.add(layer);

  // draw the image
  layer.draw();
  layer.on('click', (...args) => {
    console.log('lick', args);
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
  const hexagon = new Konva.RegularPolygon({
    x,
    y,
    sides: 6,
    rotation: 30,
    radius: r,
    fill: color,
    stroke: 'black',
    strokeWidth: 1,
    id: 'asdf' + x + y,
  });
  layer.add(hexagon);
}

var scaleBy = 1.05;
stage.on('wheel', (e) => {
  e.evt.preventDefault();
  var oldScale = stage.scaleX();

  var pointer = stage.getPointerPosition();

  var mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };

  var newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  stage.scale({ x: newScale, y: newScale });

  var newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  stage.position(newPos);
  stage.batchDraw();
});
