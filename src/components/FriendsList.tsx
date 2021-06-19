import React from 'react'

import { useLocalStore } from '../state/localState'
import ConnectionStatus from './ConnectionStatus'
import * as setters from '../state/setters'
import { useTempStore } from '../state/tempState'

type Props = {
  showLocalPlayers?: boolean
}

const FriendsList: React.FC<Props> = function FriendsList({
  showLocalPlayers,
}) {
  const localStore = useLocalStore((state) => ({
    myId: state.myId,
    friends: state.friends,
  }))
  const tempStore = useTempStore((state) => ({
    friendState: state.friendState,
  }))

  let players = Object.values(localStore.friends)

  if (!showLocalPlayers) {
    players = players.filter((player) => player.peerId !== localStore.myId)
  }

  return (
    <ul>
      {players.map((friend) => (
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
