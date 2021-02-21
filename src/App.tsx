import { Local } from 'boardgame.io/multiplayer'
import { Client } from 'boardgame.io/react'
import { Board } from './Board'
import { HiddenTerritories } from './HiddenTerritories'

const App = Client({
  game: HiddenTerritories,
  board: Board,
  multiplayer: Local(),
})

export default App
