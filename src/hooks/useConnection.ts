import Peer, { DataConnection } from 'peerjs'
import { useEffect, useState, useRef } from 'react'
import { useStore } from '../state'
import usePlayerId from './usePlayerId'

const log = console.log

function useConnection() {
  const [peerId, setPeerId] = useState<string | void>()
  const playerId = usePlayerId()
  const peerRef = useRef<Peer>()
  const { state, updateGameState, connectToPlayer, friendDisconnected } =
    useStore((state) => ({
      state: state,
      updateGameState: state.updateGameState,
      connectToPlayer: state.connectToPlayer,
      friendDisconnected: state.friendDisconnected,
    }))

  const connectToPeer = (playerId: string) => {
    if (!peerRef.current) {
      return
    }

    log(`Connecting to ${playerId}...`)

    let conn = peerRef.current.connect(playerId)
    conn.on('data', (data) => {
      log(`received: ${data}`)
    })

    conn.on('open', () => {
      conn.send({ method: 'connect', args: { playerId } })
    })
  }

  const sendState = () => {
    if (!peerRef.current) {
      return
    }

    const connections: { [peerId: string]: DataConnection[] } =
      peerRef.current.connections

    for (const conns of Object.values(connections)) {
      for (const conn of conns) {
        conn.send(state.games)
      }
    }
  }

  useEffect(() => {
    peerRef.current = new Peer(playerId, { debug: 3 })

    peerRef.current.on('open', (id) => {
      setPeerId(id)
      log('My peer ID is: ' + id)
    })

    peerRef.current.on('error', (error) => {
      console.error(error)
    })

    // Handle incoming data connection
    peerRef.current.on('connection', (conn) => {
      let connectedPlayerId: string
      log('incoming peer connection!')

      conn.on('data', (data) => {
        log(`received:`, data)
        if (typeof data === 'object') {
          if (data.method === 'connect') {
            connectedPlayerId = data.args.playerId
            connectToPlayer(connectedPlayerId)
          }
          updateGameState('a', data)
        }
      })

      conn.on('open', () => {
        conn.send('hello!')
      })

      conn.on('close', () => {
        friendDisconnected(connectedPlayerId)
      })

      conn.on('error', (err) => {
        console.log('error', err, connectedPlayerId)
        friendDisconnected(connectedPlayerId)
      })
    })
  }, [])

  return { peerId, connectToPeer, sendState }
}

export default useConnection
