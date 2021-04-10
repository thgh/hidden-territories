import { useContext } from 'react'
import { Theme } from '../lib/theme'

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
        ...useContext(Theme).card,
        borderRadius: size,
      }}
    >
      {name}
    </div>
  )
}
