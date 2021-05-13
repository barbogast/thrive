import React from 'react'

import useStore from '../state'
import Board from '../compontents/Board'
import Controls from '../compontents/Controls'
import Players from '../compontents/Players'

type Props = {
  sendState: () => void
}

function Playing({ sendState }: Props) {
  const { state } = useStore((state) => ({
    state: state,
  }))
  return (
    <>
      <Players />
      <Controls />
      <Board />
      &nbsp;&nbsp;
      <button onClick={() => console.log(state)}>Log state</button>
      <button onClick={() => sendState()}>Send state</button>
    </>
  )
}

export default Playing
