import { ReactNode } from 'react'
import { STONE_HEIGHT, STONE_WIDTH, toField, Token, useToken } from './HexGrid'

export function HexToken({ x, y, children }: Token & { children: ReactNode }) {
  useToken(x, y)

  const { top, left } = toField({ x, y })
  const height = 0

  return (
    <div
      style={{
        position: 'absolute',
        top: top - height * 7,
        left: left,
        zIndex: height + 1,
        width: STONE_WIDTH,
        height: STONE_HEIGHT,
        backgroundColor: 'red',
      }}
    >
      {children}
    </div>
  )
}
