import React from "../../_snowpack/pkg/react.js";
import {useLocalStore} from "../state/localState.js";
import ConnectionStatus from "./ConnectionStatus.js";
import * as setters from "../state/setters.js";
import {useTempStore} from "../state/tempState.js";
const FriendsList = function FriendsList2() {
  const localStore = useLocalStore((state) => ({
    myId: state.myId,
    friends: state.friends
  }));
  const tempStore = useTempStore((state) => ({
    friendState: state.friendState
  }));
  return /* @__PURE__ */ React.createElement("ul", null, Object.values(localStore.friends).map((friend) => /* @__PURE__ */ React.createElement("li", {
    key: friend.id
  }, /* @__PURE__ */ React.createElement("input", {
    type: "checkbox",
    checked: Boolean(tempStore.friendState[friend.id]?.isSelected),
    onChange: () => setters.toggleFriendSelection(friend.id)
  }), friend.name, friend.peerId !== localStore.myId && /* @__PURE__ */ React.createElement(ConnectionStatus, {
    id: friend.id
  }), friend.peerId === localStore.myId && /* @__PURE__ */ React.createElement("input", {
    value: friend.name,
    onChange: (e) => setters.setFriendName(friend.id, e.target.value)
  }))));
};
export default FriendsList;
