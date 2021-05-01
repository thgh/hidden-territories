import { ReactNode } from 'react'

export default function Modal({
  children,
  overflow,
  padding = false,
  row = false,
}: {
  children: ReactNode
  overflow?: 'auto'
  padding?: boolean
  row?: boolean
}) {
  return (
    <div className="modal">
      <div
        className="modal-body"
        style={{
          maxWidth: 600,
          margin: 'auto',
          padding: padding ? 24 : 0,
          overflow: overflow,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          // overflow: 'hidden',
          fontSize: 14,
          ...(row && {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }),
        }}
      >
        {children}
      </div>
    </div>
  )
}
