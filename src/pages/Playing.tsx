import React from 'react'

import { useCurrentGame } from '../state/gameState'
import Board from '../components/Board'
import Stage from '../components/Stage'
import Controls from '../components/Controls'
import Players from '../components/Players'
import * as game from '../lib/game'
import Box from '../components/Box'
import BackButton from '../components/BackButton'

const Playing: React.FC = function Playing() {
  const gameStore = useCurrentGame((game) => ({
    sequence: game.sequence,
    currentAction: game.sequence.scheduledActions[0],
    currentPlayerColor:
      game.players[game.sequence.scheduledActions[0].playerId].color,
    currentDiceRoll: game.currentDiceRoll,
  }))

  return (
    <>
      <BackButton />
      <div>
        Current player <Box color={gameStore.currentPlayerColor} />:{' '}
        {gameStore.currentAction.type}
        <br />
      </div>
      <Players />
      {gameStore.sequence.phaseType === 'normal' ? (
        <>
          <div>
            {gameStore.currentAction.type !== game.GameActionType.rollDice
              ? 'Current dice roll: ' + gameStore.currentDiceRoll.join(' | ')
              : ''}
          </div>
          <Controls />
          <br />
        </>
      ) : (
        <></>
      )}
      <Stage>
        <Board />
      </Stage>
    </>
  )
}

export default Playing
