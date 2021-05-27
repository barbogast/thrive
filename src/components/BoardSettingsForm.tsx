import React from 'react'

import { useStores } from '../state/useStores'
import { useTempStore } from '../state/tempState'

const BoardSettingsForm: React.FC = function BoardSettingsForm() {
  const { boardSettings } = useTempStore((state) => ({
    boardSettings: state.boardSettings,
  }))
  const stores = useStores()

  return (
    <div>
      <select
        value={boardSettings.type}
        onChange={(e) =>
          stores.temp.set((draft) => {
            draft.boardSettings.type = e.target.value as 'hex' | 'square'
          })
        }
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
              onChange={(e) =>
                stores.temp.set((draft) => {
                  if (draft.boardSettings.type !== 'square') {
                    throw new Error('TS-Refinement failed')
                  }
                  draft.boardSettings.rows = parseInt(e.target.value) as number
                })
              }
            />
          </label>
          <label>
            Columns:{' '}
            <input
              value={boardSettings.columns}
              type="number"
              onChange={(e) =>
                stores.temp.set((draft) => {
                  if (draft.boardSettings.type !== 'square') {
                    throw new Error('TS-Refinement failed')
                  }
                  draft.boardSettings.columns = parseInt(
                    e.target.value,
                  ) as number
                })
              }
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
              onChange={(e) =>
                stores.temp.set((draft) => {
                  if (draft.boardSettings.type !== 'hex') {
                    throw new Error('TS-Refinement failed')
                  }
                  draft.boardSettings.size = e.target.value as '3' | '5'
                })
              }
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
