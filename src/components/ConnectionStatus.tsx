import React from 'react'

import { useStore } from '../state'
import Box from './Box'

type Props = {
  id: string
}

const ConnectionStatus: React.FC<Props> = function Friend({ id }) {
  const store = useStore((state) => ({
    friendState: state.uiState.friendState,
  }))

  return <Box color={store.friendState[id]?.connection ? 'green' : 'red'} />
}

export default ConnectionStatus
