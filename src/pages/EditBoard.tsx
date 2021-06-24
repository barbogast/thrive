import React, { useState } from 'react'
import { Layer } from 'react-konva'

import Stage from '../components/Stage'
import HexTile from '../components/HexTile'
import BackButton from '../components/BackButton'
import { CustomBoard, setLocalState, useLocalStore } from '../state/localState'
import { useBoardId } from '../lib/routing'
import { visualConfig } from '../lib/constants'
import { offsetToAxial } from '../lib/axial'
import { range, downloadObjectAsJson } from '../lib/utils'
import { getDimensions, Resource, Tile, TileType } from '../lib/board'

const editModes = {
  setNumber: 'Set Number',
  setTile: 'Set Tile',
  removeTile: 'Remove Tile',
}
type EditMode = keyof typeof editModes

const EditBoard: React.FC = function EditBoard() {
  const boardId = useBoardId()

  const setBoard = (callback: (board: CustomBoard) => void) =>
    setLocalState((draft) => callback(draft.customBoards[boardId]))

  const importCustomBoard = () => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      if (document === null) {
        return
      }
      const el = document.getElementById(
        'board-file-upload',
      ) as HTMLInputElement
      if (el === null) {
        return
      }
      const files = el.files
      if (files === null) {
        return
      }

      const content = await files[0].text()
      const parsed: Tile[] = JSON.parse(content)
      if (!confirm('Replace the current board with the one in the file?')) {
        return
      }
      setBoard((board) => {
        board.tiles = parsed
      })
    })().catch(console.error)
  }

  const board = useLocalStore((state) => state.customBoards[boardId])

  const [editMode, setEditMode] = useState<EditMode>('setTile')

  const [selectedType, setSelectedType] = useState<TileType>('wood')

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
      <br />
      <button onClick={() => downloadObjectAsJson(board, 'board')}>
        Export to file
      </button>
      <br />
      Import from file: <input type="file" id="board-file-upload" />
      <button onClick={importCustomBoard}>Import</button>
      <br />
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
      {editMode === 'setTile' && (
        <>
          Selected type:
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as Resource)}
          >
            {Object.keys(TileType).map((r, i) => (
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
          {editMode === 'setTile' &&
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
              fontSize={28}
              onClick={() =>
                setBoard((board) => {
                  switch (editMode) {
                    case 'setTile': {
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
