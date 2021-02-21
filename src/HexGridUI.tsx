import React, { ReactNode, useMemo } from 'react'

import { STONE_HEIGHT, useGrid } from './HexGrid'

const DEBUG = true

export function HexGridUI({ children }: { children: ReactNode }) {
  const { center } = useGrid()
  const x = -(center.leftMax + center.leftMin) / 2
  const y = -(center.topMax + center.topMin) / 2

  const width = useMemo(() => window.innerWidth, [])
  const height = useMemo(() => window.innerHeight * 0.96 - STONE_HEIGHT, [])
  const zoom = Math.min(1.5, width / center.width, height / center.height)

  return (
    <div
      className="field"
      style={{
        position: 'absolute',
        left: '50%',
        width: '50%',
        top: '50%',
        height: '50%',
      }}
    >
      <div
        className="field-inner"
        style={{
          backgroundColor: '#0000FF22',
          height: '100%',
          width: '100%',
          transform: `scale(${zoom}) translateX(${x}px) translateY(${y}px)`,
          transformOrigin: '0 0',
        }}
      >
        {children}
        {DEBUG && (
          <div
            className="actual"
            style={{
              top: center.topMin,
              left: center.leftMin,
              width: center.width,
              height: center.height,
            }}
          ></div>
        )}
      </div>
    </div>
  )
}
