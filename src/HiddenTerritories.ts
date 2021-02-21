import type { Game } from 'boardgame.io'

export interface GameState {
  cells: Cell[]
  players: Player[]
}

export interface Cell {
  x: number
  y: number
}

export interface Player {
  id: string
  inventory: []
  backpack: []
  health: number
  gold: number
  xp: number
}

export const HiddenTerritories: Game = {
  setup: (ctx) => ({
    positions: [],
    cells: [
      { x: 0, y: 0 },
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
      { x: -5, y: 0 },
    ],
    players: Array(ctx.numPlayers)
      .fill(0)
      .map((_, id) => createPlayer(id + '')),
  }),

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
      endIf: (G) => G.deck <= 0,
      next: 'play',
    },
    play: {
      endIf: (G) => G.deck <= 0,
      next: 'final',
    },
    final: {},
  },

  // playerView: PlayerView.STRIP_SECRETS,
}

function createPlayer(id: string) {
  return {
    id,
    inventory: [],
    backpack: [],
    health: 12,
    gold: 0,
    xp: 0,
  }
}
