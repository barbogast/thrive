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
      <h3>Games</h3>
      <GameList />
      <h3>Contacts</h3>
      <FriendsList />
      <button onClick={removeSelectedPlayers}>Remove players</button>{' '}
      <h3>Settings</h3>
      <PlayerName label="Your name" />
    </>
  )
}

export default MainMenu
