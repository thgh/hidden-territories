import { RolledDie } from '../lib/types'

export function Dice({
  count = 5,
  items,
  draggable = false,
}: {
  count?: number
  items?: RolledDie[]
  draggable?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        margin: -12,
      }}
    >
      {items?.map(({ side, index }) => (
        <Die index={index} side={side} draggable={draggable} key={index} />
      ))}
    </div>
  )
}

export function Die({
  size = 50,
  margin = 12,
  index,
  side = -1,
  draggable = false,
}: {
  size?: number
  margin?: number
  index: number
  side: number
  draggable?: boolean
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={(evt) => {
        evt.dataTransfer.setData('text', JSON.stringify({ index, side }))
        evt.dataTransfer.effectAllowed = 'move'
      }}
      style={{
        fontSize: size / 2,
        width: '2em',
        height: '2em',
        lineHeight: '2em',
        borderRadius: '.2em',
        backgroundColor: 'rgba(255, 255, 255, .2)',
        textAlign: 'center',
        margin,
        cursor: draggable ? 'grab' : '',
      }}
    >
      {side < 0 || side > 6 ? '?' : side}
    </div>
  )
}
