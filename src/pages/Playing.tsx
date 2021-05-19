import React from 'react'

import { useStore } from '../state'
import Board from '../components/Board'
import Controls from '../components/Controls'
import Players from '../components/Players'
import * as routing from '../routing'

const Playing: React.FC = function Playing() {
  const gameId = routing.useGameId()
  const { state, sequence } = useStore((state) => ({
    state: state,
    sequence: state.games[gameId].sequence,
  }))

  return (
    <>
      <button onClick={() => window.history.back()}>Back</button>
      {sequence.phaseType === 'normal' ? <Players /> : <></>}
      {sequence.phaseType === 'normal' ? <Controls /> : <></>}
      <Board />
      {/* eslint-disable-next-line no-console */}
      <button onClick={() => console.log(state)}>Log state</button>
    </>
  )
}

export default Playing
