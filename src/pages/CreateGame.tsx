import React, { useEffect } from 'react'
import { nanoid } from 'nanoid'
import { useLocation } from 'wouter'

import { setLocalState, useLocalStore } from '../state/localState'
import PlayerName from '../components/PlayerName'
import FriendsList from '../components/FriendsList'
import BoardSettingsForm from '../components/BoardSettingsForm'
import BackButton from '../components/BackButton'
import PreviewBoard from '../components/PreviewBoard'
import { addLocalPlayer, createGame, generateBoard } from '../state/setters'
import { setTempState, useTempStore } from '../state/tempState'

const CreateGame: React.FC = function CreateGame() {
  const [, setLocation] = useLocation()
  const localStore = useLocalStore((state) => ({
    myId: state.myId,
    friends: state.friends,
    customBoards: state.customBoards,
  }))

  const tempStore = useTempStore((state) => ({
    pointsForVictory: state.pointsForVictory,
    boardMode: state.boardMode,
    selectedCustomBoardId: state.selectedCustomBoardId,
  }))

  useEffect(generateBoard, [])

  const create = () => {
    const gameId = nanoid()
    createGame(gameId)
    setLocation(`/play/${gameId}`)
  }

  const createCustomBoard = () => {
    const boardId = nanoid()
    setLocalState((draft) => {
      draft.customBoards[boardId] = {
        tiles: useTempStore.getState().currentTiles,
        name: '',
      }
    })
    setLocation(`/edit/${boardId}`)
  }

  const inviteLink = `${window.location.protocol}//${
    window.location.host + '?connect=' + localStore.myId
  }`

  if (!localStore.friends[localStore.myId].name) {
    return (
      <>
        <PlayerName label="What's your name?" />
      </>
    )
  }

  return (
    <>
      <BackButton />
      <div>
        <h3>Board settings</h3>
        <div>
          <label>
            <input
              type="radio"
              name="edit-mode"
              checked={tempStore.boardMode === 'random'}
              onChange={() =>
                setTempState((draft) => {
                  draft.boardMode = 'random'
                })
              }
            />
            Random board
          </label>
          <label>
            <input
              type="radio"
              name="edit-mode"
              checked={tempStore.boardMode === 'custom'}
              onChange={() =>
                setTempState((draft) => {
                  draft.boardMode = 'custom'
                })
              }
            />
            Custom board
          </label>
        </div>
        {tempStore.boardMode === 'random' && (
          <>
            <BoardSettingsForm onChange={generateBoard} />
            <button onClick={generateBoard}>Reshuffle</button>
          </>
        )}
        {tempStore.boardMode === 'custom' && (
          <ul>
            {Object.entries(localStore.customBoards).map(([id, board], i) => (
              <li key={i}>
                <label>
                  <input
                    type="radio"
                    name="selected-board"
                    checked={tempStore.selectedCustomBoardId === id}
                    onChange={() =>
                      setTempState((draft) => {
                        draft.selectedCustomBoardId = id
                      })
                    }
                  />
                  {board.name || 'no name'}
                </label>{' '}
                <a href={`edit/${id}`}>Edit</a>
              </li>
            ))}
          </ul>
        )}
        <PreviewBoard />
        <button onClick={createCustomBoard}>Create custom board</button>
        <h3>Winning</h3>
        <label>
          Points (optional)
          <input
            value={tempStore.pointsForVictory || ''}
            type="number"
            onChange={(e) =>
              setTempState((draft) => {
                draft.pointsForVictory =
                  e.target.value === '' ? undefined : parseInt(e.target.value)
              })
            }
          />
        </label>
        <h3>Players</h3>
        <FriendsList showLocalPlayers />
        <button onClick={() => addLocalPlayer(nanoid(), '')}>
          Add local player
        </button>{' '}
        <br />
        Invite new contacts by sharing this link:
        <a href={inviteLink}>{inviteLink}</a>
      </div>
      <button onClick={create}>Create game</button>
    </>
  )
}

export default CreateGame
