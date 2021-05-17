import React from 'react'
import { Route } from 'wouter'

import useConnection from '../hooks/useConnection'
import Playing from '../pages/Playing'
import MainMenu from '../pages/MainMenu'

function App(): JSX.Element {
  const connect = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const playerId = urlParams.get('connect')
    if (!playerId) {
      return
    }
    connectToPeer(playerId)
  }
  const { connectToPeer, sendState, updateMyName } = useConnection()

  return (
    <>
      <Route
        path="/"
        component={() => <MainMenu updateMyName={updateMyName} />}
      />
      <Route
        path="/play/:gameId"
        component={() => <Playing sendState={sendState} />}
      />
      <div>
        <button onClick={connect}>Connect</button>
      </div>
    </>
  )
}

export default App
