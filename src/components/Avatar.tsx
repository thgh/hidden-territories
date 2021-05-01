import { useTheme } from '../lib/theme'
import { Player } from '../lib/types'

export function Avatar({
  size = 50,
  margin = 0,
  name = '?',
}: {
  size?: number
  margin?: number
  name?: string
}) {
  return (
    <div
      style={{
        fontSize: size / (name.length || 1),
        width: size,
        height: size,
        lineHeight: size + 'px',
        textAlign: 'center',
        margin,
        ...useTheme().card,
        borderRadius: size,
      }}
    >
      {name}
    </div>
  )
}

export function PlayerStatus({
  player,
  label,
}: {
  player: Player
  label: string
}) {
  const theme = useTheme()
  return (
    <div>
      <Avatar name={player.name || player.id + ''} size={120} margin={20} />
      <div style={{ textAlign: 'center', color: theme.card.color }}>
        {label || 'Waiting...'}
      </div>
    </div>
  )
}

export function PlayerMusterStatus({ player }: { player: Player }) {
  const theme = useTheme()
  return (
    <div>
      <Avatar name={player.name || player.id + ''} size={120} margin={20} />
      <div style={{ textAlign: 'center', color: theme.card.color }}>
        {!player.plannedCardsConfirmed
          ? 'Planning action cards'
          : !player.diceConfirmed
          ? 'Rolling dice'
          : !player.allocationConfirmed
          ? 'Allocating dice'
          : 'Waiting...'}
      </div>
    </div>
  )
}
