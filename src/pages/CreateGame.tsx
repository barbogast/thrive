import React, { useEffect } from 'react'
import { nanoid } from 'nanoid'
import { useLocation } from 'wouter'

import { useLocalStore } from '../state/localState'
import PlayerName from '../components/PlayerName'
import FriendsList from '../components/FriendsList'
import BoardSettingsForm from '../components/BoardSettingsForm'
import BackButton from '../components/BackButton'
import PreviewBoard from '../components/PreviewBoard'
import { addLocalPlayer, createGame, generateBoard } from '../state/setters'

const CreateGame: React.FC = function CreateGame() {
  const [, setLocation] = useLocation()
  const localStore = useLocalStore((state) => ({
    myId: state.myId,
    friends: state.friends,
  }))

  useEffect(generateBoard, [])

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
      <BackButton />
      <div>
        <h3>Board settings</h3>
        <BoardSettingsForm onChange={generateBoard} />
        <PreviewBoard />
        <button onClick={generateBoard}>Reshuffle</button>
        <h3>Players</h3>
        <FriendsList showLocalPlayers />
        <button onClick={() => addLocalPlayer(nanoid(), '')}>
          Add local player
        </button>{' '}
        <br />
        Invite new contacts by sharing this link:
        <a href={inviteLink}>{inviteLink}</a>
      </div>
      <button onClick={create}>Create game</button>
    </>
  )
}

export default CreateGame
