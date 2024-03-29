import { HTMLAttributes, useState } from 'react'
import { optionTree } from '../HiddenTerritories'
import { CardTheme, useTheme } from '../lib/theme'
import { ActionCard, PlanActionCard } from '../lib/types'

export function PlanCards({
  cards,
  planAction,
}: {
  cards: (ActionCard | null)[]
  planAction?: PlanActionCard
}) {
  return (
    <div
      style={{
        display: 'flex',
        margin: '1em 0',
        justifyContent: 'space-between',
      }}
    >
      {cards.map((action, index) => (
        <PlanCard
          key={index}
          card={action}
          index={index}
          planAction={planAction}
        />
      ))}
    </div>
  )
}

export function Card(
  props: HTMLAttributes<HTMLDivElement> & { size?: number }
) {
  return (
    <div
      className="card"
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        flex: '0 0 auto',
        marginRight: 10,
        width: props.size || 100,
        height: props.size ? (props.size * 3) / 2 : 150,
        ...useTheme().card,
      }}
      {...props}
    />
  )
}

function PlanCard({
  card,
  index,
  planAction,
}: {
  card: ActionCard | null
  index: number
  planAction?: PlanActionCard
}) {
  const [expanded, setExpanded] = useState(false)
  return (
    <CardTheme selected={!!card}>
      <Card>
        {card && (
          <div
            style={{
              flex: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            Selected: <div>{card.type}</div>
          </div>
        )}

        {planAction &&
          (!card ? (
            <button
              className="btn btn--card"
              onClick={() => setExpanded((e) => !e)}
            >
              Select...
            </button>
          ) : (
            <button
              className="btn btn--card"
              onClick={() => {
                planAction({
                  index,
                  action: null,
                })
                setExpanded((e) => !e)
              }}
            >
              Select...
            </button>
          ))}

        {expanded && planAction && (
          <div
            onClick={() => setExpanded((e) => !e)}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: 'black',
            }}
          >
            {Object.keys(optionTree).map((type) => (
              <button
                key={type}
                className="btn btn--dropdown"
                onClick={() => planAction({ index, action: { type } })}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </Card>
    </CardTheme>
  )
}
