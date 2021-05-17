import React, { useState } from 'react'

import { useStore } from '../state'

function PlayerName() {
  const { playerName, setPlayerName } = useStore((state) => ({
    setPlayerName: state.setPlayerName,
    playerName: state.player.name,
  }))
  const [value, setValue] = useState<string>(playerName)

  return (
    <div>
      <label>
        Your name:
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <button onClick={() => setPlayerName(value)}>Save</button>
    </div>
  )
}

export default PlayerName
