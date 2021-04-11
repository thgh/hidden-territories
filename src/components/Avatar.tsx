import { Player } from '../HiddenTerritories'
import { useTheme } from '../lib/theme'

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
        fontSize: size / 2,
        width: '2em',
        height: '2em',
        lineHeight: '2em',
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

export function PlayerMusterStatus({ player }: { player: Player }) {
  const theme = useTheme()
  return (
    <div>
      <Avatar name={player.id + ''} size={120} margin={20} />
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
