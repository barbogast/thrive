import React from 'react'
import { Route } from 'wouter'

import * as peers from '../peers'
import Playing from '../pages/Playing'
import MainMenu from '../pages/MainMenu'
import CreateGame from '../pages/CreateGame'

peers.setup()

const App: React.FC = function App() {
  const connect = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const playerId = urlParams.get('connect')
    if (!playerId) {
      return
    }
    peers.connectToPeer(playerId)
  }
  return (
    <>
      <Route path="/" component={MainMenu} />
      <Route path="/create" component={CreateGame} />
      <Route path="/play/:gameId" component={Playing} />
      <div>
        <button onClick={connect}>Connect</button>
      </div>
    </>
  )
}

export default App
