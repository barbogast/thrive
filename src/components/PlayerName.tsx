import React, { useState } from 'react'

import { useStore } from '../state'

type Props = {
  playerId: string
  updateMyName: (newName: string) => void
}

function PlayerName({ playerId, updateMyName }: Props) {
  const { playerName, setPlayerName } = useStore((state) => ({
    setPlayerName: state.setPlayerName,
    playerName: state.player.name,
  }))
  const [value, setValue] = useState<string>(playerName)

  const save = (name: string) => {
    setPlayerName(value)
    updateMyName(name)
  }

  return (
    <div>
      <label>
        Your name:
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <button onClick={() => save(value)}>Save</button>
    </div>
  )
}

export default PlayerName
