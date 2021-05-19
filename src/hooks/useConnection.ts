import Peer, { DataConnection } from 'peerjs'
import { useEffect, useRef } from 'react'
import { GameState } from '../game'
import { useStore } from '../state'
import usePlayerId from './usePlayerId'

const DEBUG_LEVEL: 0 | 1 | 2 | 3 = 0

const log =
  // @ts-ignore: It's okay, relax
  DEBUG_LEVEL === 1
    ? () => {} // eslint-disable-line @typescript-eslint/no-empty-function
    : (...args: unknown[]) => console.log('NET: ', ...args)

const useSend = () => {
  const store = useStore((state) => ({
    friends: state.friends,
    friendState: state.uiState.friendState,
  }))
  const myPlayerId = usePlayerId()

  return (
    playerIds: string[],
    method: string,
    args: { [key: string]: unknown },
  ) => {
    for (const playerId of playerIds) {
      if (playerId === myPlayerId || !store.friends[playerId].isRemote) {
        continue
      }

      const conn = store.friendState[playerId].connection
      if (!conn) {
        console.error(`Friend ${playerId} has no connection`)
        continue
      }
      conn.send({ method, args })
    }
  }
}

export function useSendState(): (gameId: string, newState: GameState) => void {
  const store = useStore((state) => ({ games: state.games }))
  const send = useSend()
  return (gameId: string, newState: GameState) => {
    send(Object.keys(store.games[gameId].players), 'updateGameState', {
      gameId,
      newState,
    })
  }
}

export function useUpdateMyName(): (newName: string) => void {
  const store = useStore((state) => ({ friends: state.friends }))
  const send = useSend()
  return (newName: string) => {
    send(Object.keys(store.friends), 'updateMyName', { newName })
  }
}

function useConnection(): {
  connectToPeer: (connectToId: string) => void
} {
  const myPlayerId = usePlayerId()
  const peerRef = useRef<Peer>()
  const store = useStore((state) => ({
    state: state,
    updateGameState: state.updateGameState,
    addFriendConnection: state.addFriendConnection,
    removeFriendConnection: state.removeFriendConnection,
    friends: state.friends,
    friendState: state.uiState.friendState,
    myPlayerName: state.player.name,
    setFriendName: state.setFriendName,
  }))

  function initialiseConnection(conn: DataConnection) {
    let connectedPlayerId: string
    log('incoming peer connection!')

    conn.on('data', (data) => {
      log(`received:`, data)
      if (typeof data === 'object') {
        if (data.method === 'introduce') {
          connectedPlayerId = data.args.playerId
          store.addFriendConnection(
            connectedPlayerId,
            data.args.playerName,
            conn,
          )
          log('add connection, ', connectedPlayerId)
        } else if (data.method === 'updateMyName') {
          store.setFriendName(connectedPlayerId, data.args.newName)
        } else if (data.method === 'updateGameState') {
          store.updateGameState(data.args.gameId, data.args.newState)
        }
      }
    })

    conn.on('open', () => {
      conn.send({
        method: 'introduce',
        args: { playerId: myPlayerId, playerName: store.myPlayerName },
      })
    })

    conn.on('close', () => {
      store.removeFriendConnection(connectedPlayerId)
    })

    conn.on('error', (err) => {
      console.log('error', err, connectedPlayerId)
      store.removeFriendConnection(connectedPlayerId)
    })
  }

  const connectToPeer = (connectToId: string) => {
    if (!peerRef.current) {
      return
    }
    log(`Connecting to ${myPlayerId}...`)
    const conn = peerRef.current.connect(connectToId)
    initialiseConnection(conn)
  }

  useEffect(() => {
    peerRef.current = new Peer(myPlayerId, { debug: DEBUG_LEVEL })

    peerRef.current.on('open', (id) => {
      log('My peer ID is: ' + id)

      for (const friendId in store.friends) {
        if (store.friends[friendId].isRemote) {
          connectToPeer(friendId)
        }
      }
    })

    peerRef.current.on('error', (error) => {
      console.error(error)
    })

    // Handle incoming data connection
    peerRef.current.on('connection', initialiseConnection)
  }, [])

  return { connectToPeer }
}

export default useConnection
