import React, { useContext, useEffect, useMemo, useState } from 'react'

import { PlayerMusterStatus, PlayerStatus } from './Avatar'
import Button from './Button'
import { Card, PlanCards } from './Card'
import { Dice } from './Dice'
import { DiceAllocator } from './DiceAllocator'
import { ButtonTheme, CardTheme } from '../lib/theme'

import Hexagon from './Hexagon'
import { GridContext, HexGrid } from './HexGrid'
import { HexGridUI } from './HexGridUI'
import { HexToken } from './HexToken'
import { ActionCard, GameProps, Moves, Position } from '../lib/types'
import Persona from './Persona'
import Modal from './Modal'
import Situation from './Situation'
import { roll, createPersona } from '../lib/player'

export function Board(props: GameProps) {
  // console.log('Board', props)

  const { ctx } = props
  const { G, playerID } = props
  const me = G.players.find((p) => p.id === playerID)!

  return (
    <HexGrid>
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
        <HexGridUI>
          {props.G.cells.map(({ x, y, terrain }) => (
            <HexToken x={x} y={y} key={x + '.' + y}>
              <Hexagon
                label={x + ' | ' + y}
                terrain={terrain}
                //@ts-ignore
                // onClick={() => props.moves.travel({ x, y })}
              />
            </HexToken>
          ))}
          {props.G.players.map(({ x, y, id, persona }) => (
            <HexToken x={x} y={y} key={id}>
              <Persona persona={persona} />
            </HexToken>
          ))}
        </HexGridUI>

        {!me ? (
          <Modal padding>Wait for the muster phase to join the game</Modal>
        ) : me?.blocking.length ? (
          <Situation {...props} />
        ) : ctx.phase === 'prepare' || !me ? (
          <PreparePhase {...props} />
        ) : ctx.phase === 'muster' ? (
          <MusterPhase {...props} />
        ) : ctx.phase === 'daytime' ? (
          <DaytimePhase {...props} />
        ) : null}
        {/* {ctx.phase === 'play' && props.isActive && <PlayPhase {...props} />} */}
      </div>
    </HexGrid>
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
        {G.players.map((p, key) => (
          <CardTheme positive={p.allocationConfirmed} key={key}>
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

function DaytimePhase(props: GameProps) {
  const { moves, G, playerID } = props
  const me = G.players.find((p) => p.id === playerID)!
  const card = me.cards[0]
  if (!card) {
    return (
      <Modal padding>
        <h1>No action cards left</h1>
        <h2>Waiting for next turn...</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginLeft: -20,
          }}
        >
          {G.players.map((p, key) => (
            <CardTheme positive={p.allocationConfirmed} key={key}>
              <PlayerStatus
                player={p}
                label={p.cards.length ? p.cards.length + ' cards' : ''}
              />
            </CardTheme>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}></div>
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
        <MoveAction {...props} />
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
      <h2>This action card is not yet implemented.</h2>
      <ButtonTheme action disabled={!me.cards.find(Boolean)}>
        <Button onClick={() => moves.executeCard()}>Throw away</Button>
      </ButtonTheme>
    </Modal>
  )
}

function MoveAction(props: GameProps) {
  const moves = props.moves as Moves
  // const me = G.players.find((p) => p.id === playerID)!
  const { setHexProps } = useContext(GridContext)
  const [target, setTarget] = useState<Position | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  useEffect(() => {
    setHexProps({
      onMouseEnter: (x, y, evt) => {
        if (!confirmed) {
          document
            .querySelector('.hovering')
            ?.closest('.hex')
            ?.classList.remove('hovering')
          evt.target.closest('.hex')?.classList.add('hovering')
          setTarget({ x, y })
        }
      },
      onClick: (x, y, evt) => {
        setConfirmed((c) => {
          document
            .querySelector('.hovering')
            ?.closest('.hex')
            ?.classList.remove('hovering')
          evt.target.closest('.hex')?.classList.add('hovering')
          setTarget({ x, y })

          // Only mark as target when confirmed
          document
            .querySelector('.action-move-target')
            ?.closest('.hex')
            ?.classList.remove('action-move-target')
          if (!c) {
            evt.target.closest('.hex')?.classList.add('action-move-target')
          }

          return !c
        })
      },
    })
    return () => {
      setHexProps(null)
    }
    // eslint-disable-next-line
  }, [target, confirmed])
  return (
    <div>
      <h1>Choose a target location</h1>
      <h2>
        The further you go, the more chance you encounter denizens!{' '}
        {confirmed ? 1 : 2}
      </h2>
      <ButtonTheme action disabled={!confirmed}>
        <Button
          onClick={() => moves.executeMove(target!)}
          disabled={!confirmed}
        >
          Start moving{target && ' to ' + target.x + ',' + target.y}...
        </Button>
      </ButtonTheme>
    </div>
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
