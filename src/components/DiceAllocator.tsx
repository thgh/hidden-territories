import React, { useState } from 'react'
import {
  ActionCard,
  AllocateDie,
  Allocation,
  RolledDie,
} from '../HiddenTerritories'
import { CardTheme } from '../lib/theme'
import { Card } from './Card'
import { Die } from './Dice'

export function DiceAllocator({
  cards,
  allocations,
  allocate,
  temp_random: random,
}: {
  cards: ActionCard[]
  allocations: Allocation[]
  allocate: AllocateDie
  temp_random: RolledDie[]
}) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          margin: '1em 0',
          justifyContent: 'space-between',
        }}
      >
        {cards.map((action, index) => (
          <DiceAllocatorCard
            key={index}
            card={action}
            index={index}
            allocations={allocations.filter((a) => a.index === index)}
            onDrop={allocate}
          />
        ))}
      </div>
      <div style={{ marginBottom: 24 }}></div>
      <div style={{ display: 'flex', flexDirection: 'row', margin: -12 }}>
        {random
          .filter((r, index) => !allocations.find((a) => a.die.index === index))
          .map(({ side, index }) => (
            <Die index={index} side={side} draggable key={index} />
          ))}
      </div>
    </div>
  )
}

function DiceAllocatorCard({
  card,
  index,
  allocations,
  onDrop,
}: {
  card: ActionCard
  index: number
  allocations?: Allocation[]
  onDrop?: AllocateDie
}) {
  const [dropping, setDropping] = useState(false)
  return (
    <CardTheme selected={!!allocations?.length} positive={dropping}>
      <Card
        onDragOver={(e) => {
          e.preventDefault()
          setDropping(true)
        }}
        onDragEnter={() => setDropping(true)}
        onDragLeave={() => setDropping(false)}
        onDrop={(evt: any) => {
          console.log('zzd', evt.dataTransfer.getData('text'))
          var data = evt.dataTransfer.getData('text')
          if (data) {
            try {
              onDrop?.({ index, die: JSON.parse(data) })
            } catch (e) {
              console.warn('failed to drop', data, e)
            }
          }
          setDropping(false)
        }}
      >
        <div style={{ textAlign: 'center' }}>{card.type}</div>
        {allocations?.length ? (
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 'calc(100% - 10px)',
              width: 'calc(100% + 20px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {allocations.map(({ die }) => (
              <Die {...die} size={18} margin={2} draggable />
            ))}
          </div>
        ) : null}
      </Card>
    </CardTheme>
  )
}
