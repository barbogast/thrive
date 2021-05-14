import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'
import WithInitialisedState from './components/WithInitialisedState'

ReactDOM.render(
  <React.StrictMode>
    <WithInitialisedState>
      <App />
    </WithInitialisedState>
  </React.StrictMode>,
  document.getElementById('root'),
)

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept()
}
