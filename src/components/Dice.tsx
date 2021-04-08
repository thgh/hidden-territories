export function Dice({
  count = 5,
  items,
  draggable = false,
}: {
  count?: number
  items?: number[]
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
      {(
        items ||
        Array(count)
          .fill(1)
          .map((_, index) => index)
      ).map((side, key) => (
        <Die side={side} draggable={draggable} key={key} />
      ))}
    </div>
  )
}

export function Die({
  side = -1,
  draggable = false,
}: {
  side: number
  draggable?: boolean
}) {
  const x = Math.random()
  return (
    <div
      draggable={draggable}
      style={{
        fontSize: 25,
        width: '2em',
        height: '2em',
        lineHeight: '2em',
        borderRadius: '.2em',
        backgroundColor: 'rgba(255, 255, 255, .2)',
        textAlign: 'center',
        margin: 12,
      }}
    >
      {side === -1 ? x : side}
    </div>
  )
}
