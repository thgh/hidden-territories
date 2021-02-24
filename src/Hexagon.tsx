import { STONE_WIDTH, STONE_HEIGHT } from './HexGrid'

const stroke = 2
const type = 2 as number
const terrains = ['green', 'blue', '#b96b00']

interface HexagonProps {
  label: string
  terrain?: number
}

export default function Hexagon({ label, terrain, ...rest }: HexagonProps) {
  return (
    <svg
      className="hexagon-svg"
      width={STONE_WIDTH}
      height={STONE_HEIGHT}
      viewBox={[-stroke / 2, -stroke / 2, 174 + stroke, 200 + stroke].join(' ')}
      {...rest}
    >
      <polyline
        stroke={type ? '#0f0' : '#f00'}
        strokeWidth={type ? 0 : stroke}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={terrains[terrain || 0]}
        points="87,0 174,50 174,150 87,200 0,150 0,50 87,0"
      />
      {label && (
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize={300 / label.length}
          fill="#ffffff66"
        >
          {label}
        </text>
      )}
    </svg>
  )
}
