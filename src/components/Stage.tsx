import React, { useState } from 'react'
import { Stage as KonvaStage } from 'react-konva'
import { KonvaEventObject } from 'konva/lib/Node'
import { Stage as StageType } from 'konva/lib/Stage'

function onWheel(e: KonvaEventObject<WheelEvent>) {
  const scaleBy = 1.05

  const stage = e.currentTarget as StageType

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

const Stage: React.FC = function Stage({ children }) {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 300,
    y: 300,
  })

  return (
    <KonvaStage
      width={window.innerWidth}
      height={window.innerHeight}
      x={position.x}
      y={position.y}
      onWheel={onWheel}
      draggable
      onDragEnd={(e) => setPosition({ x: e.target.x(), y: e.target.y() })}
    >
      {children}
    </KonvaStage>
  )
}

export default Stage
