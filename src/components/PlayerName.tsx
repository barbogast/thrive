import React, { useState } from 'react'
import { updateMyName } from '../hooks/useConnection'

import { useLocalStore } from '../state/localState'
import * as setters from '../state/setters'

type Props = {
  label: string
}

const PlayerName: React.FC<Props> = function PlayerName({ label }) {
  const localStore = useLocalStore((state) => ({
    myName: state.friends[state.myId].name,
  }))
  const [value, setValue] = useState<string>(localStore.myName)

  const save = (name: string) => {
    setters.setMyName(value)
    updateMyName(name)
  }

  return (
    <div>
      <label>
        {label}
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <button onClick={() => save(value)}>Save</button>
    </div>
  )
}

export default PlayerName
