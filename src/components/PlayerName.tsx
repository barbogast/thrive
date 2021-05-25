import React, { useState } from 'react'
import { getControllers } from '../hooks/useConnection'

import { useController, useStore } from '../state'

const PlayerName: React.FC = function PlayerName() {
  const store = useStore((state) => ({
    setMyName: state.setMyName,
    myName: state.friends[state.myId].name,
    get: state.get,
    set: state.set,
  }))
  const controllers = useController(getControllers)
  const [value, setValue] = useState<string>(store.myName)

  const save = (name: string) => {
    store.setMyName(value)
    controllers.updateMyName(name)
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
