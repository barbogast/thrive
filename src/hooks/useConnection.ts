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
  const {
    state,
    updateGameState,
    connectToPlayer,
    friendDisconnected,
    friends,
  } = useStore((state) => ({
    state: state,
    updateGameState: state.updateGameState,
    connectToPlayer: state.connectToPlayer,
    friendDisconnected: state.friendDisconnected,
    friends: state.friends,
  }))

  function initialiseConnection(conn: DataConnection) {
    let connectedPlayerId: string
    log('incoming peer connection!')

    conn.on('data', (data) => {
      log(`received:`, data)
      if (typeof data === 'object') {
        if (data.method === 'introduce') {
          connectedPlayerId = data.args.playerId
          connectToPlayer(connectedPlayerId)
          log('add connection, ', connectedPlayerId)
          setConnections((conns) => ({ ...conns, [connectedPlayerId]: conn }))
        } else if (data.method === 'updateGameState') {
          updateGameState(data.args.gameId, data.args.newState)
        }
      }
    })

    conn.on('open', () => {
      conn.send({ method: 'introduce', args: { playerId: myPlayerId } })
    })

    conn.on('close', () => {
      friendDisconnected(connectedPlayerId)
    })

    conn.on('error', (err) => {
      console.log('error', err, connectedPlayerId)
      friendDisconnected(connectedPlayerId)
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

  const sendState = (gameId: string, newState: GameState) => {
    if (!peerRef.current) {
      return
    }

    for (const playerId of Object.keys(state.games[gameId].players)) {
      if (!friends[playerId].isRemote) {
        continue
      }
      const conn = connections[playerId]
      conn.send({ method: 'updateGameState', args: { gameId, newState } })
    }
  }

  useEffect(() => {
    peerRef.current = new Peer(myPlayerId, { debug: DEBUG_LEVEL })

    peerRef.current.on('open', (id) => {
      setPeerId(id)
      log('My peer ID is: ' + id)

      for (const friendId in friends) {
        if (friends[friendId].isRemote) {
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

  return { peerId, connectToPeer, sendState }
}

export default useConnection
