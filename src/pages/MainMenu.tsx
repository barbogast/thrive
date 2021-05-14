import React from 'react'
import { Link } from 'wouter'
import { nanoid } from 'nanoid'
import { useLocation } from 'wouter'

import { useStore } from '../state'
import usePlayerId from '../usePlayerId'
import Box from '../components/Box'

function MainMenu() {
  const [location, setLocation] = useLocation()
  const playerId = usePlayerId()
  const { initialise, games, friends, connectedFriends } = useStore(
    (state) => ({
      initialise: state.initialise,
      games: state.games,
      friends: state.friends,
      connectedFriends: state.uiState.connectedFriends,
    }),
  )

  const createGame = () => {
    const gameId = nanoid()
    initialise(gameId)
    setLocation(`/play/${gameId}`)
  }

  const inviteLink = `${window.location.host + '?connect=' + playerId}`
  return (
    <>
      <button onClick={createGame}>Create game</button>
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
          <ul>
            {Object.values(friends).map((friend) => (
              <li key={friend.id}>
                {friend.id}
                <Box
                  color={connectedFriends.includes(friend.id) ? 'green' : 'red'}
                />
              </li>
            ))}
          </ul>
          Invite new contacts by sharing this link:
          <a href={inviteLink}>{inviteLink}</a>
        </div>
      </div>
    </>
  )
}

export default MainMenu
