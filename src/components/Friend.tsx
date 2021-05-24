import React from 'react'

import { useStore, Friend } from '../state'
import Box from '../components/Box'

type Props = {
  friend: Friend
}

const Friend: React.FC<Props> = function Friend({ friend }) {
  const store = useStore((state) => ({
    player: state.player,
    friendState: state.uiState.friendState,
  }))

  if (friend.id === store.player.id) {
    return <>{store.player.name}</>
  }

  return (
    <>
      {friend.name}
      {friend.isRemote && (
        <Box
          color={store.friendState[friend.id]?.connection ? 'green' : 'red'}
        />
      )}
    </>
  )
}

export default Friend
