import React from 'react'

const BackButton: React.FC = function BackButton() {
  return <button onClick={() => window.history.back()}>&lt;&lt;</button>
}

export default BackButton
