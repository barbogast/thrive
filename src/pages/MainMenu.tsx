import React from 'react'
import { Link } from 'wouter'
import { nanoid } from 'nanoid'
import { useLocation } from 'wouter'

import { useStore } from '../state'
import usePlayerId from '../hooks/usePlayerId'
import PlayerName from '../components/PlayerName'
import FriendsList from '../components/FriendsList'

type Props = {
  updateMyName: (newName: string) => void
}

function MainMenu({ updateMyName }: Props) {
  const [location, setLocation] = useLocation()
  const playerId = usePlayerId()
  const {
    initialise,
    games,
    friends,
    friendState,
    addLocalPlayer,
    removeSelectedPlayers,
  } = useStore((state) => ({
    initialise: state.initialise,
    games: state.games,
    friends: state.friends,
    addLocalPlayer: state.addLocalPlayer,
    removeSelectedPlayers: state.removeSelectedPlayers,
    friendState: state.uiState.friendState,
  }))

  const createGame = () => {
    const friendsToInvite = Object.values(friends)
      .filter((friend) => friendState[friend.id]?.isSelected)
      .map((friend) => friend.id)

    const gameId = nanoid()
    initialise(gameId, friendsToInvite)
    setLocation(`/play/${gameId}`)
  }

  const inviteLink = `${window.location.host + '?connect=' + playerId}`
  return (
    <>
      <PlayerName updateMyName={updateMyName} playerId={playerId} />
      <div>
        Existing games
        <ul>
          {Object.keys(games).map((gameId) => (
            <li key={gameId}>
              <Link href={`/play/${gameId}`}>
                <a className="link">Play {gameId}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        Contacts
        <div>
          <FriendsList />
          <button onClick={() => addLocalPlayer(nanoid())}>
            Add local player
          </button>{' '}
          <button onClick={removeSelectedPlayers}>Remove players</button>{' '}
          <button onClick={createGame}>Create game</button>
          <br />
          Invite new contacts by sharing this link:
          <a href={inviteLink}>{inviteLink}</a>
        </div>
      </div>
    </>
  )
}

export default MainMenu
