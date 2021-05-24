import Peer, { DataConnection } from 'peerjs'
import { useEffect, useRef } from 'react'
import { GetState } from 'zustand'
import { GameState } from '../game'
import { State, Setter, useStore, Friend } from '../state'
import usePlayerId from './usePlayerId'

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
      args: { gameId: string; localPlayers: Friend[]; newState: GameState }
    }
  | {
      method: 'updateGameState'
      args: { gameId: string; newState: GameState }
    }
  | {
      method: 'updateMyName'
      args: { newName: string }
    }

const useSend = () => {
  const store = useStore((state) => ({
    friends: state.friends,
    friendState: state.uiState.friendState,
  }))
  const myPlayerId = usePlayerId()

  return (playerIds: string[], call: RemoteCallPayload) => {
    for (const playerId of playerIds) {
      if (playerId === myPlayerId || !store.friends[playerId].isRemote) {
        continue
      }

      const conn = store.friendState[playerId]?.connection
      if (!conn) {
        console.error(`Friend ${playerId} has no connection`)
        continue
      }
      conn.send(call)
    }
  }
}

export function useSendState(): (gameId: string, newState: GameState) => void {
  const store = useStore((state) => ({ games: state.games }))
  const send = useSend()
  return (gameId: string, newState: GameState) => {
    send(Object.keys(store.games[gameId].players), {
      method: 'updateGameState',
      args: {
        gameId,
        newState,
      },
    })
  }
}

export function useUpdateMyName(): (newName: string) => void {
  const store = useStore((state) => ({ friends: state.friends }))
  const send = useSend()
  return (newName: string) => {
    send(Object.keys(store.friends), {
      method: 'updateMyName',
      args: { newName },
    })
  }
}

export function useInviteToGame(): (
  get: GetState<State & Setter>,
  friendsToInvite: string[],
  gameId: string,
) => void {
  const send = useSend()
  return (get, friendsToInvite: string[], gameId: string) => {
    const gameState = get().games[gameId]
    const friends = get().friends
    const localPlayers = Object.keys(gameState.players)
      .filter((playerId) => playerId !== get().player.id)
      .map((playerId) => friends[playerId])
      .filter((player) => !player.isRemote)

    send(friendsToInvite, {
      method: 'inviteToGame',
      args: {
        gameId,
        newState: get().games[gameId],
        localPlayers,
      },
    })
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
    addLocalPlayer: state.addLocalPlayer,
  }))

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
          store.addFriendConnection(
            connectedPlayerId,
            data.args.playerName,
            conn,
          )
          log('add connection, ', connectedPlayerId)
          break
        }

        case 'inviteToGame': {
          for (const friend of data.args.localPlayers) {
            store.addLocalPlayer(friend.id, friend.name)
          }
          store.updateGameState(data.args.gameId, data.args.newState)
          break
        }

        case 'updateMyName': {
          store.setFriendName(connectedPlayerId, data.args.newName)
          break
        }

        case 'updateGameState': {
          store.updateGameState(data.args.gameId, data.args.newState)
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
        args: { playerId: myPlayerId, playerName: store.myPlayerName },
      })
    })

    conn.on('close', () => {
      // Looks like peerjs doesn't correctly handle closing connections, so this doesn't work...
      // https://stackoverflow.com/questions/64651890/peerjs-close-video-call-not-firing-close-event/67404616#67404616
      // https://github.com/peers/peerjs/issues/822
      store.removeFriendConnection(connectedPlayerId)
    })

    conn.on('error', (err) => {
      console.error('error', err, connectedPlayerId)
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
