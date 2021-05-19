import { customAlphabet } from 'nanoid'

import { useStore } from '../state'

// Omit special characters so the id can be used with peerjs (which dislikes "-")
const aphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const getId = customAlphabet(aphabet, 21)

function usePlayerId(): string {
  let { playerId, setPlayerId } = useStore((state) => ({
    playerId: state.player?.id,
    setPlayerId: state.setPlayerId,
  }))

  if (!playerId) {
    playerId = getId()
    setPlayerId(playerId)
  }
  return playerId
}

export default usePlayerId
