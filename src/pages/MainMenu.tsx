import React from 'react'
import { Link } from 'wouter'
import { nanoid } from 'nanoid'
import { useLocation } from 'wouter'

import useStore from '../state'

function MainMenu() {
  const [location, setLocation] = useLocation()
  const { initialise, games } = useStore((state) => ({
    initialise: state.initialise,
    games: state.games,
  }))

  const createGame = () => {
    const gameId = nanoid()
    initialise(gameId)
    setLocation(`/play/${gameId}`)
  }

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
    </>
  )
}

export default MainMenu
