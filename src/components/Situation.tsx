import React, { useEffect, useState } from 'react'

import { ButtonTheme } from '../lib/theme'
import type { GameProps, Situation, Moves } from '../lib/types'
import Button from './Button'
import { Card } from './Card'
import Modal from './Modal'

export default function SituationComponent(props: GameProps) {
  const { moves, G, playerID } = props
  const me = G.players.find((p) => p.id === playerID)!
  const situation = me.blocking[0]
  if (!situation) {
    return (
      <Modal padding>
        <h1>No situation?</h1>
      </Modal>
    )
  }

  if (situation.type === 'message' || situation.type === 'lost') {
    // @ts-ignore
    return <MessageSituation {...{ situation, moves }} />
  }

  if (situation.type === 'encounter') {
    // @ts-ignore
    return <Encounter {...{ situation, moves }} />
  }

  return (
    <Modal padding overflow="auto">
      <div style={{ float: 'left' }}>
        <Card size={70}>
          <div style={{ textAlign: 'center' }}>{situation.type}</div>
        </Card>
      </div>
      <h1>{situation.title}</h1>
      <h2>{situation.description}</h2>
      <ButtonTheme action>
        <Button onClick={() => moves.endSituation()}>
          Skip this situation
        </Button>
      </ButtonTheme>
    </Modal>
  )
}

function Encounter({
  situation,
  moves,
}: {
  situation: Situation
  moves: Moves
}) {
  return (
    <Modal padding>
      <h1>{situation.title || 'You have an encounter'}</h1>
      <h2>{situation.description || ''}</h2>
      <ButtonTheme action>
        <Button onClick={() => moves.fight()}>Fight</Button>
        <Button onClick={() => moves.evade()}>Evade</Button>
      </ButtonTheme>
    </Modal>
  )
}

function MessageSituation({
  situation,
  moves,
}: {
  situation: Situation
  moves: Moves
}) {
  const [seconds, setSeconds] = useState(situation.countdown || 3)
  useEffect(() => {
    if (!seconds) {
      moves.endSituation()
    }
    if (seconds > 0) {
      const t = setTimeout(() => setSeconds((s) => (s > 0 ? s - 1 : s)), 1000)
      return () => clearTimeout(t)
    }
  }, [moves, seconds, setSeconds])
  return (
    <Modal padding>
      <h1>{situation.title}</h1>
      <h2>{situation.description}</h2>
      <ButtonTheme action>
        <Button
          onClick={() => moves.endSituation()}
          onMouseEnter={() => setSeconds(-1)}
        >
          {seconds > 0 ? `Continuing in ${seconds}...` : 'Continue'}
        </Button>
      </ButtonTheme>
    </Modal>
  )
}
