import { ReactNode, useEffect, useState } from 'react'

import { useGrid } from './HexGrid'

const DEBUG = true

export function HexGridUI({ children }: { children: ReactNode }) {
  const { center } = useGrid()
  const x = -(center.leftMax + center.leftMin) / 2
  const y = -(center.topMax + center.topMin) / 2
  const [width, setWidth] = useState(() => window.innerWidth)
  const [height, setHeight] = useState(() => window.innerHeight)

  useEffect(() => {
    const resize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])
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
