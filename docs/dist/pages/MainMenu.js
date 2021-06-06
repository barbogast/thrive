import React from "../../_snowpack/pkg/react.js";
import {Link} from "../../_snowpack/pkg/wouter.js";
import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import {useLocation} from "../../_snowpack/pkg/wouter.js";
import {useLocalStore} from "../state/localState.js";
import PlayerName from "../components/PlayerName.js";
import FriendsList from "../components/FriendsList.js";
import ConnectionStatus from "../components/ConnectionStatus.js";
import BoardSettingsForm from "../components/BoardSettingsForm.js";
import {
  addLocalPlayer,
  createGame,
  removeSelectedPlayers
} from "../state/setters.js";
import {useGameStore} from "../state/gameState.js";
const MainMenu = function MainMenu2() {
  const [, setLocation] = useLocation();
  const localStore = useLocalStore((state) => ({
    get: state.get,
    set: state.set,
    myId: state.myId,
    friends: state.friends
  }));
  const gameStore = useGameStore((state) => ({
    games: state.games
  }));
  const create = () => {
    const gameId = nanoid();
    createGame(gameId);
    setLocation(`/play/${gameId}`);
  };
  const inviteLink = `${window.location.protocol}//${window.location.host + "?connect=" + localStore.myId}`;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(PlayerName, null), /* @__PURE__ */ React.createElement("div", null, "Existing games", /* @__PURE__ */ React.createElement("ul", null, Object.entries(gameStore.games).map(([gameId, game]) => /* @__PURE__ */ React.createElement("li", {
    key: gameId
  }, /* @__PURE__ */ React.createElement(Link, {
    href: `/play/${gameId}`
  }, /* @__PURE__ */ React.createElement("a", {
    className: "link"
  }, "Play ", gameId)), Object.values(game.players).map((player) => /* @__PURE__ */ React.createElement("span", {
    key: player.id
  }, player.name, player.peerId !== localStore.myId ? /* @__PURE__ */ React.createElement(ConnectionStatus, {
    id: player.peerId
  }) : /* @__PURE__ */ React.createElement(React.Fragment, null))))))), /* @__PURE__ */ React.createElement("div", null, "Contacts", /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(FriendsList, null), /* @__PURE__ */ React.createElement(BoardSettingsForm, null), /* @__PURE__ */ React.createElement("button", {
    onClick: () => addLocalPlayer(nanoid(), "")
  }, "Add local player"), " ", /* @__PURE__ */ React.createElement("button", {
    onClick: removeSelectedPlayers
  }, "Remove players"), " ", /* @__PURE__ */ React.createElement("button", {
    onClick: create
  }, "Create game"), /* @__PURE__ */ React.createElement("br", null), "Invite new contacts by sharing this link:", /* @__PURE__ */ React.createElement("a", {
    href: inviteLink
  }, inviteLink))));
};
export default MainMenu;
