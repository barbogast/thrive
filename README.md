# Thrive: Browser version of a certain(tm) board game

This repository contains the source code for an implementation for a certain, well-known board game. The game can be played with friends over the internet or from the same computer. It is implemented in Typescript using Canvas for rendering and WebRTC for peer-to-peer communication.

## Technical Documentation

- Canvas rendering with Konva
  - Why canvas? Why konva?
- Rendering the app with React and react-konva
  - Why react? Why react-konva?
- Working with the hex grid
  - Coordinate system (axial and offset)
  - Representation within the state
- Working with towns and roads on the grid
  - townPositionIs2RoadsApart
  - roadPositionConnectsToExistingRoad
  - townPositionConnectsToExistingRoad
- Directory structure: State, game logic, components
- Peer-to-peer communication with PeerJS / WebRTC Data Channel
  - Why WebRTC?
  - Why peerJS?
  - RTC system
  - Connect to a new player
  - Starting a game
  - Updating the game state
- Player and game management
  - Managing known players
  - Players within a game
- State management with zustand and immer
  - Why zustand?
  - Why immer?
  - 3 different stores
    - Why?
    - Details
  - interacting with stores: set\*State()
- Game logic:
  - state organisation
  - sequence
- Tooling: snowpack, TS, eslint
- Deployment with vercel

## TODO

What's left to do...

### MVP

To make the game playable in its most simple form:

- Menu: make understandable and basic styling
- Points and Game end
- Implement unstable_batchedUpdates
- Make the whole app resilient against network errors

### Base Game

Missing elements from a certain(tm) board game

- When building roads or towns only show available positions
- Trading
  - with bank
  - with habour
  - with player
- In the initial phase the second road may only be built attached to the second town (right?)
- Dice roll 7: bad guy which steals / blocks resources
- Water
- Give points for Longest Road
- Extension cards

### Additions

Ideas for more features

- Ships
- Map editor
- Record game, allow replay
- Implement graphs: points, buildings, resources

### UI

Work on the user interface

- improve UX
- make it pretty
- Build roads/towns with drag and drop
- Proper icons for resources and towns
- Display resources as cards which can be freely arranged by the player with drag and drop
- Show the mouse pointer of the player whose turn it is for all other players
- Support playing on mobile devices

### Minor
