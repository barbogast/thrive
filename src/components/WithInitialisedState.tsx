import React, { ReactChild, ReactChildren, useState } from 'react'

import * as state from '../state/localState'
import * as gameState from '../state/gameState'

type Props = {
  children: ReactChildren | ReactChild
}

// Adapted from https://github.com/pmndrs/zustand/issues/346#issuecomment-831305132
const WithInitialisedState: React.FC<Props> = function WithInitialisedState({
  children,
}) {
  const [rehydrated1, setRehydrated1] = useState(false)
  const [useStore1] = useState(() =>
    state.initialiseStore(() => setRehydrated1(true)),
  )

  const [rehydrated2, setRehydrated2] = useState(false)
  const [useStore2] = useState(() =>
    gameState.initialiseStore(() => setRehydrated2(true)),
  )

  if (!rehydrated1 || !rehydrated2) {
    return <></>
  }

  return (
    <state.Provider initialStore={useStore1}>
      <gameState.Provider initialStore={useStore2}>
        {children}
      </gameState.Provider>
    </state.Provider>
  )
}

export default WithInitialisedState
