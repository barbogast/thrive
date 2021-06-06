import Peer from "../../_snowpack/pkg/peerjs.js";
import {useEffect, useRef} from "../../_snowpack/pkg/react.js";
import * as setters from "../state/setters.js";
import {useLocalStore} from "../state/localState.js";
import {useTempStore} from "../state/tempState.js";
import {useGameStore} from "../state/gameState.js";
const DEBUG_LEVEL = 0;
const log = DEBUG_LEVEL === 1 ? () => {
} : (...args) => console.log("NET: ", ...args);
function send(friends, call) {
  log("send", friends, call);
  for (const friend of Object.values(friends)) {
    if (friend.peerId === useLocalStore.getState().myId) {
      continue;
    }
    const conn = useTempStore.getState().friendState[friend.id]?.connection;
    if (!conn) {
      console.error(`Friend ${friend.id} has no connection`);
      continue;
    }
    conn.send(call);
  }
}
export function sendState(gameId) {
  send(useGameStore.getState().games[gameId].players, {
    method: "updateGameState",
    args: {gameId, newState: useGameStore.getState().games[gameId]}
  });
}
export function updateMyName(newName) {
  send(useLocalStore.getState().friends, {
    method: "updateMyName",
    args: {newName}
  });
}
export function inviteToGame(gameId) {
  const gameState = useGameStore.getState().games[gameId];
  send(gameState.players, {
    method: "inviteToGame",
    args: {gameId, gameState}
  });
}
function initialiseConnection(conn) {
  let connectedPlayerId;
  log("incoming peer connection!");
  conn.on("data", (data) => {
    log(`received:`, data);
    if (typeof data !== "object") {
      console.error("Invalid payload", data);
    }
    data;
    switch (data.method) {
      case "introduce": {
        connectedPlayerId = data.args.playerId;
        setters.addFriendConnection(connectedPlayerId, data.args.playerName, conn);
        log("add connection, ", connectedPlayerId);
        break;
      }
      case "inviteToGame": {
        setters.updateGameState(data.args.gameId, data.args.gameState);
        break;
      }
      case "updateMyName": {
        setters.setFriendName(connectedPlayerId, data.args.newName);
        break;
      }
      case "updateGameState": {
        setters.updateGameState(data.args.gameId, data.args.newState);
        break;
      }
      default: {
        const exhaustiveCheck = data;
        throw new Error(`Unhandled case: ${exhaustiveCheck}`);
      }
    }
  });
  conn.on("open", () => {
    conn.send({
      method: "introduce",
      args: {
        playerId: useLocalStore.getState().myId,
        playerName: useLocalStore.getState().friends[useLocalStore.getState().myId].name
      }
    });
  });
  conn.on("close", () => {
    setters.removeFriendConnection(connectedPlayerId);
  });
  conn.on("error", (err) => {
    console.error("error", err, connectedPlayerId);
    setters.removeFriendConnection(connectedPlayerId);
  });
}
function useConnection() {
  const peerRef = useRef();
  const localStore = useLocalStore((state) => ({
    friends: state.friends,
    myId: state.myId
  }));
  const connectToPeer = (connectToId) => {
    if (!peerRef.current) {
      return;
    }
    log(`Connecting to ${localStore.myId}...`);
    const conn = peerRef.current.connect(connectToId);
    initialiseConnection(conn);
  };
  useEffect(() => {
    peerRef.current = new Peer(localStore.myId, {debug: DEBUG_LEVEL});
    peerRef.current.on("open", (id) => {
      log("My peer ID is: " + id);
      for (const friendId in localStore.friends) {
        if (localStore.friends[friendId].peerId !== localStore.myId) {
          connectToPeer(friendId);
        }
      }
    });
    peerRef.current.on("error", (error) => {
      console.error(error);
    });
    peerRef.current.on("connection", initialiseConnection);
  }, []);
  return {connectToPeer};
}
export default useConnection;
