import { DataConnection } from 'peerjs'
import { inviteToGame } from '../hooks/useConnection'

import * as game from '../game'
import * as position from '../position'
import { FriendState, TempState, UiActionType, useTempStore } from './tempState'
import { useLocalStore } from './localState'
import { useGameStore } from './gameState'

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
  useLocalStore.setState((draft) => {
    draft.friends[draft.myId].name = name
  })
}

export function setFriendName(friendId: string, name: string): void {
  useLocalStore.setState((draft) => {
    draft.friends[friendId].name = name
  })
}

export function toggleFriendSelection(friendId: string): void {
  useTempStore.setState((draft) => {
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
  useLocalStore.setState((draft) => {
    draft.friends[friendId] = { id: friendId, peerId: friendId, name }
  })
  useTempStore.setState((draft) => {
    updateFriendState(draft, friendId, (friendState) => {
      friendState.connection = connection
    })
  })
}

export function removeFriendConnection(friendId: string): void {
  useTempStore.setState((draft) => {
    updateFriendState(draft, friendId, (friendState) => {
      delete friendState.connection
    })
  })
}

export function addLocalPlayer(playerId: string, name: string): void {
  useLocalStore.setState((draft) => {
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

  useTempStore.setState((draft) => {
    for (const friendId of toDelete) {
      draft.friendState[friendId].connection?.close()
      delete draft.friendState[friendId]
    }
  })

  useLocalStore.setState((draft) => {
    for (const friendId of toDelete) {
      delete draft.friends[friendId]
    }
  })
}

export function createGame(gameId: string): void {
  const friendsToInvite = Object.values(
    useLocalStore.getState().friends,
  ).filter(
    (friend) => useTempStore.getState().friendState[friend.id]?.isSelected,
  )
  useGameStore.setState((draft) => {
    draft.games[gameId] = game.initialiseGame(
      useTempStore.getState().boardSettings,
      friendsToInvite,
    )
  })
  inviteToGame(gameId)
}

export function buildTown(gameId: string, position: position.Position): void {
  useGameStore.setState((draft) => {
    game.buildTown(draft.games[gameId], position)
  })
  useTempStore.setState((draft) => {
    draft.currentAction = { type: UiActionType.none }
  })
}

export function buildRoad(gameId: string, position: position.Position): void {
  useGameStore.setState((draft) => {
    game.buildRoad(draft.games[gameId], position)
  })
  useTempStore.setState((draft) => {
    draft.currentAction = { type: UiActionType.none }
  })
}

export function nextTurn(gameId: string): void {
  useGameStore.setState((draft) => {
    game.endTurn(draft.games[gameId])
  })
  useTempStore.setState((draft) => {
    draft.currentAction = { type: UiActionType.none }
  })
}

export function rollDice(gameId: string): void {
  useGameStore.setState((draft) => {
    game.rollDice(draft.games[gameId])
  })
}

export function toggleCurrentAction(actionType: UiActionType): void {
  useTempStore.setState((draft) => {
    draft.currentAction =
      actionType === draft.currentAction.type
        ? { type: UiActionType.none }
        : { type: actionType }
  })
}

export function updateGameState(
  gameId: string,
  gameState: game.GameState,
): void {
  useGameStore.setState((draft) => {
    draft.games[gameId] = gameState
  })
}
