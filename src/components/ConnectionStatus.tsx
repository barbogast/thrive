import React from 'react'

import { useTempStore } from '../state/tempState'
import Box from './Box'

type Props = {
  id: string
}

const ConnectionStatus: React.FC<Props> = function Friend({ id }) {
  const localStore = useTempStore((state) => ({
    friendState: state.friendState,
  }))

  return (
    <Box color={localStore.friendState[id]?.connection ? 'green' : 'red'} />
  )
}

export default ConnectionStatus
