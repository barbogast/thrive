import React from 'react'

import { Friend, FriendState } from '../state'
import Box from '../components/Box'

type Props = {
  friend: Friend | void
  friendState: FriendState | void
}

const Friend: React.FC<Props> = function Friend({ friend, friendState }) {
  if (!friend || !friendState) {
    return <> </>
  }
  return (
    <>
      {friend?.id} {friend?.name}
      {friend?.isRemote && (
        <Box color={friendState?.connection ? 'green' : 'red'} />
      )}
    </>
  )
}

export default Friend
