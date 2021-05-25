import Peer, { DataConnection } from 'peerjs'
import { useEffect, useRef } from 'react'
import { GameState } from '../game'
import { useStore, Friend, Store, useController } from '../state'

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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getControllers(store: Store) {
  const send = (friends: { [id: string]: Friend }, call: RemoteCallPayload) => {
    for (const friend of Object.values(friends)) {
      if (friend.peerId === store.get().myId) {
        continue
      }

      const conn = store.get().uiState.friendState[friend.id]?.connection
      if (!conn) {
        console.error(`Friend ${friend.id} has no connection`)
        continue
      }
      conn.send(call)
    }
  }

  const sendState = (gameId: string, newState: GameState): void => {
    send(store.get().games[gameId].players, {
      method: 'updateGameState',
      args: { gameId, newState },
    })
  }

  const updateMyName = (newName: string): void => {
    send(store.get().friends, {
      method: 'updateMyName',
      args: { newName },
    })
  }

  const inviteToGame = (gameId: string): void => {
    const gameState = store.get().games[gameId]
    send(gameState.players, {
      method: 'inviteToGame',
      args: { gameId, gameState },
    })
  }

  const initialiseConnection = (conn: DataConnection) => {
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
          store
            .get()
            .addFriendConnection(connectedPlayerId, data.args.playerName, conn)
          log('add connection, ', connectedPlayerId)
          break
        }

        case 'inviteToGame': {
          store.get().updateGameState(data.args.gameId, data.args.gameState)
          break
        }

        case 'updateMyName': {
          store.get().setFriendName(connectedPlayerId, data.args.newName)
          break
        }

        case 'updateGameState': {
          store.get().updateGameState(data.args.gameId, data.args.newState)
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
          playerId: store.get().myId,
          playerName: store.get().friends[store.get().myId].name,
        },
      })
    })

    conn.on('close', () => {
      // Looks like peerjs doesn't correctly handle closing connections, so this doesn't work...
      // https://stackoverflow.com/questions/64651890/peerjs-close-video-call-not-firing-close-event/67404616#67404616
      // https://github.com/peers/peerjs/issues/822
      store.get().removeFriendConnection(connectedPlayerId)
    })

    conn.on('error', (err) => {
      console.error('error', err, connectedPlayerId)
      store.get().removeFriendConnection(connectedPlayerId)
    })
  }

  return {
    updateMyName,
    initialiseConnection,
    inviteToGame,
    sendState,
  } as const
}

function useConnection(): {
  connectToPeer: (connectToId: string) => void
} {
  const peerRef = useRef<Peer>()
  const store = useStore((state) => ({
    get: state.get,
    set: state.set,
    friends: state.friends,
    myId: state.myId,
  }))
  const controllers = useController(getControllers)

  const connectToPeer = (connectToId: string) => {
    if (!peerRef.current) {
      return
    }
    log(`Connecting to ${store.myId}...`)
    const conn = peerRef.current.connect(connectToId)
    controllers.initialiseConnection(conn)
  }

  useEffect(() => {
    peerRef.current = new Peer(store.myId, { debug: DEBUG_LEVEL })

    peerRef.current.on('open', (id) => {
      log('My peer ID is: ' + id)

      for (const friendId in store.friends) {
        if (store.friends[friendId].peerId !== store.myId) {
          connectToPeer(friendId)
        }
      }
    })

    peerRef.current.on('error', (error) => {
      console.error(error)
    })

    // Handle incoming data connection
    peerRef.current.on('connection', controllers.initialiseConnection)
  }, [])

  return { connectToPeer }
}

export default useConnection
