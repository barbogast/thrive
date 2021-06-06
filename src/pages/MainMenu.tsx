import React from 'react'
import { Link } from 'wouter'
import { nanoid } from 'nanoid'
import { useLocation } from 'wouter'

import { useLocalStore } from '../state/localState'
import PlayerName from '../components/PlayerName'
import FriendsList from '../components/FriendsList'
import ConnectionStatus from '../components/ConnectionStatus'
import BoardSettingsForm from '../components/BoardSettingsForm'
import {
  addLocalPlayer,
  createGame,
  removeSelectedPlayers,
} from '../state/setters'
import { useGameStore } from '../state/gameState'

const MainMenu: React.FC = function MainMenu() {
  const [, setLocation] = useLocation()
  const localStore = useLocalStore((state) => ({
    get: state.get,
    set: state.set,
    myId: state.myId,
    friends: state.friends,
  }))
  const gameStore = useGameStore((state) => ({
    games: state.games,
  }))

  const create = () => {
    const gameId = nanoid()
    createGame(gameId)
    setLocation(`/play/${gameId}`)
  }

  const inviteLink = `${window.location.protocol}//${
    window.location.host + '?connect=' + localStore.myId
  }`
  return (
    <>
      <PlayerName />
      <div>
        Existing games
        <ul>
          {Object.entries(gameStore.games).map(([gameId, game]) => (
            <li key={gameId}>
              <Link href={`/play/${gameId}`}>
                <a className="link">Play {gameId}</a>
              </Link>
              {Object.values(game.players).map((player) => (
                <span key={player.id}>
                  {player.name}
                  {player.peerId !== localStore.myId ? (
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
