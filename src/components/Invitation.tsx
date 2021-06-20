import React from 'react'

import * as peers from '../lib/peers'
import * as routing from '../lib/routing'

type Props = {
  connectId: string
}
const Invitation: React.FC<Props> = function Invitation({ connectId }) {
  const onYes = () => {
    peers.connectToPeer(connectId)
    routing.clearSearchParams()
  }

  const onNo = () => routing.clearSearchParams()

  return (
    <>
      You&apos;ve been invited to play. Accept?
      <br />
      <button onClick={onYes}>Yes</button>
      <button onClick={onNo}>No</button>
    </>
  )
}

export default Invitation
