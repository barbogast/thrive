import React from 'react'
import { Route } from 'wouter'

import useConnection from '../useConnection'
import Playing from '../pages/Playing'
import MainMenu from '../pages/MainMenu'

function App(): JSX.Element {
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
      <Route path="/" component={MainMenu} />
      <Route
        path="/play/:gameId"
        component={() => <Playing sendState={sendState} />}
      />
      <div>
        {peerId && <a href={peerLink}>{peerLink}</a>}
        <button onClick={connect}>Connect</button>
      </div>
    </>
  )
}

export default App
