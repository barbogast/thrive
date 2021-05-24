import React, { ReactChild, ReactChildren, useState } from 'react'

import { initialiseStore, Provider } from '../state'

type Props = {
  children: ReactChildren | ReactChild
}

// Adapted from https://github.com/pmndrs/zustand/issues/346#issuecomment-831305132
const WithInitialisedState: React.FC<Props> = function WithInitialisedState({
  children,
}) {
  const [rehydrated, setRehydrated] = useState(false)
  const [useStore] = useState(() => initialiseStore(() => setRehydrated(true)))
  if (!rehydrated) {
    return <></>
  }

  return <Provider initialStore={useStore}>{children}</Provider>
}

export default WithInitialisedState
