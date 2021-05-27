import { DataConnection } from 'peerjs'

import * as game from '../game'
import { BoardSettings } from '../game'
import * as position from '../position'
import { Friend } from './localState'
import { FriendState, TempState, UiActionType } from './tempState'
import { Stores } from './useStores'

function updateFriendState(
  draft: TempState,
  friendId: string,
  cb: (friendState: FriendState) => void,
) {
  if (!draft.friendState[friendId]) {
    draft.friendState[friendId] = { isSelected: false }
  }
  cb(draft.friendState[friendId])
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
    stores.temp.set((draft) => {
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
    })
    stores.temp.set((draft) => {
      updateFriendState(draft, friendId, (friendState) => {
        friendState.connection = connection
      })
    })
  }
}

export function removeFriendConnection(stores: Stores) {
  return (friendId: string): void => {
    stores.temp.set((draft) => {
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
    const toDelete = Object.entries(stores.temp.get().friendState)
      .filter(([, friendState]) => friendState.isSelected)
      .map(([friendId]) => friendId)

    stores.temp.set((draft) => {
      for (const friendId of toDelete) {
        draft.friendState[friendId].connection?.close()
        delete draft.friendState[friendId]
      }
    })

    stores.local.set((draft) => {
      for (const friendId of toDelete) {
        delete draft.friends[friendId]
      }
    })
  }
}

export function initialise(stores: Stores) {
  return (
    gameId: string,
    boardConfig: BoardSettings,
    friends: Friend[],
  ): void => {
    stores.game.set((draft) => {
      draft.games[gameId] = game.initialiseGame(boardConfig, friends)
    })
  }
}

export function buildTown(stores: Stores) {
  return (gameId: string, position: position.Position): void => {
    stores.game.set((draft) => {
      game.buildTown(draft.games[gameId], position)
    })
    stores.temp.set((draft) => {
      draft.currentAction = { type: UiActionType.none }
    })
  }
}

export function buildRoad(stores: Stores) {
  return (gameId: string, position: position.Position): void => {
    stores.game.set((draft) => {
      game.buildRoad(draft.games[gameId], position)
    })
    stores.temp.set((draft) => {
      draft.currentAction = { type: UiActionType.none }
    })
  }
}

export function nextTurn(stores: Stores) {
  return (gameId: string): void => {
    stores.game.set((draft) => {
      game.endTurn(draft.games[gameId])
    })
    stores.temp.set((draft) => {
      draft.currentAction = { type: UiActionType.none }
    })
  }
}

export function rollDice(stores: Stores) {
  return (gameId: string): void => {
    stores.game.set((draft) => {
      game.rollDice(draft.games[gameId])
    })
  }
}

export function toggleCurrentAction(stores: Stores) {
  return (actionType: UiActionType): void => {
    stores.temp.set((draft) => {
      draft.currentAction =
        actionType === draft.currentAction.type
          ? { type: UiActionType.none }
          : { type: actionType }
    })
  }
}

export function updateGameState(stores: Stores) {
  return (gameId: string, gameState: game.GameState): void => {
    stores.game.set((draft) => {
      draft.games[gameId] = gameState
    })
  }
}
