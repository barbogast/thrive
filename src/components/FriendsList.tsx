import React from 'react'

import { useStore } from '../state'
import Friend from './Friend'

const FriendsList: React.FC = function FriendsList() {
  const store = useStore((state) => ({
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
          <Friend friend={friend} friendState={store.friendState[friend.id]} />
          {!friend.isRemote && (
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
