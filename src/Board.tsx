import Hexagon from './Hexagon'
import { HexGrid } from './HexGrid'
import { HexGridUI } from './HexGridUI'
import { HexToken } from './HexToken'
import { GameState } from './HiddenTerritories'
import Persona from './Persona'

export function Board(props: { G: GameState; [key: string]: any }) {
  console.log('prop', props)

  return (
    <div
      style={{
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
            <HexToken x={x} y={y} key={id} dev>
              <Persona persona={persona} />
            </HexToken>
          ))}
        </HexGridUI>
      </HexGrid>
      {/* <HexGrid
        levels={this.props.G.grid.levels}
        // style={hexStyle}
        colorMap={this.props.G.grid.colorMap}
        onClick={this.cellClicked}
      >
        {this.props.G.insects.map((insect, i) => {
          const { x, y, z } = insect.point
          return (
            <Token x={x} y={y} z={z} key={i}>
              {x}-{y}
            </Token>
          )
        })}
      </HexGrid> */}
      {/* {winner} */}
    </div>
  )
}
