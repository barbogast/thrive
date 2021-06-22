import React, { useState } from 'react'
import { Layer } from 'react-konva'

import Stage from '../components/Stage'
import HexTile from '../components/HexTile'
import BackButton from '../components/BackButton'
import * as game from '../lib/game'
import { Board, setLocalState, useLocalStore } from '../state/localState'
import { useBoardId } from '../lib/routing'
import { visualConfig } from '../lib/constants'
import { offsetToAxial } from '../lib/axial'
import { range } from '../lib/utils'
import { getDimensions } from '../lib/board'

const editModes = {
  setTileType: 'Set Tile Type',
  setNumber: 'Set Number',
  addTile: 'Add Tile',
  removeTile: 'Remove Tile',
}
type EditMode = keyof typeof editModes

const EditBoard: React.FC = function EditBoard() {
  const boardId = useBoardId()
  const setBoard = (callback: (board: Board) => void) =>
    setLocalState((draft) => callback(draft.customBoards[boardId]))

  const board = useLocalStore((state) => state.customBoards[boardId])

  const [editMode, setEditMode] = useState<EditMode>('setTileType')

  const [selectedType, setSelectedType] = useState<game.TileType>('wood')

  const [selectedNumber, setSelectedNumber] = useState<number>(8)

  const { top, bottom, right, left } = getDimensions(board.tiles)

  return (
    <>
      <BackButton />
      <h3>Board Editor</h3>
      <label>
        Name{' '}
        <input
          value={board.name}
          onChange={(e) =>
            setBoard((board) => {
              board.name = e.target.value
            })
          }
        />
      </label>
      <div>
        Edit mode:{' '}
        {Object.entries(editModes).map(([key, label], i) => (
          <label key={i}>
            <input
              type="radio"
              name="edit-mode"
              checked={editMode === key}
              onChange={() => setEditMode(key as EditMode)}
            />
            {label}
          </label>
        ))}
      </div>
      {(editMode === 'setTileType' || editMode === 'addTile') && (
        <>
          Selected type:
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as game.Resource)}
          >
            {Object.keys(game.TileType).map((r, i) => (
              <option value={r} key={i}>
                {r}
              </option>
            ))}
          </select>
        </>
      )}
      {editMode === 'setNumber' && (
        <>
          Selected number:
          <input
            type="number"
            min="1"
            max="12"
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(parseInt(e.target.value))}
          />
        </>
      )}
      <Stage>
        <Layer>
          {editMode === 'addTile' &&
            range(top - 1, bottom + 1).flatMap((col, i) =>
              range(left - 1, right + 1).map((row, j) => (
                <HexTile
                  key={`${i}-${j}`}
                  tile={{
                    position: offsetToAxial({ col, row }),
                    type: 'empty',
                    number: undefined,
                  }}
                  radius={visualConfig().tileRadius}
                  fontSize={14}
                  onClick={() =>
                    setBoard((board) => {
                      board.tiles.push({
                        position: offsetToAxial({ col, row }),
                        type: selectedType,
                        number: undefined,
                      })
                    })
                  }
                />
              )),
            )}
          {board.tiles.map((tile, i) => (
            <HexTile
              key={i}
              tile={tile}
              radius={visualConfig().tileRadius}
              fontSize={14}
              onClick={() =>
                setBoard((board) => {
                  switch (editMode) {
                    case 'setTileType': {
                      board.tiles[i].type = selectedType
                      break
                    }
                    case 'setNumber': {
                      board.tiles[i].number = selectedNumber
                      break
                    }
                    case 'removeTile': {
                      board.tiles.splice(i, 1)
                      break
                    }
                    default:
                      throw new Error('not supported')
                  }
                })
              }
            />
          ))}
        </Layer>
      </Stage>
    </>
  )
}

export default EditBoard
