import React from 'react'

import { useStore } from '../state'
import Box from '../components/Box'

type Props = {
  friendId: string
}

const Friend: React.FC<Props> = function Friend({ friendId }) {
  const store = useStore((state) => ({
    player: state.player,
    friends: state.friends,
    friendState: state.uiState.friendState,
  }))

  if (friendId === store.player.id) {
    return <>{store.player.name}</>
  }

  const friend = store.friends[friendId]
  if (!friend) {
    return <> </>
  }
  return (
    <>
      {friend.name}
      {friend.isRemote && (
        <Box
          color={store.friendState[friendId]?.connection ? 'green' : 'red'}
        />
      )}
    </>
  )
}

export default Friend
