import React from "../../_snowpack/pkg/react.js";
import {useTempStore} from "../state/tempState.js";
import Box from "./Box.js";
const ConnectionStatus = function Friend({id}) {
  const localStore = useTempStore((state) => ({
    friendState: state.friendState
  }));
  return /* @__PURE__ */ React.createElement(Box, {
    color: localStore.friendState[id]?.connection ? "green" : "red"
  });
};
export default ConnectionStatus;
