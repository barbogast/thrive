import React from 'react'
import { nanoid } from 'nanoid'
import { useLocation } from 'wouter'

import { useLocalStore } from '../state/localState'
import PlayerName from '../components/PlayerName'
import FriendsList from '../components/FriendsList'
import BoardSettingsForm from '../components/BoardSettingsForm'
import GameList from '../components/GameList'
import {
  addLocalPlayer,
  createGame,
  removeSelectedPlayers,
} from '../state/setters'

const MainMenu: React.FC = function MainMenu() {
  const [, setLocation] = useLocation()
  const localStore = useLocalStore((state) => ({
    get: state.get,
    set: state.set,
    myId: state.myId,
    friends: state.friends,
  }))

  const create = () => {
    const gameId = nanoid()
    createGame(gameId)
    setLocation(`/play/${gameId}`)
  }

  const inviteLink = `${window.location.protocol}//${
    window.location.host + '?connect=' + localStore.myId
  }`

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
          <BoardSettingsForm />
          <button onClick={() => addLocalPlayer(nanoid(), '')}>
            Add local player
          </button>{' '}
          <button onClick={removeSelectedPlayers}>Remove players</button>{' '}
          <button onClick={create}>Create game</button>
          <br />
          Invite new contacts by sharing this link:
          <a href={inviteLink}>{inviteLink}</a>
        </div>
      </div>
    </>
  )
}

export default MainMenu
