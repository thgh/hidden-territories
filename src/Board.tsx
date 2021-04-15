import React, { ReactNode, useMemo, useState } from 'react'

import { PlayerMusterStatus } from './components/Avatar'
import Button from './components/Button'
import { Card, PlanCards } from './components/Card'
import { Dice } from './components/Dice'
import { DiceAllocator } from './components/DiceAllocator'
import { ButtonTheme, CardTheme } from './lib/theme'

import Hexagon from './Hexagon'
import { HexGrid } from './HexGrid'
import { HexGridUI } from './HexGridUI'
import { HexToken } from './HexToken'
import { ActionCard, createPersona, GameProps, roll } from './HiddenTerritories'
import Persona from './Persona'

export function Board(props: GameProps) {
  // console.log('Board', props)

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
      {ctx.phase === 'muster' && <MusterPhase {...props} />}
      {ctx.phase === 'daytime' && <DaytimePhase {...props} />}
      {/* {ctx.phase === 'play' && props.isActive && <PlayPhase {...props} />} */}
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
          <p key={quest}>
            <ButtonTheme action>
              <Button onClick={() => moves.toggleVote(quest)}>
                Quest {quest}
              </Button>
            </ButtonTheme>
            {count ? (
              <span style={{ marginLeft: 24 }}>
                {count} votes
                <Button
                  style={{ marginLeft: 24 }}
                  onClick={() => moves.loadQuest(quest)}
                >
                  Confirm
                </Button>
              </span>
            ) : null}
          </p>
        )
      })}
    </Modal>
  )
}

function MusterPhase(props: GameProps) {
  console.log('MusterPhase', props.playerID, props)
  const { G, moves, playerID } = props
  const me = G.players.find((p) => p.id === playerID)!

  const random = useMemo(() => roll(5), [])

  if (!me) {
    return <InitPlayerModal {...props} />
  }

  if (!me.plannedCardsConfirmed) {
    return (
      <Modal padding>
        <h1>Muster phase</h1>
        <h2>Lay out which actions you want to do during this turn.</h2>
        <PlanCards
          cards={me.cards}
          planAction={(k) => {
            console.log('plnaction', k)
            moves.planAction(k)
          }}
        />
        <ButtonTheme action disabled={!me.cards.find(Boolean)}>
          <Button
            onClick={() => moves.confirmPlannedCards()}
            disabled={!me.cards.find(Boolean)}
          >
            Confirm
          </Button>
        </ButtonTheme>
      </Modal>
    )
  }

  if (!me.diceConfirmed) {
    return (
      <Modal padding>
        <h1>Rolling the dice...</h1>
        <h2>You threw these dice:</h2>
        <Dice items={random} />
        <div style={{ marginBottom: 24 }}></div>
        <ButtonTheme action>
          <Button onClick={() => moves.confirmDice()}>Confirm dice</Button>
        </ButtonTheme>
      </Modal>
    )
  }

  if (!me.allocationConfirmed) {
    return (
      <Modal padding>
        <h1>Allocate the dice...</h1>
        <h2>Drag each die to an action card.</h2>
        <DiceAllocator
          cards={me.cards.filter((c) => c?.type) as ActionCard[]}
          temp_random={random}
          allocations={me.allocations}
          allocate={(data: {
            index: number
            die: { index: number; side: number }
          }) => {
            console.log('allocate', data)
            moves.allocateDie(data)
          }}
        />
        <div style={{ marginBottom: 24 }}></div>
        <ButtonTheme action>
          <Button onClick={() => moves.confirmAllocation()}>Confirm</Button>
        </ButtonTheme>
      </Modal>
    )
  }

  return (
    <Modal padding>
      <h1>Waiting for others...</h1>
      <h2>Almost there!</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginLeft: -20,
        }}
      >
        {G.players.map((p) => (
          <CardTheme positive={p.allocationConfirmed}>
            <PlayerMusterStatus player={p} />
          </CardTheme>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}></div>
      <ButtonTheme action>
        <Button onClick={() => moves.endMusterPhase()}>
          Abort muster phase
        </Button>
      </ButtonTheme>
    </Modal>
  )
}

function DaytimePhase({ moves, G, playerID }: GameProps) {
  const me = G.players.find((p) => p.id === playerID)!
  const card = me.cards[0]
  if (!card) {
    return (
      <Modal padding>
        <h1>No action cards left</h1>
        <p>Waiting for next turn...</p>
        <ButtonTheme action>
          <Button onClick={() => moves.endDaytimePhase()}>Abort daytime</Button>
        </ButtonTheme>
      </Modal>
    )
  }

  if (card.type === 'move') {
    return (
      <Modal padding overflow="auto">
        <div style={{ float: 'left' }}>
          <Card size={70}>
            <div style={{ textAlign: 'center' }}>Move</div>
          </Card>
        </div>
        <h1>Move</h1>
        <h2>What's your target location?</h2>
        <ButtonTheme action disabled={!me.cards.find(Boolean)}>
          <Button onClick={() => moves.executeCard()}>Start moving...</Button>
        </ButtonTheme>
      </Modal>
    )
  }

  if (card.type === 'search') {
    return (
      <Modal padding overflow="auto">
        <div style={{ float: 'left' }}>
          <Card size={70}>
            <div style={{ textAlign: 'center' }}>{card.type}</div>
          </Card>
        </div>
        <h1>Search</h1>
        <h2>How about we open this chest?</h2>
        <ButtonTheme action disabled={!me.cards.find(Boolean)}>
          <Button onClick={() => moves.executeCard()}>
            Search in hex {me.x},{me.y}
          </Button>
        </ButtonTheme>
      </Modal>
    )
  }

  return (
    <Modal padding overflow="auto">
      <div style={{ float: 'left' }}>
        <Card size={70}>
          <div style={{ textAlign: 'center' }}>{card.type}</div>
        </Card>
      </div>
      <h1>Daytime phase TODO</h1>
      <h2>Execute your action cards one by one.</h2>
      <ButtonTheme action disabled={!me.cards.find(Boolean)}>
        <Button onClick={() => moves.execute()}>Start {card.type}</Button>
      </ButtonTheme>
    </Modal>
  )
}

function MoveAction(params: type) {}

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
        <Button onClick={() => setPersona(createPersona())}>Randomize</Button>
      </div>
      <ButtonTheme action>
        <Button onClick={() => moves.initPlayer({ persona })}>Confirm</Button>
      </ButtonTheme>
      <Button>Continue as spectator</Button>
    </Modal>
  )
}

// function PlayPhase(props: GameProps) {
//   const stage = props.ctx.activePlayers?.[props.playerID]

//   const endStage = () => {
//     props.events.endStage?.()
//     // Workaround to trigger the endIf hook
//     setTimeout(props.moves.check, 500)
//   }

//   useEffect(() => {
//     setTimeout(props.moves.check, 500)
//   }, [props.moves.check])

//   return (
//     <div
//       style={{
//         position: 'absolute',
//         zIndex: 20,
//         width: '100%',
//       }}
//     >
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'center',
//           maxWidth: 600,
//           margin: 'auto',
//         }}
//       >
//         <div
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             backgroundColor: '#333',
//             borderBottomLeftRadius: 20,
//             borderBottomRightRadius: 20,
//             overflow: 'hidden',
//             fontSize: 14,
//           }}
//         >
//           {stage === 'travel' ? (
//             <div>
//               <span style={{ padding: '12px 1.5em' }}>
//                 Click on the hexagons to travel around
//                 {/* {props.ctx.numMoves
//                   ? 'You did ' + props.ctx.numMoves + ' moves'
//                   : 'Click on the hexagons to travel around'} */}
//               </span>
//               <ActionButton type="button" onClick={endStage}>
//                 end turn
//               </ActionButton>
//             </div>
//           ) : stage === 'wait' ? (
//             <div style={{ padding: '12px 1.5em' }}>
//               You are waiting for the other players
//             </div>
//           ) : !stage ? (
//             <div>
//               <span
//                 style={{
//                   fontSize: 12,
//                   fontWeight: 'bold',
//                   opacity: 0.6,
//                   padding: '12px 1.5em',
//                 }}
//               >
//                 Choose your action
//               </span>
//               <ActionButton
//                 type="button"
//                 onClick={() => props.events.setStage?.('attack')}
//               >
//                 attack
//               </ActionButton>
//               <ActionButton
//                 type="button"
//                 onClick={() => props.events.setStage?.('travel')}
//               >
//                 travel
//               </ActionButton>
//             </div>
//           ) : (
//             <div>
//               <span style={{ padding: '12px 1.5em' }}>
//                 Unknown stage: {stage}
//               </span>
//               <ActionButton type="button" onClick={endStage}>
//                 end turn
//               </ActionButton>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// function ActionButton(props: any) {
//   return <Button className="btn-action" {...props} />
// }

function Modal({
  children,
  overflow,
  padding = false,
  row = false,
}: {
  children: ReactNode
  overflow?: 'auto'
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
          overflow: overflow,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          // overflow: 'hidden',
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

// function Cards({
//   cards,
//   planAction,
//   onDrop,
// }: {
//   cards: (ActionCard | null)[]
//   planAction?: PlanActionCard
//   onDrop?: AllocateDie
// }) {
//   return (
//     <div
//       style={{
//         display: 'flex',
//         margin: '1em 0',
//         justifyContent: 'space-between',
//       }}
//     >
//       {cards.map((action, index) => (
//         <Card
//           key={index}
//           selected={action}
//           index={index}
//           planAction={planAction}
//           onDrop={onDrop}
//         />
//       ))}
//     </div>
//   )
// }
// function Card({
//   selected,
//   index,
//   planAction,
//   onDrop,
// }: {
//   selected: ActionCard | null
//   index: number
//   planAction?: PlanActionCard
//   onDrop?: AllocateDie
// }) {
//   const [expanded, setExpanded] = useState(false)
//   const [dropping, setDropping] = useState(false)
//   return (
//     <div
//       className="card"
//       style={{
//         position: 'relative',
//         display: 'flex',
//         justifyContent: 'center',
//         flexDirection: 'column',
//         flex: '0 0 auto',
//         marginRight: 10,
//         width: 100,
//         height: 150,
//         borderRadius: 6,
//         backgroundColor: dropping ? '#ffffff44' : '#77777733',
//       }}
//       onDragOver={(e) => {
//         e.preventDefault()
//         setDropping(true)
//       }}
//       onDragEnter={() => setDropping(true)}
//       onDragLeave={() => setDropping(false)}
//       onDrop={(evt: any) => {
//         console.log('d', evt.dataTransfer.getData('text'))
//         var data = evt.dataTransfer.getData('text')
//         if (data) {
//           try {
//             onDrop?.({ index, die: JSON.parse(data) })
//           } catch (e) {
//             console.warn('failed to drop', data, e)
//           }
//         }
//         setDropping(false)
//       }}
//     >
//       {selected && (
//         <div
//           style={{
//             flex: 3,
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center',
//             textAlign: 'center',
//           }}
//         >
//           Selected: <div>{selected.type}</div>
//         </div>
//       )}

//       {planAction &&
//         (!selected ? (
//           <Button
//             className="btn btn--card"
//             onClick={() => setExpanded((e) => !e)}
//           >
//             Select...
//           </Button>
//         ) : (
//           <Button
//             className="btn btn--card"
//             onClick={() => {
//               planAction({
//                 index,
//                 action: null,
//               })
//               setExpanded((e) => !e)
//             }}
//           >
//             Select...
//           </Button>
//         ))}

//       {expanded && planAction && (
//         <div
//           onClick={() => setExpanded((e) => !e)}
//           style={{
//             position: 'absolute',
//             top: '100%',
//             left: 0,
//             backgroundColor: 'black',
//           }}
//         >
//           {Object.keys(optionTree).map((type) => (
//             <Button
//               key={type}
//               className="btn btn--dropdown"
//               onClick={() => planAction({ index, action: { type } })}
//             >
//               {type}
//             </Button>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
