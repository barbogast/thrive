import React from 'react'
import { Stage as KonvaStage, useStrictMode } from 'react-konva'
import { KonvaEventObject } from 'konva-types/Node'
import { Stage as StateType } from 'konva-types/Stage'

import * as state from '../state'

useStrictMode(true)

function onWheel(e: KonvaEventObject<WheelEvent>) {
  const scaleBy = 1.05

  const stage = e.currentTarget as StateType

  e.evt.preventDefault()
  const oldScale = stage.scaleX()

  const pointer = stage.getPointerPosition()

  if (!pointer) {
    return
  }
  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  }

  const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy

  stage.scale({ x: newScale, y: newScale })

  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  }
  stage.position(newPos)
  stage.batchDraw()
}

const Stage: React.FC = function v({ children }) {
  return (
    <state.context.Consumer>
      {(value: unknown) => (
        <KonvaStage
          width={window.innerWidth}
          height={window.innerHeight}
          onWheel={onWheel}
          draggable
        >
          <state.context.Provider value={value}>
            {children}
          </state.context.Provider>
        </KonvaStage>
      )}
    </state.context.Consumer>
  )
}

export default Stage
