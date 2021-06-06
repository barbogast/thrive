import React, {useState} from "../../_snowpack/pkg/react.js";
import {updateMyName} from "../hooks/useConnection.js";
import {useLocalStore} from "../state/localState.js";
import * as setters from "../state/setters.js";
const PlayerName = function PlayerName2() {
  const localStore = useLocalStore((state) => ({
    myName: state.friends[state.myId].name
  }));
  const [value, setValue] = useState(localStore.myName);
  const save = (name) => {
    setters.setMyName(value);
    updateMyName(name);
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Your name:", /* @__PURE__ */ React.createElement("input", {
    value,
    onChange: (e) => setValue(e.target.value)
  })), /* @__PURE__ */ React.createElement("button", {
    onClick: () => save(value)
  }, "Save"));
};
export default PlayerName;
