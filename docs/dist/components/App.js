import React from "../../_snowpack/pkg/react.js";
import {Route} from "../../_snowpack/pkg/wouter.js";
import useConnection from "../hooks/useConnection.js";
import Playing from "../pages/Playing.js";
import MainMenu from "../pages/MainMenu.js";
const App = function App2() {
  const connect = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get("connect");
    if (!playerId) {
      return;
    }
    connectToPeer(playerId);
  };
  const {connectToPeer} = useConnection();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Route, {
    path: "/",
    component: MainMenu
  }), /* @__PURE__ */ React.createElement(Route, {
    path: "/play/:gameId",
    component: Playing
  }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    onClick: connect
  }, "Connect")));
};
export default App;
