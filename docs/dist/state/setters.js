import {inviteToGame} from "../hooks/useConnection.js";
import * as game from "../game.js";
import {
  setTempState,
  UiActionType,
  useTempStore
} from "./tempState.js";
import {setLocalState, useLocalStore} from "./localState.js";
import {setGameState} from "./gameState.js";
function updateFriendState(draft, friendId, cb) {
  if (!draft.friendState[friendId]) {
    draft.friendState[friendId] = {isSelected: false};
  }
  cb(draft.friendState[friendId]);
}
export function setMyName(name) {
  setLocalState((draft) => {
    draft.friends[draft.myId].name = name;
  });
}
export function setFriendName(friendId, name) {
  setLocalState((draft) => {
    draft.friends[friendId].name = name;
  });
}
export function toggleFriendSelection(friendId) {
  setTempState((draft) => {
    updateFriendState(draft, friendId, (friendState) => {
      friendState.isSelected = !friendState.isSelected;
    });
  });
}
export function addFriendConnection(friendId, name, connection) {
  setLocalState((draft) => {
    draft.friends[friendId] = {id: friendId, peerId: friendId, name};
  });
  setTempState((draft) => {
    updateFriendState(draft, friendId, (friendState) => {
      friendState.connection = connection;
    });
  });
}
export function removeFriendConnection(friendId) {
  setTempState((draft) => {
    updateFriendState(draft, friendId, (friendState) => {
      delete friendState.connection;
    });
  });
}
export function addLocalPlayer(playerId, name) {
  setLocalState((draft) => {
    draft.friends[playerId] = {
      id: playerId,
      peerId: draft.myId,
      name
    };
  });
}
export function removeSelectedPlayers() {
  const toDelete = Object.entries(useTempStore.getState().friendState).filter(([, friendState]) => friendState.isSelected).map(([friendId]) => friendId);
  setTempState((draft) => {
    for (const friendId of toDelete) {
      draft.friendState[friendId].connection?.close();
      delete draft.friendState[friendId];
    }
  });
  setLocalState((draft) => {
    for (const friendId of toDelete) {
      delete draft.friends[friendId];
    }
  });
}
export function createGame(gameId) {
  const friendsToInvite = Object.values(useLocalStore.getState().friends).filter((friend) => useTempStore.getState().friendState[friend.id]?.isSelected);
  setGameState((draft) => {
    draft.games[gameId] = game.initialiseGame(useTempStore.getState().boardSettings, friendsToInvite);
  });
  inviteToGame(gameId);
}
export function buildTown(gameId, position2) {
  setGameState((draft) => {
    game.buildTown(draft.games[gameId], position2);
  });
  setTempState((draft) => {
    draft.currentAction = {type: UiActionType.none};
  });
}
export function buildRoad(gameId, position2) {
  setGameState((draft) => {
    game.buildRoad(draft.games[gameId], position2);
  });
  setTempState((draft) => {
    draft.currentAction = {type: UiActionType.none};
  });
}
export function nextTurn(gameId) {
  setGameState((draft) => {
    game.endTurn(draft.games[gameId]);
  });
  setTempState((draft) => {
    draft.currentAction = {type: UiActionType.none};
  });
}
export function rollDice(gameId) {
  setGameState((draft) => {
    game.rollDice(draft.games[gameId]);
  });
}
export function toggleCurrentAction(actionType) {
  setTempState((draft) => {
    draft.currentAction = actionType === draft.currentAction.type ? {type: UiActionType.none} : {type: actionType};
  });
}
export function updateGameState(gameId, gameState) {
  setGameState((draft) => {
    draft.games[gameId] = gameState;
  });
}
