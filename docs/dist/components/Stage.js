import React from "../../_snowpack/pkg/react.js";
import {Stage as KonvaStage, useStrictMode} from "../../_snowpack/pkg/react-konva.js";
useStrictMode(true);
function onWheel(e) {
  const scaleBy = 1.05;
  const stage = e.currentTarget;
  e.evt.preventDefault();
  const oldScale = stage.scaleX();
  const pointer = stage.getPointerPosition();
  if (!pointer) {
    return;
  }
  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale
  };
  const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
  stage.scale({x: newScale, y: newScale});
  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale
  };
  stage.position(newPos);
  stage.batchDraw();
}
const Stage = function v({children}) {
  return /* @__PURE__ */ React.createElement(KonvaStage, {
    width: window.innerWidth,
    height: window.innerHeight,
    onWheel,
    draggable: true
  }, children);
};
export default Stage;
