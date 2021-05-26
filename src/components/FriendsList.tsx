import React from 'react'

import { useStore, useStores } from '../state'
import ConnectionStatus from './ConnectionStatus'
import * as setters from '../state/setters'

const FriendsList: React.FC = function FriendsList() {
  const store = useStore((state) => ({
    myId: state.myId,
    friends: state.friends,
    friendState: state.uiState.friendState,
  }))
  const stores = useStores()

  return (
    <ul>
      {Object.values(store.friends).map((friend) => (
        <li key={friend.id}>
          <input
            type="checkbox"
            checked={Boolean(store.friendState[friend.id]?.isSelected)}
            onChange={() => setters.toggleFriendSelection(stores)(friend.id)}
          />
          {friend.name}
          {friend.peerId !== store.myId && <ConnectionStatus id={friend.id} />}
          {friend.peerId === store.myId && (
            <input
              value={friend.name}
              onChange={(e) =>
                setters.setFriendName(stores)(friend.id, e.target.value)
              }
            />
          )}
        </li>
      ))}
    </ul>
  )
}

export default FriendsList
