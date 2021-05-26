import React, { useState } from 'react'
import { updateMyName } from '../hooks/useConnection'

import { useStore } from '../state'
import * as setters from '../state/setters'

const PlayerName: React.FC = function PlayerName() {
  const store = useStore((state) => ({
    myName: state.friends[state.myId].name,
    get: state.get,
    set: state.set,
  }))
  const [value, setValue] = useState<string>(store.myName)

  const save = (name: string) => {
    setters.setMyName(store)(value)
    updateMyName(store)(name)
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
