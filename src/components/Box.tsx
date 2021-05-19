import React from 'react'

type Props = {
  color: string
}

const Box: React.FC<Props> = function Box({ color }) {
  return (
    <span
      style={{
        backgroundColor: color,
        width: 10,
        height: 10,
        display: 'inline-block',
      }}
    ></span>
  )
}

export default Box
