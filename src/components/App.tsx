import React from 'react'
import { Route } from 'wouter'
import { useStrictMode } from 'react-konva'

import * as peers from '../lib/peers'
import Playing from '../pages/Playing'
import MainMenu from '../pages/MainMenu'
import CreateGame from '../pages/CreateGame'

peers.setup()

const App: React.FC = function App() {
  useStrictMode(true)

  return (
    <>
      <Route path="/" component={MainMenu} />
      <Route path="/create" component={CreateGame} />
      <Route path="/play/:gameId" component={Playing} />
    </>
  )
}

export default App
