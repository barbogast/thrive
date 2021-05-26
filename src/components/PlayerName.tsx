import React, { useState } from 'react'
import { updateMyName } from '../hooks/useConnection'

import { useLocalStore } from '../state/localState'
import { useStores } from '../state/useStores'
import * as setters from '../state/setters'

const PlayerName: React.FC = function PlayerName() {
  const localStore = useLocalStore((state) => ({
    myName: state.friends[state.myId].name,
  }))
  const stores = useStores()
  const [value, setValue] = useState<string>(localStore.myName)

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
