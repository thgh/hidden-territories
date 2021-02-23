import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { Local } from 'boardgame.io/multiplayer'
// import { SocketIO } from 'boardgame.io/multiplayer'
// : SocketIO({ server: 'localhost:8000' })
import { Client, Lobby } from 'boardgame.io/react'
import { Board } from './Board'
import { HiddenTerritories } from './HiddenTerritories'

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/game/:game/:playerID">
          <Playground />
        </Route>
        <Route path="/game/:game">
          <PlayerSelection />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export function Playground({ playerID = '' }) {
  const Component = Client({
    game: HiddenTerritories,
    board: Board,
    multiplayer: Local(),
  })
  return <Component playerID={playerID} />
}

export function PlayerSelection() {
  const Component = Client({
    game: HiddenTerritories,
    board: Board,
    multiplayer: Local(),
  })
  return <Component />
}

export function Home() {
  return (
    <div>
      <h1>Welcome! You are in the public lobby.</h1>
      <h3>Public lobby</h3>
      <fieldset>
        <legend>Built-in lobby component</legend>
        <Lobby gameComponents={[{ game: HiddenTerritories, board: Board }]} />
      </fieldset>

      <h3>Private game</h3>
      <p>Create a private game</p>
      <input />
      <button>Create</button>
    </div>
  )
}
