import { ReactNode, useEffect, useState } from 'react'
import Hexagon from './Hexagon'
import { HexGrid } from './HexGrid'
import { HexGridUI } from './HexGridUI'
import { HexToken } from './HexToken'
import {
  ActionCard,
  createPersona,
  GameProps,
  PlanActionCard,
} from './HiddenTerritories'
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

      {ctx.phase === 'prepare' && <PreparePhase {...props} />}
      {ctx.phase === 'plan' && <PlanPhase {...props} />}
      {ctx.phase === 'play' && props.isActive && <PlayPhase {...props} />}
    </div>
  )
}

function PreparePhase({ moves, G }: GameProps) {
  const votes = Object.values(G.vote || {})
  return (
    <Modal padding>
      <h1>Prepare phase</h1>
      <h2>Choose a quest</h2>
      {[1, 2, 3].map((quest) => {
        const count = votes.filter((v) => v === quest).length
        return (
          <p>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => moves.toggleVote(quest)}
            >
              Quest {quest}
            </button>
            {count ? (
              <span style={{ marginLeft: 24 }}>
                {count} votes
                <button
                  className="btn btn-subtle"
                  type="button"
                  style={{ marginLeft: 24 }}
                  onClick={() => moves.loadQuest(quest)}
                >
                  Confirm
                </button>
              </span>
            ) : null}
          </p>
        )
      })}
    </Modal>
  )
}

function PlanPhase(props: GameProps) {
  console.log('planph')
  const { G, moves, playerID } = props
  const me = G.players.find((p) => p.id === playerID)!

  if (!me) {
    return <InitPlayerModal {...props} />
  }

  return (
    <Modal padding>
      <h1>Muster phase</h1>
      <h2>Lay out which actions you want to do during this turn.</h2>
      <Cards
        cards={me?.cards}
        planAction={(k) => {
          console.log('plnaction', k)
          moves.planAction(k)
        }}
      />
      <button className="btn btn-primary" onClick={moves.waitForAll}>
        Confirm
      </button>
      {G.waiting.join(', ')}
    </Modal>
  )
}

function InitPlayerModal({ moves }: GameProps) {
  const [persona, setPersona] = useState(() => createPersona())
  return (
    <Modal padding>
      <h1>Add player</h1>
      <h2>It's your first turn, let's setup your profile.</h2>
      <div style={{ width: 100, height: 110 }}>
        <Persona persona={persona} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <button
          className="btn btn-subtle"
          onClick={() => setPersona(createPersona())}
        >
          Randomize
        </button>
      </div>
      <button className="btn btn-primary" onClick={() => moves.initPlayer({})}>
        Confirm
      </button>
      <button className="btn btn-subtle">Continue as spectator</button>
    </Modal>
  )
}

function PlayPhase(props: GameProps) {
  const stage = props.ctx.activePlayers?.[props.playerID]

  const endStage = () => {
    props.events.endStage?.()
    // Workaround to trigger the endIf hook
    setTimeout(props.moves.check, 500)
  }

  useEffect(() => {
    setTimeout(props.moves.check, 500)
  }, [props.moves.check])

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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#333',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            overflow: 'hidden',
            fontSize: 14,
          }}
        >
          {stage === 'travel' ? (
            <div>
              <span style={{ padding: '12px 1.5em' }}>
                Click on the hexagons to travel around
                {/* {props.ctx.numMoves
                  ? 'You did ' + props.ctx.numMoves + ' moves'
                  : 'Click on the hexagons to travel around'} */}
              </span>
              <ActionButton type="button" onClick={endStage}>
                end turn
              </ActionButton>
            </div>
          ) : stage === 'wait' ? (
            <div style={{ padding: '12px 1.5em' }}>
              You are waiting for the other players
            </div>
          ) : !stage ? (
            <div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  opacity: 0.6,
                  padding: '12px 1.5em',
                }}
              >
                Choose your action
              </span>
              <ActionButton
                type="button"
                onClick={() => props.events.setStage?.('attack')}
              >
                attack
              </ActionButton>
              <ActionButton
                type="button"
                onClick={() => props.events.setStage?.('travel')}
              >
                travel
              </ActionButton>
            </div>
          ) : (
            <div>
              <span style={{ padding: '12px 1.5em' }}>
                Unknown stage: {stage}
              </span>
              <ActionButton type="button" onClick={endStage}>
                end turn
              </ActionButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ActionButton(props: any) {
  return <button className="btn-action" {...props} />
}

function Modal({
  children,
  padding = false,
  row = false,
}: {
  children: ReactNode
  padding?: boolean
  row?: boolean
}) {
  return (
    <div className="modal">
      <div
        className="modal-body"
        style={{
          maxWidth: 600,
          margin: 'auto',
          padding: padding ? 24 : 0,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          overflow: 'hidden',
          fontSize: 14,
          ...(row && {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }),
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Cards({
  cards,
  planAction,
}: {
  cards: (ActionCard | null)[]
  planAction: PlanActionCard
}) {
  return (
    <div
      style={{
        display: 'flex',
        margin: '1em 0',
        justifyContent: 'space-between',
      }}
    >
      {cards
        .concat(null, null, null, null, null)
        .slice(0, 5)
        .map((action, index) => (
          <Card
            key={index}
            selected={action}
            index={index}
            planAction={planAction}
          />
        ))}
    </div>
  )
}
function Card({
  selected,
  index,
  planAction,
}: {
  selected: ActionCard | null
  index: number
  planAction: PlanActionCard
}) {
  const optionTree: { [key: string]: string[] } = {
    move: ['walk', 'fly', 'swim', 'follow', 'avoid'],
    search: ['food', 'cache'],
    engage: ['melee', 'ranged', 'spell'],
  }
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        flex: '0 0 auto',
        marginRight: 10,
        width: 100,
        height: 150,
        borderRadius: 6,
        backgroundColor: '#77777733',
      }}
    >
      {!selected ? (
        Object.keys(optionTree).map((option) => (
          <button
            key={option}
            className="btn btn-card"
            onClick={() =>
              planAction({
                index,
                action: { type: option, modifier: optionTree[option][0] },
              })
            }
          >
            {option}
          </button>
        ))
      ) : !optionTree[selected.type] ? (
        <>
          <div>wut {selected.type}</div>
        </>
      ) : (
        <>
          {optionTree[selected.type].map((mod) => (
            <button
              key={mod}
              className={
                'btn btn-card ' +
                (selected.modifier === mod ? ' btn-card--selected' : '')
              }
              disabled={selected.modifier === mod}
              onClick={() =>
                planAction({
                  index,
                  action: { type: selected.type, modifier: mod },
                })
              }
            >
              {mod}
            </button>
          ))}
          <button
            className="btn btn-card"
            onClick={() =>
              planAction({
                index,
                action: null,
              })
            }
          >
            other
          </button>
        </>
      )}
    </div>
  )
}
