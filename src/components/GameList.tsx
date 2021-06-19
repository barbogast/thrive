import React from 'react'
import { Link } from 'wouter'

import { useLocalStore } from '../state/localState'
import ConnectionStatus from '../components/ConnectionStatus'
import { useGameStore } from '../state/gameState'
import { GameState } from '../lib/game'

function formatPlayers(game: GameState) {
  const allPlayers = Object.keys(game.players)
  const allExceptTheLast = allPlayers.slice(0, -1)
  const theLast = allPlayers[allPlayers.length - 1]
  return (
    allExceptTheLast.map((playerId) => game.players[playerId].name).join(', ') +
    ' and ' +
    game.players[theLast].name
  )
}
const GameList: React.FC = function GameList() {
  const localStore = useLocalStore((state) => ({
    myId: state.myId,
  }))
  const gameStore = useGameStore((state) => ({
    games: state.games,
  }))

  if (!Object.keys(gameStore.games).length) {
    return <a href="create">Create a game</a>
  }

  return (
    <div>
      <a href="create">Create a game</a>
      <br />
      Existing games
      <ul>
        {Object.entries(gameStore.games).map(([gameId, game]) => (
          <li key={gameId}>
            <Link href={`/play/${gameId}`}>
              <a className="link">Continue game with {formatPlayers(game)}</a>
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
  )
}

export default GameList
