import Peer, { DataConnection } from 'peerjs'
import { useEffect, useState, useRef } from 'react'
import { GameState } from '../game'
import { useStore } from '../state'
import usePlayerId from './usePlayerId'

const DEBUG_LEVEL: 0 | 1 | 2 | 3 = 0

const log =
  // @ts-ignore: It's okay, relax
  DEBUG_LEVEL === 1
    ? () => {}
    : (...args: unknown[]) => console.log('NET: ', ...args)

function useConnection() {
  const [peerId, setPeerId] = useState<string | void>()
  const [connections, setConnections] = useState<{
    [friendId: string]: DataConnection
  }>({})

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

  const send = (
    playerIds: string[],
    payload: { method: string; args: { [key: string]: unknown } },
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
      conn.send(payload)
    }
  }

  const sendState = (gameId: string, newState: GameState) => {
    send(Object.keys(store.state.games[gameId].players), {
      method: 'updateGameState',
      args: { gameId, newState },
    })
  }

  const updateMyName = (newName: string) => {
    for (const friendId of Object.keys(store.state.friends)) {
      if (!store.friends[friendId].isRemote) {
        continue
      }
      const conn = store.friendState[friendId].connection
      if (!conn) {
        console.error(`Friend ${friendId} has no connection`)
        continue
      }
      conn.send({ method: 'updateMyName', args: { newName } })
    }
  }

  useEffect(() => {
    peerRef.current = new Peer(myPlayerId, { debug: DEBUG_LEVEL })

    peerRef.current.on('open', (id) => {
      setPeerId(id)
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

  return { peerId, connectToPeer, sendState, updateMyName }
}

export default useConnection
