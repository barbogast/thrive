import React from 'react'
import styled, { css } from 'styled-components'

import { getColorForTileType } from './HexTile'
import { useLocalStore } from '../state/localState'
import { useCurrentGame } from '../state/gameState'
import * as board from '../lib/board'
import Box from './Box'
import ConnectionStatus from './ConnectionStatus'

const Row = styled.div`
  display: flex;
  flex-direction: row;
`
const PlayerBox = styled.div`
  border: 1px solid ${(props) => props.color};
`
const PlayerHeader = styled.div`
  ${(props) =>
    props.color &&
    css`
      background-color: ${props.color};
    `}
`

const Players: React.FC = function Players() {
  const { myId } = useLocalStore((state) => ({
    myId: state.myId,
  }))
  const { players, sequenceAction } = useCurrentGame((game) => ({
    players: game.players,
    sequenceAction: game.sequence.scheduledActions[0],
  }))

  return (
    <Row>
      {Object.values(players).map((player) => {
        return (
          <PlayerBox color={player.color} key={player.id}>
            <PlayerHeader
              color={
                sequenceAction.playerId === player.id ? player.color : undefined
              }
            >
              {player.name}
              {player.peerId !== myId ? (
                <ConnectionStatus id={player.peerId} />
              ) : (
                <></>
              )}
            </PlayerHeader>
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
          </PlayerBox>
        )
      })}
    </Row>
  )
}

export default Players
