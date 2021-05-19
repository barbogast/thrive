import React, { useState } from 'react'
import { useUpdateMyName } from '../hooks/useConnection'

import { useStore } from '../state'

const PlayerName: React.FC = function PlayerName() {
  const { playerName, setPlayerName } = useStore((state) => ({
    setPlayerName: state.setPlayerName,
    playerName: state.player.name,
  }))
  const updateMyName = useUpdateMyName()
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
