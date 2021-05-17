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
    addFriendConnection,
    removeFriendConnection,
    friends,
    friendState,
    myPlayerName,
    setFriendName,
  } = useStore((state) => ({
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
          addFriendConnection(connectedPlayerId, data.args.playerName, conn)
          log('add connection, ', connectedPlayerId)
        } else if (data.method === 'updateMyName') {
          setFriendName(connectedPlayerId, data.args.newName)
        } else if (data.method === 'updateGameState') {
          updateGameState(data.args.gameId, data.args.newState)
        }
      }
    })

    conn.on('open', () => {
      conn.send({
        method: 'introduce',
        args: { playerId: myPlayerId, playerName: myPlayerName },
      })
    })

    conn.on('close', () => {
      removeFriendConnection(connectedPlayerId)
    })

    conn.on('error', (err) => {
      console.log('error', err, connectedPlayerId)
      removeFriendConnection(connectedPlayerId)
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
    for (const playerId of Object.keys(state.games[gameId].players)) {
      if (!friends[playerId].isRemote) {
        continue
      }
      const conn = friendState[playerId].connection
      if (!conn) {
        console.error(`Friend ${playerId} has no connection`)
        continue
      }
      conn.send({ method: 'updateGameState', args: { gameId, newState } })
    }
  }

  const updateMyName = (newName: string) => {
    for (const friendId of Object.keys(state.friends)) {
      if (!friends[friendId].isRemote) {
        continue
      }
      const conn = friendState[friendId].connection
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

  return { peerId, connectToPeer, sendState, updateMyName }
}

export default useConnection
