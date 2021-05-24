import React from 'react'

import { useStore } from '../state'
import ConnectionStatus from './ConnectionStatus'

const FriendsList: React.FC = function FriendsList() {
  const store = useStore((state) => ({
    myId: state.myId,
    friends: state.friends,
    friendState: state.uiState.friendState,
    setFriendName: state.setFriendName,
    toggleFriendSelection: state.toggleFriendSelection,
  }))

  return (
    <ul>
      {Object.values(store.friends).map((friend) => (
        <li key={friend.id}>
          <input
            type="checkbox"
            checked={Boolean(store.friendState[friend.id]?.isSelected)}
            onChange={() => store.toggleFriendSelection(friend.id)}
          />
          {friend.name}
          {friend.peerId !== store.myId && <ConnectionStatus id={friend.id} />}
          {friend.peerId === store.myId && (
            <input
              value={friend.name}
              onChange={(e) => store.setFriendName(friend.id, e.target.value)}
            />
          )}
        </li>
      ))}
    </ul>
  )
}

export default FriendsList
