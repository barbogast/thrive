import React, { useEffect } from 'react'
import { Route } from 'wouter'

import useConnection from '../useConnection'
import useStore from '../state'
import Playing from '../pages/Playing'

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
      <Route path="/" component={() => <Playing sendState={sendState} />} />
      {peerId && <a href={peerLink}>{peerLink}</a>}
      <button onClick={connect}>Connect</button>
    </>
  )
}

export default App
