import React from 'react'

import { useStore } from '../state'
import Box from '../components/Box'

function MainMenu() {
  const { friends, friendState, setFriendName, toggleFriendSelection } =
    useStore((state) => ({
      friends: state.friends,
      friendState: state.uiState.friendState,
      setFriendName: state.setFriendName,
      toggleFriendSelection: state.toggleFriendSelection,
    }))

  return (
    <ul>
      {Object.values(friends).map((friend) => (
        <li key={friend.id}>
          <input
            type="checkbox"
            checked={Boolean(friendState[friend.id]?.isSelected)}
            onChange={() => toggleFriendSelection(friend.id)}
          />
          {friend.id} {friend.name}
          {!friend.isRemote && (
            <input
              value={friend.name}
              onChange={(e) => setFriendName(friend.id, e.target.value)}
            />
          )}
          {friend.isRemote && (
            <Box color={friendState[friend.id]?.connection ? 'green' : 'red'} />
          )}
        </li>
      ))}
    </ul>
  )
}

export default MainMenu
