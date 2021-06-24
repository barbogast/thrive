import { DataConnection } from 'peerjs'
import * as peers from '../lib/peers'

import * as game from '../lib/game'
import * as position from '../lib/position'
import {
  FriendState,
  setTempState,
  TempState,
  UiActionType,
  useTempStore,
} from './tempState'
import { setLocalState, useLocalStore } from './localState'
import { setGameState } from './gameState'
import { Tile } from '../lib/board'

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

export function setMyName(name: string): void {
  setLocalState((draft) => {
    draft.friends[draft.myId].name = name
  })
}

export function setFriendName(friendId: string, name: string): void {
  setLocalState((draft) => {
    draft.friends[friendId].name = name
  })
}

export function toggleFriendSelection(friendId: string): void {
  setTempState((draft) => {
    updateFriendState(draft, friendId, (friendState) => {
      friendState.isSelected = !friendState.isSelected
    })
  })
}

export function addFriendConnection(
  friendId: string,
  name: string,
  connection: DataConnection,
): void {
  setLocalState((draft) => {
    draft.friends[friendId] = { id: friendId, peerId: friendId, name }
  })
  setTempState((draft) => {
    updateFriendState(draft, friendId, (friendState) => {
      friendState.connection = connection
    })
  })
}

export function removeFriendConnection(friendId: string): void {
  setTempState((draft) => {
    updateFriendState(draft, friendId, (friendState) => {
      delete friendState.connection
    })
  })
}

export function addLocalPlayer(playerId: string, name: string): void {
  setLocalState((draft) => {
    draft.friends[playerId] = {
      id: playerId,
      peerId: draft.myId,
      name,
    }
  })
}

export function removeSelectedPlayers(): void {
  const toDelete = Object.entries(useTempStore.getState().friendState)
    .filter(([, friendState]) => friendState.isSelected)
    .map(([friendId]) => friendId)

  setTempState((draft) => {
    for (const friendId of toDelete) {
      draft.friendState[friendId].connection?.close()
      delete draft.friendState[friendId]
    }
  })

  setLocalState((draft) => {
    for (const friendId of toDelete) {
      delete draft.friends[friendId]
    }
  })
}

export function generateBoard(): void {
  setTempState((draft) => {
    draft.currentTiles = game.generateBoard(
      useTempStore.getState().boardSettings,
    )
  })
}

export function createGame(gameId: string): void {
  const friendsToInvite = Object.values(
    useLocalStore.getState().friends,
  ).filter(
    (friend) => useTempStore.getState().friendState[friend.id]?.isSelected,
  )

  const selectedCustomBoardId = useTempStore.getState().selectedCustomBoardId
  let board: Tile[]
  if (useTempStore.getState().boardMode === 'random') {
    board = useTempStore.getState().currentTiles
  } else {
    if (!selectedCustomBoardId) {
      return
    }
    board = useLocalStore.getState().customBoards[selectedCustomBoardId].tiles
  }

  setGameState((draft) => {
    draft.games[gameId] = game.initialiseGame(
      gameId,
      board,
      friendsToInvite,
      useTempStore.getState().pointsForVictory,
    )
  })
  peers.inviteToGame(gameId)
}

export function buildTown(gameId: string, position: position.Position): void {
  setGameState((draft) => {
    if (useTempStore.getState().currentAction.type === UiActionType.buildCity) {
      game.upgradeTown(draft.games[gameId], position)
    } else {
      game.buildTown(draft.games[gameId], position)
    }
  })
  setTempState((draft) => {
    draft.currentAction = { type: UiActionType.none }
  })
}

export function buildRoad(gameId: string, position: position.Position): void {
  const type =
    useTempStore.getState().currentAction.type === UiActionType.buildRoad
      ? 'road'
      : 'ship'
  setGameState((draft) => {
    game.buildRoad(draft.games[gameId], position, type)
  })
  setTempState((draft) => {
    draft.currentAction = { type: UiActionType.none }
  })
}

export function nextTurn(gameId: string): void {
  setGameState((draft) => {
    game.endTurn(draft.games[gameId])
  })
  setTempState((draft) => {
    draft.currentAction = { type: UiActionType.none }
  })
}

export function rollDice(gameId: string): void {
  setGameState((draft) => {
    game.rollDice(draft.games[gameId])
  })
}

export function toggleCurrentAction(actionType: UiActionType): void {
  setTempState((draft) => {
    draft.currentAction =
      actionType === draft.currentAction.type
        ? { type: UiActionType.none }
        : { type: actionType }
  })
}

export function updateGameState(gameId: string, gameState: game.Game): void {
  setGameState((draft) => {
    draft.games[gameId] = gameState
  })
}
