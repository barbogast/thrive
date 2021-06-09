import React from 'react'
import { nanoid } from 'nanoid'

import { useLocalStore } from '../state/localState'
import PlayerName from '../components/PlayerName'
import FriendsList from '../components/FriendsList'
import GameList from '../components/GameList'
import { addLocalPlayer, removeSelectedPlayers } from '../state/setters'

const MainMenu: React.FC = function MainMenu() {
  const localStore = useLocalStore((state) => ({
    get: state.get,
    set: state.set,
    myId: state.myId,
    friends: state.friends,
  }))

  if (!localStore.friends[localStore.myId].name) {
    return (
      <>
        <PlayerName label="What's your name?" />
      </>
    )
  }

  return (
    <>
      <PlayerName label="Your name" />
      <GameList />
      <div>
        Contacts
        <div>
          <FriendsList />
          <button onClick={() => addLocalPlayer(nanoid(), '')}>
            Add local player
          </button>{' '}
          <button onClick={removeSelectedPlayers}>Remove players</button>{' '}
        </div>
      </div>
    </>
  )
}

export default MainMenu
