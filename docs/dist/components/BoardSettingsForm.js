import React from "../../_snowpack/pkg/react.js";
import {useTempStore} from "../state/tempState.js";
const BoardSettingsForm = function BoardSettingsForm2() {
  const {boardSettings} = useTempStore((state) => ({
    boardSettings: state.boardSettings
  }));
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("select", {
    value: boardSettings.type,
    onChange: (e) => useTempStore.setState((draft) => {
      draft.boardSettings.type = e.target.value;
    })
  }, /* @__PURE__ */ React.createElement("option", {
    defaultChecked: true,
    value: "hex"
  }, "Hexagon"), /* @__PURE__ */ React.createElement("option", {
    value: "square"
  }, "Square")), boardSettings.type === "square" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Rows:", " ", /* @__PURE__ */ React.createElement("input", {
    value: boardSettings.rows,
    type: "number",
    onChange: (e) => useTempStore.setState((draft) => {
      if (draft.boardSettings.type !== "square") {
        throw new Error("TS-Refinement failed");
      }
      draft.boardSettings.rows = parseInt(e.target.value);
    })
  })), /* @__PURE__ */ React.createElement("label", null, "Columns:", " ", /* @__PURE__ */ React.createElement("input", {
    value: boardSettings.columns,
    type: "number",
    onChange: (e) => useTempStore.setState((draft) => {
      if (draft.boardSettings.type !== "square") {
        throw new Error("TS-Refinement failed");
      }
      draft.boardSettings.columns = parseInt(e.target.value);
    })
  }))), boardSettings.type === "hex" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Size:", " ", /* @__PURE__ */ React.createElement("select", {
    value: boardSettings.size,
    onChange: (e) => useTempStore.setState((draft) => {
      if (draft.boardSettings.type !== "hex") {
        throw new Error("TS-Refinement failed");
      }
      draft.boardSettings.size = e.target.value;
    })
  }, /* @__PURE__ */ React.createElement("option", {
    defaultChecked: true,
    value: "5"
  }, "5"), /* @__PURE__ */ React.createElement("option", {
    value: "3"
  }, "3")))));
};
export default BoardSettingsForm;
