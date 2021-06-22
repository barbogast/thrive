import React from 'react'

import { getColorForTileType } from './HexTile'
import { useLocalStore } from '../state/localState'
import { useCurrentGame } from '../state/gameState'
import * as board from '../lib/board'
import Box from './Box'
import ConnectionStatus from './ConnectionStatus'

const Players: React.FC = function Players() {
  const { myId } = useLocalStore((state) => ({
    myId: state.myId,
  }))
  const { players, sequenceAction } = useCurrentGame((game) => ({
    players: game.players,
    sequenceAction: game.sequence.scheduledActions[0],
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {Object.values(players).map((player) => {
        return (
          <div style={{ border: `1px solid ${player.color}` }} key={player.id}>
            <div
              style={{
                backgroundColor:
                  sequenceAction.playerId === player.id
                    ? player.color
                    : undefined,
              }}
            >
              {player.name}
              {player.peerId !== myId ? (
                <ConnectionStatus id={player.peerId} />
              ) : (
                <></>
              )}
            </div>
            <ul>
              <li>
                <Box color={getColorForTileType(board.Resource.wood)} />
                &nbsp; Wood: {player.resources.wood}
              </li>
              <li>
                <Box color={getColorForTileType(board.Resource.brick)} />
                &nbsp; Brick: {player.resources.brick}
              </li>
              <li>
                <Box color={getColorForTileType(board.Resource.grain)} />
                &nbsp; Grain: {player.resources.grain}
              </li>
              <li>
                <Box color={getColorForTileType(board.Resource.sheep)} />
                &nbsp; Sheep: {player.resources.sheep}
              </li>
              <li>
                <Box color={getColorForTileType(board.Resource.wood)} /> &nbsp;
                Ore: {player.resources.ore}
              </li>
              <li>
                <Box color="transparent" /> &nbsp;Points: {player.points}
              </li>
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default Players
