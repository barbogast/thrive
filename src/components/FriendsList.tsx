import React from 'react'

import { useLocalStore, useStores } from '../state/localState'
import ConnectionStatus from './ConnectionStatus'
import * as setters from '../state/setters'

const FriendsList: React.FC = function FriendsList() {
  const localStore = useLocalStore((state) => ({
    myId: state.myId,
    friends: state.friends,
    friendState: state.uiState.friendState,
  }))
  const stores = useStores()

  return (
    <ul>
      {Object.values(localStore.friends).map((friend) => (
        <li key={friend.id}>
          <input
            type="checkbox"
            checked={Boolean(localStore.friendState[friend.id]?.isSelected)}
            onChange={() => setters.toggleFriendSelection(stores)(friend.id)}
          />
          {friend.name}
          {friend.peerId !== localStore.myId && (
            <ConnectionStatus id={friend.id} />
          )}
          {friend.peerId === localStore.myId && (
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
