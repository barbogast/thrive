import React, { useEffect } from 'react'
import useConnection from '../useConnection'

import useStore from '../state'
import Board from './Board'
import Controls from './Controls'
import Players from './Players'

function App(): JSX.Element {
  const { initialise, state } = useStore((state) => ({
    initialise: state.initialise,
    state: state,
  }))
  useEffect(initialise, [])

  const connect = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const gameId = urlParams.get('gameid')
    if (!gameId) {
      return
    }
    connectToPeer(gameId)
  }
  const { peerId, connectToPeer, sendState } = useConnection()
  const peerLink = window.location.host + '?gameid=' + peerId

  return (
    <>
      {peerId && <a href={peerLink}>{peerLink}</a>}
      <button onClick={connect}>Connect</button>
      <Players />
      <Controls />
      <Board />
      &nbsp;&nbsp;
      <button onClick={() => console.log(state)}>Log state</button>
      <button onClick={() => sendState()}>Send state</button>
    </>
  )
}

export default App
