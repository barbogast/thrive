import React, { useMemo } from 'react'
import { Layer, Stage, useStrictMode } from 'react-konva'
import { KonvaEventObject } from 'konva-types/Node'
import { Stage as StateType } from 'konva-types/Stage'

import { useStore } from '../state'
import * as routing from '../routing'
import * as board from '../board'
import HexTile from './HexTile'
import Road from './Road'
import Town from './Town'
import { UiActionType, context } from '../state'

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

const Board: React.FC = function Board() {
  const gameId = routing.useGameId()
  const {
    gameState: { tiles, roads, towns },
    uiAction,
    sequenceAction,
  } = useStore((state) => ({
    gameState: state.games[gameId],
    uiAction: state.uiState.currentAction,
    sequenceAction: state.games[gameId].sequence.scheduledActions[0],
  }))

  const buildRoad =
    uiAction.type === UiActionType.buildRoad ||
    sequenceAction.type === 'buildRoad'
  const buildTown =
    uiAction.type === UiActionType.buildTown ||
    sequenceAction.type === 'buildTown'

  const positions = useMemo(() => {
    if (buildRoad) {
      return board.getRoadPositions(tiles)
    } else if (buildTown) {
      return board.getTownPositions(tiles)
    } else {
      return []
    }
  }, [tiles, buildRoad, buildTown])

  return (
    <context.Consumer>
      {(value: unknown) => (
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onWheel={onWheel}
          draggable
        >
          <context.Provider value={value}>
            <Layer>
              {Object.values(tiles).map((t, i) => (
                <HexTile key={i} tile={t} />
              ))}

              {buildRoad &&
                positions.map((r, i) => <Road key={i} position={r} />)}

              {buildTown &&
                positions.map((r, i) => <Town key={i} position={r} />)}

              {Object.values(roads).map((r, i) => (
                <Road key={i} position={r.position} owner={r.owner} />
              ))}

              {Object.values(towns).map((t, i) => (
                <Town key={i} position={t.position} owner={t.owner} />
              ))}
            </Layer>
          </context.Provider>
        </Stage>
      )}
    </context.Consumer>
  )
}

export default Board
