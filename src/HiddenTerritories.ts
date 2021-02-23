import type { Ctx, Game, State } from 'boardgame.io'
import type { EventsAPI } from 'boardgame.io/dist/types/src/plugins/events/events'

export const HiddenTerritories: Game = {
  name: 'HiddenTerritories',

  setup: (ctx) =>
    ({
      players: Array(ctx.numPlayers)
        .fill(0)
        .map((_, id) => createPlayer({ id: id + '', x: id })),
      cells: [
        { x: 1, y: -1 },
        { x: 2, y: -2 },
        { x: 3, y: -3 },
        { x: 4, y: -4 },
        { x: 5, y: -5 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
        { x: 0, y: 4 },
        { x: 0, y: 5 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
        { x: 4, y: 0 },
        { x: 5, y: 0 },
        // Hex hex
        { x: -5, y: 0 },
        { x: -5, y: 1 },
        { x: -4, y: -1 },
        { x: -3, y: -1 },
        { x: -3, y: 0 },
        { x: -4, y: 1 },
      ],
      positions: [],
    } as GameState),

  endIf() {
    console.log('endif2')
  },

  moves: {
    clickCell: (G, ctx, id) => {
      G.cells[id] = ctx.currentPlayer
    },
  },

  phases: {
    build: {
      start: true,
      next: 'play',
    },
    play: {
      endIf: (G) => G.deck <= 0,
      next: 'final',

      turn: {
        stages: {
          advance_time: {
            moves: {
              playActionCard() {}, // on sequencer dashboard
            },
          },
          roll: {
            moves: { rollDice() {} },
          },
          allocate_dice: {
            moves: {
              allocateDice() {}, // allocate from pool to action cards
              powerUpDistance() {}, // from dice pool
            },
          },
          may_get_lost: {
            moves: {
              rollDice: () => ({ next: Math.random() ? 'got_lost' : 'travel' }),
            },
          },
          got_lost: {},
          travel: {
            moves: {
              nextCell() {},
            },
          },
          travel_chits: {
            moves: {
              sneak: () => ({ next: Math.random() ? 'travel' : 'encounter' }),
              evade: () => ({ next: Math.random() ? 'travel' : 'encounter' }),
            },
          },
          arrived: { moves: { interact() {} } },
          encounter: { moves: { fight() {}, resolve() {} } },
          wait: {},
        },
      },
    },
    final: {},
  },

  // playerView: PlayerView.STRIP_SECRETS,
}

export interface GameProps extends State<GameState, Ctx> {
  events: EventsAPI
  // G: GameState
  // moves: Moves
  // ctx: Ctx
  // [key: string]: any
}

export interface Moves {
  playActionCard: () => void
  allocateDice: () => void
  powerUpDistance: () => void
  rollDice: () => void
  nextCell: () => void
  sneak: () => void
  random: () => void
  evade: () => void
  interact: () => void
  fight: () => void
  resolve: () => void
}

export interface GameState {
  positions: Cell[]
  cells: Cell[]
  players: Player[]
}

export interface Cell {
  x: number
  y: number
}

export interface Player extends Cell {
  id: string
  inventory: Item[]
  backpack: Item[]
  persona: PersonaConfig
  health: number
  gold: number
  xp: number
}

export interface Item {
  owner: string
}

export interface PersonaConfig {
  mouthSize: number
  mouthHeight: number
  eyeVertical: number
  eyeWidth: number
  eyeHeight: number
  eyeHorizontal: number
  faceColor: string
}

// Helpers

function createPlayer(player: { id: string } & Partial<Player>) {
  return {
    inventory: [],
    backpack: [],
    health: 12,
    gold: 0,
    xp: 0,
    x: 0,
    y: 0,
    persona: createPersona(),
    ...player,
  }
}

function createPersona(): PersonaConfig {
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

export function color() {
  var h = Math.floor(rand(0, 360))
  var s = Math.floor(rand(42, 98))
  var l = Math.floor(rand(30, 70))
  return `hsl(${h},${s}%,${l}%)`
}
export function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}
