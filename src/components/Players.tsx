import React from 'react'

import { getColorForTileType } from './HexTile'
import { useLocalStore } from '../state/localState'
import { useCurrentGame } from '../state/gameState'
import Box from './Box'
import * as game from '../lib/game'
import ConnectionStatus from './ConnectionStatus'

const Players: React.FC = function Players() {
  const { myId } = useLocalStore((state) => ({
    myId: state.myId,
  }))
  const { players } = useCurrentGame((game) => ({
    players: game.players,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {Object.values(players).map((player) => {
        return (
          <div style={{ border: `1px solid ${player.color}` }} key={player.id}>
            <div style={{ backgroundColor: player.color }}>
              {player.name}
              {player.peerId !== myId ? (
                <ConnectionStatus id={player.peerId} />
              ) : (
                <></>
              )}
            </div>
            <ul>
              <li>
                <Box color={getColorForTileType(game.Resource.wood)} />
                &nbsp; Wood: {player.resources.wood}
              </li>
              <li>
                <Box color={getColorForTileType(game.Resource.brick)} />
                &nbsp; Brick: {player.resources.brick}
              </li>
              <li>
                <Box color={getColorForTileType(game.Resource.grain)} />
                &nbsp; Grain: {player.resources.grain}
              </li>
              <li>
                <Box color={getColorForTileType(game.Resource.sheep)} />
                &nbsp; Sheep: {player.resources.sheep}
              </li>
              <li>
                <Box color={getColorForTileType(game.Resource.wood)} /> &nbsp;
                Ore: {player.resources.ore}
              </li>
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default Players
