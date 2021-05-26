import { DataConnection } from 'peerjs'

import * as game from '../game'
import * as position from '../position'
import { sendState } from '../hooks/useConnection'
import { Friend, FriendState, State, Stores, UiActionType } from '../state'

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

export function setMyName(stores: Stores) {
  return (name: string): void => {
    stores.local.set((draft) => {
      draft.friends[draft.myId].name = name
    })
  }
}

export function setFriendName(stores: Stores) {
  return (friendId: string, name: string): void => {
    stores.local.set((draft) => {
      draft.friends[friendId].name = name
    })
  }
}

export function toggleFriendSelection(stores: Stores) {
  return (friendId: string): void => {
    stores.local.set((draft) => {
      updateFriendState(draft, friendId, (friendState) => {
        friendState.isSelected = !friendState.isSelected
      })
    })
  }
}

export function addFriendConnection(stores: Stores) {
  return (friendId: string, name: string, connection: DataConnection): void => {
    stores.local.set((draft) => {
      draft.friends[friendId] = { id: friendId, peerId: friendId, name }
      updateFriendState(draft, friendId, (friendState) => {
        friendState.connection = connection
      })
    })
  }
}

export function removeFriendConnection(stores: Stores) {
  return (friendId: string): void => {
    stores.local.set((draft) => {
      updateFriendState(draft, friendId, (friendState) => {
        delete friendState.connection
      })
    })
  }
}

export function addLocalPlayer(stores: Stores) {
  return (playerId: string, name: string): void => {
    stores.local.set((draft) => {
      draft.friends[playerId] = {
        id: playerId,
        peerId: draft.myId,
        name,
      }
    })
  }
}

export function removeSelectedPlayers(stores: Stores) {
  return (): void => {
    stores.local.set((draft) => {
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

export function initialise(stores: Stores) {
  return (gameId: string, friends: Friend[]): void => {
    stores.local.set((draft) => {
      draft.games[gameId] = game.initialiseGame(friends)
    })
  }
}

export function buildTown(stores: Stores) {
  return (gameId: string, position: position.Position): void => {
    stores.local.set((draft) => {
      game.buildTown(draft.games[gameId], position)
      draft.uiState.currentAction = { type: UiActionType.none }
    })
  }
}

export function buildRoad(stores: Stores) {
  return (gameId: string, position: position.Position): void => {
    stores.local.set((draft) => {
      game.buildRoad(draft.games[gameId], position)
      draft.uiState.currentAction = { type: UiActionType.none }
    })
  }
}

export function nextTurn(stores: Stores) {
  return (gameId: string): void => {
    stores.local.set((draft) => {
      draft.uiState.currentAction = { type: UiActionType.none }
      game.endTurn(draft.games[gameId])
    })
    sendState(stores)(gameId)
  }
}

export function rollDice(stores: Stores) {
  return (gameId: string): void => {
    stores.local.set((draft) => {
      game.rollDice(draft.games[gameId])
    })
  }
}

export function toggleCurrentAction(stores: Stores) {
  return (actionType: UiActionType): void => {
    stores.local.set((draft) => {
      draft.uiState.currentAction =
        actionType === draft.uiState.currentAction.type
          ? { type: UiActionType.none }
          : { type: actionType }
    })
  }
}

export function updateGameState(stores: Stores) {
  return (gameId: string, gameState: game.GameState): void => {
    stores.local.set((draft) => {
      draft.games[gameId] = gameState
    })
  }
}
