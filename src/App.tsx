import { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from 'react-router-dom'

import { Local } from 'boardgame.io/multiplayer'
import { SocketIO } from 'boardgame.io/multiplayer'

import { Client, Lobby } from 'boardgame.io/react'
import { Board } from './components/Board'
import { HiddenTerritories } from './HiddenTerritories'
import { ioServer, gameServer } from './lib/urls'

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/game/:matchID/:playerID">
          <Playground />
        </Route>
        <Route path="/game/:matchID">
          <PlayerSelection />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export function Playground() {
  const { playerID, matchID } = useParams<{
    playerID: string
    matchID: string
  }>()
  const Component = Client({
    game: HiddenTerritories,
    board: Board,
    multiplayer: SocketIO({ server: ioServer() }),
  })
  return (
    <Component
      debug={window.location.search.includes('debug')}
      matchID={matchID}
      playerID={playerID}
      credentials={document.cookie.replace(
        /(?:(?:^|.*;\s*)lobbyState\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      )}
    />
  )
}

export function PlayerSelection() {
  const { matchID } = useParams<{ matchID: string }>()
  const Component = Client({
    game: HiddenTerritories,
    board: Board,
    multiplayer: Local(),
  })
  return <Component matchID={matchID} />
}

export function Home() {
  return (
    <div>
      <h1>Welcome!</h1>

      <a href={'/game/' + new Date().toJSON().slice(0, 10) + '/0'}>
        <h3>Daily game</h3>
      </a>

      <h3>Public lobby</h3>
      <fieldset>
        <legend>Built-in lobby component</legend>
        <Lobby
          lobbyServer={gameServer()}
          gameServer={gameServer()}
          debug
          gameComponents={[{ game: HiddenTerritories, board: Redirecter }]}
        />
      </fieldset>

      <h3>Private game</h3>
      <p>Create a private game</p>
      <input id="private_id" />
      <button
        onClick={() => {
          window.location.href =
            '/game/' +
            (document.getElementById('private_id') as HTMLInputElement)?.value +
            '/0'
        }}
      >
        Create
      </button>
    </div>
  )
}

function Redirecter(props: any) {
  useEffect(() => {
    window.location.href = '/game/R_' + props.matchID + '/' + props.playerID
  }, [props.matchID, props.playerID])
  return <div>{JSON.stringify(props, null, 2)}</div>
}
