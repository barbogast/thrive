import React from 'react'

import { useLocalStore } from '../state/localState'
import ConnectionStatus from './ConnectionStatus'
import * as setters from '../state/setters'
import { useTempStore } from '../state/tempState'

const FriendsList: React.FC = function FriendsList() {
  const localStore = useLocalStore((state) => ({
    myId: state.myId,
    friends: state.friends,
  }))
  const tempStore = useTempStore((state) => ({
    friendState: state.friendState,
  }))

  return (
    <ul>
      {Object.values(localStore.friends).map((friend) => (
        <li key={friend.id}>
          <input
            type="checkbox"
            checked={Boolean(tempStore.friendState[friend.id]?.isSelected)}
            onChange={() => setters.toggleFriendSelection(friend.id)}
          />
          {friend.name}
          {friend.peerId !== localStore.myId && (
            <ConnectionStatus id={friend.id} />
          )}
          {friend.peerId === localStore.myId && (
            <input
              value={friend.name}
              onChange={(e) => setters.setFriendName(friend.id, e.target.value)}
            />
          )}
        </li>
      ))}
    </ul>
  )
}

export default FriendsList
