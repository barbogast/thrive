import React from 'react'
import { Layer, Stage as KonvaStage } from 'react-konva'
import { useTempStore } from '../state/tempState'

import HexTile from '../components/HexTile'
import { useLocalStore } from '../state/localState'
import { Tile } from '../lib/board'
import { getDimensions } from '../lib/board'

const PreviewBoard: React.FC = function PreviewBoard() {
  const tempStore = useTempStore((state) => ({
    currentTiles: state.currentTiles,
    boardSettings: state.boardSettings,
    boardMode: state.boardMode,
    selectedCustomBoardId: state.selectedCustomBoardId,
  }))

  const localStore = useLocalStore((state) => ({
    customBoards: state.customBoards,
  }))

  let tiles: Tile[] | void
  if (tempStore.boardMode === 'random') {
    tiles = tempStore.currentTiles
  } else {
    if (tempStore.selectedCustomBoardId) {
      tiles = localStore.customBoards[tempStore.selectedCustomBoardId].tiles
    }
  }

  if (!tiles) {
    return null
  }

  const { bottom, top, left, right } = getDimensions(tiles)
  const width = (right - left) * 40 + 75
  const height = (bottom - top) * 40 + 75

  let horizontalCenter: number, verticalCenter: number
  if (
    tempStore.boardMode === 'random' &&
    tempStore.boardSettings.type === 'square'
  ) {
    horizontalCenter = 25
    verticalCenter = 50
  } else {
    horizontalCenter = 10 + width / 2
    verticalCenter = 10 + height / 2
  }

  return (
    <KonvaStage
      x={horizontalCenter}
      y={verticalCenter}
      width={width}
      height={height}
    >
      <Layer>
        {tiles.map((t, i) => (
          <HexTile key={i} tile={t} radius={20} fontSize={10} />
        ))}
      </Layer>
    </KonvaStage>
  )
}

export default PreviewBoard
