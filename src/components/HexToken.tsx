import { ReactNode } from 'react'
import { STONE_HEIGHT, STONE_WIDTH, toField, Token, useToken } from './HexGrid'

export function HexToken({
  x,
  y,
  children,
  dev,
}: Token & { children: ReactNode; dev?: boolean }) {
  const hexProps = useToken(x, y)

  const { top, left } = toField({ x, y })
  const height = 0

  return (
    <div
      className="hex"
      style={{
        position: 'absolute',
        // top: top - height * 7,
        // left: left,
        zIndex: height + 1,
        width: STONE_WIDTH,
        height: STONE_HEIGHT,
        backgroundColor: dev ? '#ff000055' : '',
        transform: `translate( ${left}px,${top - height * 7}px)`,
        // transition: 'transform .5s',
      }}
      {...hexProps}
    >
      {children}
    </div>
  )
}
