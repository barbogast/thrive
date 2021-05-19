import React from 'react'
import { Layer, Stage, useStrictMode } from 'react-konva'
import { KonvaEventObject } from 'konva-types/Node'
import { Stage as StateType } from 'konva-types/Stage'

import { useStore } from '../state'
import * as routing from '../routing'
import HexTile from './HexTile'
import Road from './Road'
import Town from './Town'
import { ActionType, context } from '../state'

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
    currentAction,
  } = useStore((state) => ({
    gameState: state.games[gameId],
    currentAction: state.uiState.currentAction,
  }))

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

              {currentAction.type === ActionType.buildRoad &&
                Object.values(currentAction.positions).map((r, i) => (
                  <Road key={i} position={r} />
                ))}

              {currentAction.type === ActionType.buildTown &&
                Object.values(currentAction.positions).map((r, i) => (
                  <Town key={i} position={r} />
                ))}

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
