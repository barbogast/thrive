import Peer, { DataConnection } from 'peerjs'
import * as setters from '../state/setters'
import { GameState } from '../game'
import { useLocalStore, Friend } from '../state/localState'
import { setTempState, useTempStore } from '../state/tempState'
import { useGameStore } from '../state/gameState'

const DEBUG_LEVEL: 0 | 1 | 2 | 3 = 0

const log =
  // @ts-ignore: It's okay, relax
  DEBUG_LEVEL === 1
    ? () => {} // eslint-disable-line @typescript-eslint/no-empty-function,no-console
    : (...args: unknown[]) => console.log('NET: ', ...args) // eslint-disable-line no-console

type RemoteCallPayload =
  | {
      method: 'introduce'
      args: { playerId: string; playerName: string }
    }
  | {
      method: 'inviteToGame'
      args: { gameId: string; gameState: GameState }
    }
  | {
      method: 'updateGameState'
      args: { gameId: string; newState: GameState }
    }
  | {
      method: 'updateMyName'
      args: { newName: string }
    }

function send(friends: { [id: string]: Friend }, call: RemoteCallPayload) {
  log('send', friends, call)
  for (const friend of Object.values(friends)) {
    if (friend.peerId === useLocalStore.getState().myId) {
      continue
    }

    const conn = useTempStore.getState().friendState[friend.id]?.connection
    if (!conn) {
      console.error(`Friend ${friend.id} has no connection`)
      continue
    }
    conn.send(call)
  }
}

export function sendState(gameId: string): void {
  send(useGameStore.getState().games[gameId].players, {
    method: 'updateGameState',
    args: { gameId, newState: useGameStore.getState().games[gameId] },
  })
}

export function updateMyName(newName: string): void {
  send(useLocalStore.getState().friends, {
    method: 'updateMyName',
    args: { newName },
  })
}

export function inviteToGame(gameId: string): void {
  const gameState = useGameStore.getState().games[gameId]
  send(gameState.players, {
    method: 'inviteToGame',
    args: { gameId, gameState },
  })
}

function initialiseConnection(conn: DataConnection) {
  let connectedPlayerId: string
  log('incoming peer connection!')

  conn.on('data', (data: RemoteCallPayload) => {
    log(`received:`, data)
    if (typeof data !== 'object') {
      console.error('Invalid payload', data)
    }
    data

    switch (data.method) {
      case 'introduce': {
        connectedPlayerId = data.args.playerId

        setters.addFriendConnection(
          connectedPlayerId,
          data.args.playerName,
          conn,
        )
        log('add connection, ', connectedPlayerId)
        break
      }

      case 'inviteToGame': {
        setters.updateGameState(data.args.gameId, data.args.gameState)
        break
      }

      case 'updateMyName': {
        setters.setFriendName(connectedPlayerId, data.args.newName)
        break
      }

      case 'updateGameState': {
        setters.updateGameState(data.args.gameId, data.args.newState)
        break
      }

      default: {
        const exhaustiveCheck: never = data
        throw new Error(`Unhandled case: ${exhaustiveCheck}`)
      }
    }
  })

  conn.on('open', () => {
    conn.send({
      method: 'introduce',
      args: {
        playerId: useLocalStore.getState().myId,
        playerName:
          useLocalStore.getState().friends[useLocalStore.getState().myId].name,
      },
    })
  })

  conn.on('close', () => {
    // Looks like peerjs doesn't correctly handle closing connections, so this doesn't work...
    // https://stackoverflow.com/questions/64651890/peerjs-close-video-call-not-firing-close-event/67404616#67404616
    // https://github.com/peers/peerjs/issues/822
    setters.removeFriendConnection(connectedPlayerId)
  })

  conn.on('error', (err) => {
    console.error('error', err, connectedPlayerId)
    setters.removeFriendConnection(connectedPlayerId)
  })
}

export function connectToPeer(connectToId: string): void {
  const tempStore = useTempStore.getState()
  if (!tempStore.peerJsConnection) {
    return
  }
  log(`Connecting to ${connectToId}...`)
  const conn = tempStore.peerJsConnection.connect(connectToId)

  initialiseConnection(conn)
}

export function setup(): void {
  const localStore = useLocalStore.getState()

  const peer = new Peer(localStore.myId, { debug: DEBUG_LEVEL })
  setTempState((draft) => {
    draft.peerJsConnection = peer
  })

  peer.on('open', (id) => {
    log('My peer ID is: ' + id)

    for (const friendId in localStore.friends) {
      if (localStore.friends[friendId].peerId !== localStore.myId) {
        connectToPeer(friendId)
      }
    }
  })

  peer.on('error', (error) => {
    console.error(error)
  })

  // Handle incoming data connection
  peer.on('connection', initialiseConnection)
}
