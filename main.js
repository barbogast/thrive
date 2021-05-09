const canvas = new fabric.Canvas('canvas', { selection: false });

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

  canvas.on('mouse:down', function (options) {
    console.log(options.e.clientX, options.e.clientY);
    console.log(options);
  });

  let i = 0;
  // canvas.on('mouse:wheel', function (opt) {
  //   console.log(i++);
  //   var delta = opt.e.deltaY;
  //   var zoom = canvas.getZoom();
  //   zoom *= 0.999 ** delta;
  //   if (zoom > 20) zoom = 20;
  //   if (zoom < 0.01) zoom = 0.01;
  //   canvas.setZoom(zoom);
  //   opt.e.preventDefault();
  //   opt.e.stopPropagation();
  // });
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
  var rect = new fabric.Polygon(hexagonPoints, {
    originX: 'center',
    originY: 'center',
    angle: 0,
    fill: color,

    id: 'myid2',
    type: 'asfd',
    x: 34,
  });

  console.log(label);
  var t = new fabric.Text(label, {
    fontFamily: 'Arial',
    fontSize: 8,
    color: 'black',
    top: r,
    left: r,
    originX: 'center',
    originY: 'center',
  });

  var g = new fabric.Group([rect, t], {
    left: x,
    top: y,
    hasControls: false,
    selectable: false,
    hoverCursor: 'pointer',
    padding: 0,
    perPixelTargetFind: true,
  });

  canvas.add(g);
}

// from just after the function applyZoom replace all the code
var mouse = {
  // holds the mouse state
  x: 0,
  y: 0,
  down: false,
  w: 0,
  delta: new fabric.Point(0, 0),
};
// event just track mouse state
function zoom(e) {
  if (e != null) {
    e.preventDefault();
  }
  var evt = window.event || e;
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
  mouse.w += evt.detail ? evt.detail * -120 : evt.wheelDelta;
  return false;
}
canvas.on('mouse:up', function (e) {
  mouse.down = false;
});
canvas.on('mouse:out', function (e) {
  mouse.down = false;
});
canvas.on('mouse:down', function (e) {
  mouse.down = true;
});
canvas.on('mouse:move', function (e) {
  if (e && e.e) {
    mouse.delta.x += e.e.movementX;
    mouse.delta.y += e.e.movementY;
  }
});

let wheel = 0;
canvas.on('mouse:wheel', function (opt) {
  console.log(wheel++);
  var delta = opt.e.deltaY;
  mouse.w = delta;
  // var zoom = canvas.getZoom();
  // zoom *= 0.999 ** delta;
  // if (zoom > 20) zoom = 20;
  // if (zoom < 0.01) zoom = 0.01;
  // canvas.setZoom(zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});

let loop = 0;
// main animation loop
function update() {
  // console.log(loop++);
  if (mouse.w !== 0) {
    // if the wheel has moved do zoom
    var curZoom = canvas.getZoom();
    canvas.zoomToPoint({ x: mouse.x, y: mouse.y }, canvas.getZoom() + mouse.w / 1000);
    mouse.w = 0; // consume wheel delta
  } else if (mouse.down) {
    // if mouse button down
    canvas.relativePan(mouse.delta);
  }
  // consume mouse delta
  mouse.delta.x = 0;
  mouse.delta.y = 0;
  requestAnimationFrame(update);
}
requestAnimationFrame(update);
