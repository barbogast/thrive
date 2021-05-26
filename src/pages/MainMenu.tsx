import React from 'react'
import { Link } from 'wouter'
import { nanoid } from 'nanoid'
import { useLocation } from 'wouter'

import { useStore } from '../state'
import PlayerName from '../components/PlayerName'
import FriendsList from '../components/FriendsList'
import { inviteToGame } from '../hooks/useConnection'
import ConnectionStatus from '../components/ConnectionStatus'
import {
  addLocalPlayer,
  initialise,
  removeSelectedPlayers,
} from '../state/setters'

const MainMenu: React.FC = function MainMenu() {
  const [, setLocation] = useLocation()
  const store = useStore((state) => ({
    get: state.get,
    set: state.set,
    myId: state.myId,
    games: state.games,
    friends: state.friends,
    friendState: state.uiState.friendState,
  }))
  const createGame = () => {
    const friendsToInvite = Object.values(store.friends).filter(
      (friend) => store.friendState[friend.id]?.isSelected,
    )

    const gameId = nanoid()
    initialise(store)(gameId, friendsToInvite)
    inviteToGame(store)(gameId)

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
          <button onClick={() => addLocalPlayer(store)(nanoid(), '')}>
            Add local player
          </button>{' '}
          <button onClick={removeSelectedPlayers(store)}>Remove players</button>{' '}
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
