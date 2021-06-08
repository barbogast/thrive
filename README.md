# Thrive: Browser implementation of a certain(tm) board game

This repository contains the source code for an implementation for a certain, well-known board game. The game can be played with friends over the internet or from the same computer. It is implemented in Typescript using Canvas for rendering and WebRTC for peer-to-peer communication.

## Technical Documentation

- Canvas rendering with Konva
- Rendering the app with React and react-konva
- Working with the hex grid
- Working with towns and roads on the grid
- Directory structure: State, game logic components
- Peer-to-peer communication with PeerJS / WebRTC Data Channel
- Player and game management
- State management with zustand and immer
  - 3 different stores
  - interacting with stores: set\*State()
- Game logic:
  - state organisation
  - sequence
- Tooling: snowpack, TS, eslint
- Deployment with vercel

## TODO

### MVP

- Menu: make understandable and basic styling
- Points and Game end
- Implement unstable_batchedUpdates
- Make the whole app resilient against network errors

### Base Game

- When building roads or towns only show available positions
- Trading
  - with bank
  - with habour
  - with player
- In the initial phase the second road may only be built attached to the second town (right?)
- Dice roll 7: bad guy which steals / blocks resources
- Water
- Cities
- Give points for Longest Road
- Extension cards

### Additions

- Ships
- Map editor
- Record game, allow replay
- Implement graphs: points, buildings, resources

### UI

- improve UX
- make it pretty
- Build roads/towns with drag and drop
- Proper icons for resources and towns
- Display resources as cards which can be freely arranged by the player with drag and drop
- Show the mouse pointer of the player whose turn it is for all other players
