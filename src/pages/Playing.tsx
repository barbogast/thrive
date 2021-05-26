import React from 'react'

import { useGameStore } from '../state/gameState'
import Board from '../components/Board'
import Stage from '../components/Stage'
import Controls from '../components/Controls'
import Players from '../components/Players'
import * as routing from '../routing'
import Box from '../components/Box'

const Playing: React.FC = function Playing() {
  const gameId = routing.useGameId()
  const { sequence, currentPlayerColor, currentAction } = useGameStore(
    (state) => ({
      state: state,
      sequence: state.games[gameId].sequence,
      currentAction: state.games[gameId].sequence.scheduledActions[0],
      currentPlayerColor:
        state.games[gameId].players[
          state.games[gameId].sequence.scheduledActions[0].playerId
        ].color,
    }),
  )

  return (
    <>
      <button onClick={() => window.history.back()}>Back</button>
      <div>
        Current player <Box color={currentPlayerColor} />: {currentAction.type}
        <br />
      </div>
      {sequence.phaseType === 'normal' ? <Players /> : <></>}
      {sequence.phaseType === 'normal' ? <Controls /> : <></>}
      <Stage>
        <Board />
      </Stage>
    </>
  )
}

export default Playing
