import React from 'react'
import { Link } from 'wouter'
import { nanoid } from 'nanoid'
import { useLocation } from 'wouter'

import { useStore } from '../state'
import usePlayerId from '../hooks/usePlayerId'
import PlayerName from '../components/PlayerName'
import Box from '../components/Box'

function MainMenu() {
  const [location, setLocation] = useLocation()
  const playerId = usePlayerId()
  const {
    initialise,
    games,
    friends,
    friendState,
    addLocalPlayer,
    toggleFriendSelection,
  } = useStore((state) => ({
    initialise: state.initialise,
    games: state.games,
    friends: state.friends,
    addLocalPlayer: state.addLocalPlayer,
    friendState: state.uiState.friendState,
    toggleFriendSelection: state.toggleFriendSelection,
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
      <PlayerName />
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
                <input
                  type="checkbox"
                  checked={Boolean(friendState[friend.id]?.isSelected)}
                  onChange={() => toggleFriendSelection(friend.id)}
                />
                {friend.id}
                {friend.isRemote && (
                  <Box
                    color={friendState[friend.id]?.connection ? 'green' : 'red'}
                  />
                )}
              </li>
            ))}
          </ul>
          Invite new contacts by sharing this link:
          <a href={inviteLink}>{inviteLink}</a>
          <br />
          <button onClick={() => addLocalPlayer(nanoid())}>
            Add local player
          </button>
          <br />
          <button onClick={createGame}>Create game</button>
        </div>
      </div>
    </>
  )
}

export default MainMenu
