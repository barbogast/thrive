import Peer, { DataConnection } from 'peerjs'
import { useEffect, useState, useRef } from 'react'
import useStore from './state'

function useConnection() {
  const [peerId, setPeerId] = useState<string | void>()
  const peerRef = useRef<Peer>()
  const { state, updateGameState } = useStore((state) => ({
    state: state,
    updateGameState: state.updateGameState,
  }))

  const connectToPeer = (gameId: string) => {
    if (!peerRef.current) {
      return
    }

    console.log(`Connecting to ${gameId}...`)

    let conn = peerRef.current.connect(gameId)
    conn.on('data', (data) => {
      console.log(`received: ${data}`)
    })
    conn.on('open', () => {
      conn.send('hi!')
    })
  }

  const sendState = () => {
    console.log(peerRef.current?.connections)
    console.log(state.gameState)
    if (!peerRef.current) {
      return
    }

    const connections: { [peerId: string]: DataConnection[] } =
      peerRef.current.connections

    for (const conns of Object.values(connections)) {
      for (const conn of conns) {
        conn.send(state.gameState)
      }
    }
  }

  useEffect(() => {
    peerRef.current = new Peer()

    peerRef.current.on('open', (id) => {
      setPeerId(id)
      console.log('My peer ID is: ' + id)
    })

    peerRef.current.on('error', (error) => {
      console.error(error)
    })

    // Handle incoming data connection
    peerRef.current.on('connection', (conn) => {
      console.log('incoming peer connection!')
      conn.on('data', (data) => {
        console.log(`received: ${data}`, data)
        if (typeof data === 'object') {
          updateGameState(data)
        }
      })
      conn.on('open', () => {
        conn.send('hello!')
      })
    })
  }, [])

  return { peerId, connectToPeer, sendState }
}

export default useConnection
