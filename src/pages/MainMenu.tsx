import React from 'react'
import { Link } from 'wouter'
import { nanoid } from 'nanoid'
import { useLocation } from 'wouter'

import { useStore } from '../state'
import usePlayerId from '../hooks/usePlayerId'
import PlayerName from '../components/PlayerName'
import FriendsList from '../components/FriendsList'
import Friend from '../components/Friend'
import { useInviteToGame } from '../hooks/useConnection'

const MainMenu: React.FC = function MainMenu() {
  const [, setLocation] = useLocation()
  const playerId = usePlayerId()
  const store = useStore((state) => ({
    initialise: state.initialise,
    games: state.games,
    friends: state.friends,
    addLocalPlayer: state.addLocalPlayer,
    removeSelectedPlayers: state.removeSelectedPlayers,
    friendState: state.uiState.friendState,
  }))
  const inviteToGame = useInviteToGame()

  const createGame = () => {
    const friendsToInvite = Object.values(store.friends)
      .filter((friend) => store.friendState[friend.id]?.isSelected)
      .map((friend) => friend.id)

    const gameId = nanoid()
    const get = store.initialise(gameId, friendsToInvite.concat(playerId))
    inviteToGame(get, friendsToInvite, gameId)

    setLocation(`/play/${gameId}`)
  }

  const inviteLink = `${window.location.protocol}//${
    window.location.host + '?connect=' + playerId
  }`
  return (
    <>
      <PlayerName />
      <div>
        Existing games
        <ul>
          {Object.entries(store.games).map(([gameId, game]) => (
            <li key={gameId}>
              <Link href={`/play/${gameId}`}>
                <a className="link">Play {gameId}</a>
              </Link>
              {Object.keys(game.players).map((playerId) => (
                <Friend key={playerId} friendId={playerId} />
              ))}
            </li>
          ))}
        </ul>
      </div>
      <div>
        Contacts
        <div>
          <FriendsList />
          <button onClick={() => store.addLocalPlayer(nanoid())}>
            Add local player
          </button>{' '}
          <button onClick={store.removeSelectedPlayers}>Remove players</button>{' '}
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
