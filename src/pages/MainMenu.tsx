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
    player: state.player,
  }))
  const inviteToGame = useInviteToGame()

  const createGame = () => {
    const friendsToInvite = Object.values(store.friends)
      .filter((friend) => store.friendState[friend.id]?.isSelected)
      .concat([
        { id: store.player.id, name: store.player.name, isRemote: false },
      ])

    const gameId = nanoid()
    const get = store.initialise(gameId, friendsToInvite)
    inviteToGame(get, gameId)

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
              {Object.values(game.players).map((player) => (
                <Friend key={player.id} friend={player} />
              ))}
            </li>
          ))}
        </ul>
      </div>
      <div>
        Contacts
        <div>
          <FriendsList />
          <button onClick={() => store.addLocalPlayer(nanoid(), '')}>
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
