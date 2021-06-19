import React from 'react'

import {
  hexDefault,
  setTempState,
  squareDefault,
  useTempStore,
} from '../state/tempState'

type Props = {
  onChange: () => void
}

const BoardSettingsForm: React.FC<Props> = function BoardSettingsForm({
  onChange,
}) {
  const { boardSettings } = useTempStore((state) => ({
    boardSettings: state.boardSettings,
  }))

  return (
    <div>
      <select
        value={boardSettings.type}
        onChange={(e) => {
          setTempState((draft) => {
            draft.boardSettings =
              e.target.value === 'hex' ? hexDefault : squareDefault
          })
          onChange()
        }}
      >
        <option defaultChecked value="hex">
          Hexagon
        </option>
        <option value="square">Square</option>
      </select>
      {boardSettings.type === 'square' && (
        <div>
          <label>
            Rows:{' '}
            <input
              value={boardSettings.rows}
              type="number"
              onChange={(e) => {
                setTempState((draft) => {
                  if (draft.boardSettings.type !== 'square') {
                    throw new Error('TS-Refinement failed')
                  }
                  draft.boardSettings.rows = parseInt(e.target.value) as number
                })
                onChange()
              }}
            />
          </label>
          <label>
            Columns:{' '}
            <input
              value={boardSettings.columns}
              type="number"
              onChange={(e) => {
                setTempState((draft) => {
                  if (draft.boardSettings.type !== 'square') {
                    throw new Error('TS-Refinement failed')
                  }
                  draft.boardSettings.columns = parseInt(
                    e.target.value,
                  ) as number
                })
                onChange()
              }}
            />
          </label>
        </div>
      )}
      {boardSettings.type === 'hex' && (
        <div>
          <label>
            Size:{' '}
            <select
              value={boardSettings.size}
              onChange={(e) => {
                setTempState((draft) => {
                  if (draft.boardSettings.type !== 'hex') {
                    throw new Error('TS-Refinement failed')
                  }
                  draft.boardSettings.size = e.target.value as '3' | '5'
                })
                onChange()
              }}
            >
              <option defaultChecked value="5">
                5
              </option>
              <option value="3">3</option>
            </select>
          </label>
        </div>
      )}
    </div>
  )
}

export default BoardSettingsForm
