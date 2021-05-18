import React from 'react'

import { useStore } from '../state'
import Board from '../components/Board'
import Controls from '../components/Controls'
import Players from '../components/Players'

function Playing() {
  const { state } = useStore((state) => ({
    state: state,
  }))

  return (
    <>
      <button onClick={() => window.history.back()}>Back</button>
      <Players />
      <Controls />
      <Board />
      &nbsp;&nbsp;
      <button onClick={() => console.log(state)}>Log state</button>
    </>
  )
}

export default Playing
