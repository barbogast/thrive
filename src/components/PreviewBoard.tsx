import React from 'react'
import { Layer, Stage as KonvaStage } from 'react-konva'
import { useTempStore } from '../state/tempState'

import HexTile from '../components/HexTile'

const PreviewBoard: React.FC = function PreviewBoard() {
  const tempStore = useTempStore((state) => ({
    currentTiles: state.currentTiles,
    boardSettings: state.boardSettings,
  }))
  let x, y, width, height
  if (tempStore.boardSettings.type === 'hex') {
    x = 75
    y = 75
    width = 300
    height = 300
  } else {
    x = 50
    y = 50
    width = 300
    height = 300
  }

  return (
    <KonvaStage x={x} y={y} width={width} height={height}>
      <Layer>
        {Object.values(tempStore.currentTiles).map((t, i) => (
          <HexTile key={i} tile={t} radius={12} fontSize={10} />
        ))}
      </Layer>
    </KonvaStage>
  )
}

export default PreviewBoard
