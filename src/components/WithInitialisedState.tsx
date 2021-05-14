import React, { ReactChild, ReactChildren, useState } from 'react'

import { initialiseStore, Provider } from '../state'

type Props = {
  children: ReactChildren | ReactChild
}

function WithInitialisedState({ children }: Props): JSX.Element {
  const [rehydrated, setRehydrated] = useState(false)
  const [useStore] = useState(() => initialiseStore(() => setRehydrated(true)))
  if (!rehydrated) {
    return <></>
  }

  return <Provider initialStore={useStore}>{children}</Provider>
}

export default WithInitialisedState
