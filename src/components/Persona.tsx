import { rand } from '../lib/player'
import { PersonaConfig } from '../lib/types'

const boxShadow = '0 0 8px rgba(0, 0, 0, .5)'

export default function Persona({ persona: p }: { persona: PersonaConfig }) {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        borderRadius: '50%',
        backgroundColor: p.faceColor,
        height: '100%',
        transform: 'scale(.8, .7)',
        // transform: 'scale(2)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          boxShadow,
          left: p.eyeHorizontal * 50 + 50 + '%',
          top: (p.eyeVertical - p.eyeHeight / 2) * 100 + '%',
          height: p.eyeHeight * 100 + '%',
          width: p.eyeWidth * 100 + '%',
          backgroundColor: 'white',
          borderRadius: '50%',
          overflow: 'hidden',
        }}
      >
        <Eyeball p={p} />
      </div>
      <div
        style={{
          position: 'absolute',
          boxShadow,
          right: p.eyeHorizontal * 50 + 50 + '%',
          top: (p.eyeVertical - p.eyeHeight / 2) * 100 + '%',
          height: p.eyeHeight * 100 + '%',
          width: p.eyeWidth * 100 + '%',
          backgroundColor: 'white',
          borderRadius: '50%',
          overflow: 'hidden',
        }}
      >
        <Eyeball p={p} />
      </div>
    </div>
  )
}

function Eyeball({ p }: { p: PersonaConfig }) {
  const size = rand(10, 20)
  return (
    <div
      style={{
        position: 'absolute',
        left: rand(20, 80) - size / p.eyeWidth / 2 + '%',
        top: rand(20, 80) - size / p.eyeHeight / 2 + '%',
        width: size / p.eyeWidth + '%',
        height: size / p.eyeHeight + '%',
        backgroundColor: 'black',
        borderRadius: '50%',
        transition: 'top .3s, left .3s, width .3s, height .3s',
      }}
    />
  )
}
