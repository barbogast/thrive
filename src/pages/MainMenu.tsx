import React from 'react'

import { useLocalStore } from '../state/localState'
import PlayerName from '../components/PlayerName'
import FriendsList from '../components/FriendsList'
import GameList from '../components/GameList'
import { removeSelectedPlayers } from '../state/setters'

const MainMenu: React.FC = function MainMenu() {
  const localStore = useLocalStore((state) => ({
    myId: state.myId,
    friends: state.friends,
  }))

  if (!localStore.friends[localStore.myId].name) {
    return <PlayerName label="What's your name?" />
  }

  return (
    <>
      <GameList />
      <div>
        Contacts
        <div>
          <FriendsList />
          <button onClick={removeSelectedPlayers}>Remove players</button>{' '}
        </div>
        <PlayerName label="Your name" />
      </div>
    </>
  )
}

export default MainMenu
