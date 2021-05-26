import { DataConnection } from 'peerjs'

import * as game from '../game'
import * as position from '../position'
import { sendState } from '../hooks/useConnection'
import { Friend, FriendState, State, Store, UiActionType } from '../state'

function updateFriendState(
  draft: State,
  friendId: string,
  cb: (friendState: FriendState) => void,
) {
  if (!draft.uiState.friendState[friendId]) {
    draft.uiState.friendState[friendId] = { isSelected: false }
  }
  cb(draft.uiState.friendState[friendId])
}

export function setMyName(store: Store) {
  return (name: string): void => {
    store.set((draft) => {
      draft.friends[draft.myId].name = name
    })
  }
}

export function setFriendName(store: Store) {
  return (friendId: string, name: string): void => {
    store.set((draft) => {
      draft.friends[friendId].name = name
    })
  }
}

export function toggleFriendSelection(store: Store) {
  return (friendId: string): void => {
    store.set((draft) => {
      updateFriendState(draft, friendId, (friendState) => {
        friendState.isSelected = !friendState.isSelected
      })
    })
  }
}

export function addFriendConnection(store: Store) {
  return (friendId: string, name: string, connection: DataConnection): void => {
    store.set((draft) => {
      draft.friends[friendId] = { id: friendId, peerId: friendId, name }
      updateFriendState(draft, friendId, (friendState) => {
        friendState.connection = connection
      })
    })
  }
}

export function removeFriendConnection(store: Store) {
  return (friendId: string): void => {
    store.set((draft) => {
      updateFriendState(draft, friendId, (friendState) => {
        delete friendState.connection
      })
    })
  }
}

export function addLocalPlayer(store: Store) {
  return (playerId: string, name: string): void => {
    store.set((draft) => {
      draft.friends[playerId] = {
        id: playerId,
        peerId: draft.myId,
        name,
      }
    })
  }
}

export function removeSelectedPlayers(store: Store) {
  return (): void => {
    store.set((draft) => {
      for (const [friendId, friendState] of Object.entries(
        draft.uiState.friendState,
      )) {
        if (friendState.isSelected) {
          draft.uiState.friendState[friendId].connection?.close()
          delete draft.uiState.friendState[friendId]
          delete draft.friends[friendId]
        }
      }
    })
  }
}

export function initialise(store: Store) {
  return (gameId: string, friends: Friend[]): void => {
    store.set((draft) => {
      draft.games[gameId] = game.initialiseGame(friends)
    })
  }
}

export function buildTown(store: Store) {
  return (gameId: string, position: position.Position): void => {
    store.set((draft) => {
      game.buildTown(draft.games[gameId], position)
      draft.uiState.currentAction = { type: UiActionType.none }
    })
  }
}

export function buildRoad(store: Store) {
  return (gameId: string, position: position.Position): void => {
    store.set((draft) => {
      game.buildRoad(draft.games[gameId], position)
      draft.uiState.currentAction = { type: UiActionType.none }
    })
  }
}

export function nextTurn(store: Store) {
  return (gameId: string): void => {
    store.set((draft) => {
      draft.uiState.currentAction = { type: UiActionType.none }
      game.endTurn(draft.games[gameId])
    })
    sendState(store)(gameId, store.get().games[gameId])
  }
}

export function rollDice(store: Store) {
  return (gameId: string): void => {
    store.set((draft) => {
      game.rollDice(draft.games[gameId])
    })
  }
}

export function toggleCurrentAction(store: Store) {
  return (actionType: UiActionType): void => {
    store.set((draft) => {
      draft.uiState.currentAction =
        actionType === draft.uiState.currentAction.type
          ? { type: UiActionType.none }
          : { type: actionType }
    })
  }
}

export function updateGameState(store: Store) {
  return (gameId: string, gameState: game.GameState): void => {
    store.set((draft) => {
      draft.games[gameId] = gameState
    })
  }
}
