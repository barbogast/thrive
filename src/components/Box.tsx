import React from 'react'

function Box({ color }: { color: string }): JSX.Element {
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
