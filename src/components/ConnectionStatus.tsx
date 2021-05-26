import React from 'react'

import { useLocalStore } from '../state/localState'
import Box from './Box'

type Props = {
  id: string
}

const ConnectionStatus: React.FC<Props> = function Friend({ id }) {
  const localStore = useLocalStore((state) => ({
    friendState: state.uiState.friendState,
  }))

  return (
    <Box color={localStore.friendState[id]?.connection ? 'green' : 'red'} />
  )
}

export default ConnectionStatus
