import { Ctx } from 'boardgame.io'
import { Player, PersonaConfig, GameState } from '../lib/types'

export function createPlayer(player: { id: string } & Partial<Player>) {
  return {
    name: randomName(),
    inventory: [],
    backpack: [],

    // Muster phase
    cards: [null, null, null, null, null],
    plannedCardsConfirmed: false,
    dice: [],
    diceConfirmed: false,
    allocations: [],
    allocationConfirmed: false,

    // Daytime phase
    activeCard: -1,
    actionConfirmed: false,
    moveTarget: null,
    moveCount: 0,
    blocking: [],

    // night phase
    // TODO

    health: 12,
    gold: 0,
    xp: 0,
    x: 0,
    y: 0,
    persona: player.persona || createPersona(),
    ...player,
  }
}

export function createPersona(): PersonaConfig {
  return {
    mouthSize: Math.random(),
    mouthHeight: Math.random(),
    eyeVertical: rand(0.2, 0.6),
    eyeHorizontal: rand(0.1, 0.3),
    eyeWidth: rand(0.2, 0.6),
    eyeHeight: rand(0.1, 0.5),
    faceColor: color(),
  }
}

export function randomName() {
  return ['Barbarian', 'Vicky', 'Joseph', 'Alice'][
    Math.floor(Math.random() * 4)
  ]
}

export function color() {
  var h = Math.floor(rand(0, 360))
  var s = Math.floor(rand(42, 98))
  var l = Math.floor(rand(30, 70))
  return `hsl(${h},${s}%,${l}%)`
}
export function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}
export function roll(count: number) {
  return Array(count)
    .fill(1)
    .map((_, index) => ({ index, side: Math.floor(rand(1, 6)) }))
}

export function player(G: GameState, ctx: Ctx, func: (p: Player) => void) {
  if (!ctx.playerID) {
    return console.warn('no player?')
  }
  const me = G.players.find((p) => p.id === ctx.playerID)
  if (!me) {
    return console.warn(
      'player not found',
      G.players.map((p) => p.plannedCardsConfirmed)
    )
  }
  return func(me)
}

export function locate(G: GameState, ctx: Ctx, me: Player) {
  if (!me) throw new Error('player not located')
  return {
    hex: G.cells.find((p) => p.x === me.x && p.y === me.y)!,
    tokens: G.tokens.filter(
      (t) => t.position && t.position.x === me.x && t.position.y === me.y
    )!,
  }
}

// Usage:
// items.filter(uniqBy('id'))
export function uniqBy<T>(prop: keyof T) {
  return (v: T, i: number, a: T[]) =>
    a.findIndex((v2: T) => v[prop] === v2[prop]) === i
}

// Usage:
// items.filter(uniqFunc(a => a.sub.prop))
export function uniqFunc<T>(func: (t: T) => any) {
  return (v: T, i: number, a: T[]) =>
    a.findIndex((v2: T) => func(v) === func(v2)) === i
}
