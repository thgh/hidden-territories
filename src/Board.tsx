import Hexagon from './Hexagon'
import { HexGrid } from './HexGrid'
import { HexGridUI } from './HexGridUI'
import { HexToken } from './HexToken'
import { GameProps } from './HiddenTerritories'
import Persona from './Persona'

export function Board(props: GameProps) {
  console.log('prop', props)

  const { ctx } = props

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
          {props.G.cells.map(({ x, y, terrain }) => (
            <HexToken x={x} y={y} key={x + '.' + y}>
              <Hexagon
                label={x + ' | ' + y}
                terrain={terrain}
                //@ts-ignore
                onClick={() => props.moves.travel({ x, y })}
              />
            </HexToken>
          ))}
          {props.G.players.map(({ x, y, id, persona }) => (
            <HexToken x={x} y={y} key={id}>
              <Persona persona={persona} />
            </HexToken>
          ))}
        </HexGridUI>
      </HexGrid>

      {ctx.phase === 'build' && <BuildPhase {...props} />}
      {ctx.phase === 'play' && props.isActive && <PlayPhase {...props} />}
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

function PlayPhase(props: GameProps) {
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 20,
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          maxWidth: 600,
          margin: 'auto',
        }}
      >
        <form
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#333',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            overflow: 'hidden',
          }}
          onSubmit={(evt) => {
            evt.preventDefault()
            props.events.endTurn?.()
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              opacity: 0.6,
              padding: '12px 1.5em 12px',
            }}
          >
            Choose your action
          </div>
          <div className="btn-action">
            {props.ctx.numMoves && props.ctx.numMoves > 1
              ? props.ctx.numMoves + ' moves'
              : 'move'}
          </div>
          <div>
            <ActionButton type="submit">attack</ActionButton>
          </div>
          <div style={{}}>
            <ActionButton type="submit">end</ActionButton>
          </div>
        </form>
      </div>
    </div>
  )
}
function ActionButton(props: any) {
  return <button className="btn-action" {...props} />
}
