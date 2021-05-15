import React from 'react'
import * as routing from '../routing'

import { useStore } from '../state'
import Board from '../components/Board'
import Controls from '../components/Controls'
import Players from '../components/Players'
import { GameState } from '../game'

type Props = {
  sendState: (gameId: string, newState: GameState) => void
}

function Playing({ sendState }: Props) {
  const gameId = routing.useGameId()
  const { state } = useStore((state) => ({
    state: state,
  }))

  return (
    <>
      <button onClick={() => window.history.back()}>Back</button>
      <Players />
      <Controls sendState={sendState} />
      <Board sendState={sendState} />
      &nbsp;&nbsp;
      <button onClick={() => console.log(state)}>Log state</button>
    </>
  )
}

export default Playing
