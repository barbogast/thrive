import React from 'react'

import useStore from '../state'
import Board from '../components/Board'
import Controls from '../components/Controls'
import Players from '../components/Players'

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
