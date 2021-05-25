import React from 'react'
import { Link } from 'wouter'
import { nanoid } from 'nanoid'
import { useLocation } from 'wouter'

import { useController, useStore } from '../state'
import PlayerName from '../components/PlayerName'
import FriendsList from '../components/FriendsList'
import { getControllers } from '../hooks/useConnection'
import ConnectionStatus from '../components/ConnectionStatus'

const MainMenu: React.FC = function MainMenu() {
  const [, setLocation] = useLocation()
  const store = useStore((state) => ({
    myId: state.myId,
    initialise: state.initialise,
    games: state.games,
    friends: state.friends,
    addLocalPlayer: state.addLocalPlayer,
    removeSelectedPlayers: state.removeSelectedPlayers,
    friendState: state.uiState.friendState,
  }))
  const controllers = useController(getControllers)

  const createGame = () => {
    const friendsToInvite = Object.values(store.friends).filter(
      (friend) => store.friendState[friend.id]?.isSelected,
    )

    const gameId = nanoid()
    store.initialise(gameId, friendsToInvite)
    controllers.inviteToGame(gameId)

    setLocation(`/play/${gameId}`)
  }

  const inviteLink = `${window.location.protocol}//${
    window.location.host + '?connect=' + store.myId
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
                <span key={player.id}>
                  {player.name}
                  {player.peerId !== store.myId ? (
                    <ConnectionStatus id={player.peerId} />
                  ) : (
                    <></>
                  )}
                </span>
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
