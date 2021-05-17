import React, { useState } from 'react'
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
  const { initialise, games, friends, connectedFriends, addLocalPlayer } =
    useStore((state) => ({
      initialise: state.initialise,
      games: state.games,
      friends: state.friends,
      connectedFriends: state.uiState.connectedFriends,
      addLocalPlayer: state.addLocalPlayer,
    }))
  const [selectedFriends, setSelectedFriends] = useState<{
    [friendId: string]: boolean
  }>({})

  const createGame = () => {
    const friends: string[] = []
    Object.entries(selectedFriends).forEach(([friendId, isSelected]) => {
      if (isSelected) {
        friends.push(friendId)
      }
    })
    const gameId = nanoid()
    initialise(gameId, friends)
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
                  checked={Boolean(selectedFriends[friend.id])}
                  onChange={() =>
                    setSelectedFriends((sel) => ({
                      ...sel,
                      [friend.id]: !sel[friend.id],
                    }))
                  }
                />
                {friend.id}
                {friend.isRemote && (
                  <Box
                    color={
                      connectedFriends.includes(friend.id) ? 'green' : 'red'
                    }
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
