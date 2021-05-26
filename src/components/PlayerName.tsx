import React, { useState } from 'react'
import { updateMyName } from '../hooks/useConnection'

import { useStore, useStores } from '../state'
import * as setters from '../state/setters'

const PlayerName: React.FC = function PlayerName() {
  const store = useStore((state) => ({
    myName: state.friends[state.myId].name,
  }))
  const stores = useStores()
  const [value, setValue] = useState<string>(store.myName)

  const save = (name: string) => {
    setters.setMyName(stores)(value)
    updateMyName(stores)(name)
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
