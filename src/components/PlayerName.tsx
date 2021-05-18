import React, { useState } from 'react'
import { useController } from '../hooks/useConnection'

import { useStore } from '../state'

function PlayerName() {
  const { playerName, setPlayerName } = useStore((state) => ({
    setPlayerName: state.setPlayerName,
    playerName: state.player.name,
  }))
  const contoller = useController()
  const [value, setValue] = useState<string>(playerName)

  const save = (name: string) => {
    setPlayerName(value)
    contoller.updateMyName(name)
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
