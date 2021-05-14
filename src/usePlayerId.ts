import { nanoid } from 'nanoid'

import { useStore } from './state'

function usePlayerId(): string {
  let { playerId, setPlayerId } = useStore((state) => ({
    playerId: state.player?.id,
    setPlayerId: state.setPlayerId,
  }))

  if (!playerId) {
    playerId = nanoid()
    setPlayerId(playerId)
  }
  return playerId
}

export default usePlayerId
