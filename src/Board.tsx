import Hexagon from './Hexagon'
import { HexGrid } from './HexGrid'
import { HexGridUI } from './HexGridUI'
import { HexToken } from './HexToken'
import { GameProps } from './HiddenTerritories'
import Persona from './Persona'

export function Board(props: GameProps) {
  console.log('prop', props)

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      <HexGrid>
        <HexGridUI>
          {props.G.cells.map(({ x, y }) => (
            <HexToken x={x} y={y} key={x + '.' + y}>
              <Hexagon label={x + ' | ' + y} />
            </HexToken>
          ))}
          {props.G.players.map(({ x, y, id, persona }) => (
            <HexToken x={x} y={y} key={id}>
              <Persona persona={persona} />
            </HexToken>
          ))}
        </HexGridUI>
      </HexGrid>

      {props.ctx.phase === 'build' && <BuildPhase {...props} />}
    </div>
  )
}

function BuildPhase(props: GameProps) {
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 20,
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: 'auto',
          padding: 100,
          backgroundColor: '#444',
        }}
      >
        <form
          style={{}}
          onSubmit={(evt) => {
            evt.preventDefault()
            props.events.endPhase?.()
          }}
        >
          <h1>Build phase</h1>
          <p>Build your character</p>
          <p>...</p>
          <p>
            <button type="submit">Play!</button>
          </p>
        </form>
      </div>
    </div>
  )
}
