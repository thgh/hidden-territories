import { PersonaConfig, rand } from './HiddenTerritories'

const boxShadow = '0 0 8px rgba(0, 0, 0, .5)'

export default function Persona({ persona: p }: { persona: PersonaConfig }) {
  const eyeball = (
    <div
      style={{
        position: 'absolute',
        left: rand(20, 65) - 15 / p.eyeWidth / 2 + '%',
        top: rand(20, 65) - 15 / p.eyeHeight / 2 + '%',
        width: 15 / p.eyeWidth + '%',
        height: 15 / p.eyeHeight + '%',
        backgroundColor: 'black',
        borderRadius: '50%',
        transition: 'top .3s, left .3s',
      }}
    ></div>
  )
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
        {eyeball}
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
        {eyeball}
      </div>
    </div>
  )
}
