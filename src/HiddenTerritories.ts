import type { Game } from 'boardgame.io'
import { ActivePlayers } from 'boardgame.io/core'
import type { GameState } from './lib/types'

import { toggleVote, loadQuest } from './moves/prepare'
import {
  initPlayer,
  planAction,
  confirmPlannedCards,
  confirmDice,
  allocateDie,
  confirmAllocation,
  waitForAll,
  endMusterPhase,
} from './moves/muster'
import {
  executeCard,
  executeMove,
  endSituation,
  endDaytimePhase,
} from './moves/daytime'

export const HiddenTerritories: Game = {
  name: 'HiddenTerritories',
  minPlayers: 2,
  maxPlayers: 8,

  setup: () =>
    ({
      vote: null,
      quest: null,

      waiting: [],

      activePlayer: 0,
      players: [],
      cells: [
        { x: 0, y: 0, terrain: 0 },
        { x: 0, y: 1, terrain: 0 },
        { x: 0, y: 2, terrain: 0 },
        { x: 1, y: -1, terrain: 0 },
        { x: 1, y: 0, terrain: 0 },
        { x: 2, y: -1, terrain: 0 },
        { x: 2, y: -2, terrain: 0 },
        { x: 2, y: 0, terrain: 0 },
        { x: 1, y: 1, terrain: 0 },
        { x: 3, y: -2, terrain: 0 },

        { x: -1, y: -1, terrain: 2 },
        { x: -1, y: -2, terrain: 2 },
        { x: -1, y: 0, terrain: 2 },
        { x: -1, y: 1, terrain: 2 },
        { x: -2, y: -1, terrain: 2 },
        { x: -2, y: -2, terrain: 2 },
        { x: -2, y: -3, terrain: 2 },
        { x: -2, y: 0, terrain: 2 },
        { x: -2, y: 1, terrain: 2 },
        { x: -3, y: -2, terrain: 2 },
        { x: -3, y: -3, terrain: 2 },
        { x: 0, y: -1, terrain: 2 },
        { x: 0, y: -2, terrain: 2 },
        { x: 1, y: -2, terrain: 2 },
        { x: 2, y: -3, terrain: 2 },
        { x: 3, y: -3, terrain: 2 },
        // Hex hex
        { x: -3, y: -1, terrain: 1 },
        { x: -3, y: 0, terrain: 1 },
        { x: -4, y: -1, terrain: 1 },
        { x: -4, y: 0, terrain: 1 },
        { x: -4, y: 1, terrain: 1 },
        { x: -5, y: 0, terrain: 1 },
        { x: -5, y: 1, terrain: 1 },
      ],
      positions: [],
    } as GameState),

  endIf() {
    // console.log('endif2')
    // if (victorypoints > 10000)
    // if everyone is dead
    // return
  },

  phases: {
    // Configure quests
    //   - Quest have a center position, players have to gather around it to start
    prepare: {
      start: true,
      moves: {
        toggleVote,
        loadQuest,
      },
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
      next: 'muster',
    },

    // Lay out action cards in front of you
    // and allocate dice to action cards
    muster: {
      moves: {
        initPlayer,
        planAction,
        confirmPlannedCards,
        confirmDice,
        allocateDie,
        confirmAllocation,
        waitForAll,
        endMusterPhase,
      },
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
      next: 'daytime',
    },

    // Card
    daytime: {
      moves: {
        executeCard,
        executeMove,
        endSituation,
        endDaytimePhase,
      },
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
      next: 'play',
    },

    play: {
      next: 'final',

      turn: {
        activePlayers: ActivePlayers.ALL_ONCE,
        endIf(g, ctx) {
          console.log('actives', Object.values(ctx.activePlayers || {}))
          return !Object.values(ctx.activePlayers || {}).filter(
            (s) => s !== 'wait'
          ).length
        },

        stages: {
          planning: {
            moves: {
              // Plan 5 slot
              planSlot() {},
              confirm: (ctx) => {
                if (ctx.lastPlayer) {
                  // start executing the actions
                  // daytime first card of ctx.activePlayer (move, )
                  // daytime second card
                  // ...
                  // daytime first card of next player based on initiative order
                  // daytime second card
                  // ...
                } else {
                  return { next: 'planning_done' }
                }
              },
            },
          },
          planning_done: {
            moves: {},
          },
          advance_time: {
            moves: {
              playActionCard() {}, // on sequencer dashboard
            },
          },
          roll: {
            moves: {
              rollDice() {},
            },
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
          attack: {
            next: 'wait',
          },
          travel: {
            next: 'wait',
            moves: {
              travel(G: GameState, ctx, cell) {
                // console.log('trab', G, ctx)
                const player = G.players.find((p) => p.id === ctx.playerID)
                if (!player) return alert('unexpected player')
                player.x = cell.x
                player.y = cell.y
              },
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
          wait: {
            moves: {
              check() {
                console.log('check')
              },
            },
          },
        },
      },
    },
    final: {},
  },

  // playerView: PlayerView.STRIP_SECRETS,
}

const items = [
  {
    type: 'food',
    name: 'Rabbit',
    health: 1,
    water: 1,
  },
  {
    type: 'food',
    name: 'Berries',
    health: 1,
  },
  {
    type: 'food',
    name: 'Water',
    water: 1,
  },
  {
    type: 'raw',
    name: 'Copper',
    gold: 487,
  },
  {
    type: 'poi',
    name: 'Ruin',
  },
  {
    type: 'cache',
    name: 'Chest',
    items: [
      {
        type: 'raw',
        name: 'Treasure',
      },
      {
        type: 'trap',
        name: 'Pungy stick',
      },
    ],
  },
]

const denizens = [
  {
    type: '?',
    name: 'Goblin',
    xp: 736,
    drops: [
      {
        type: 'raw',
        name: 'Gold',
        gold: 18,
      },
      {
        type: 'weapon',
        name: 'Dagger',
        gold: 18,
      },
    ],
  },
]

// Available in execution stage
const actions = {
  move(position: any, { flying = false, swimming = false }) {
    // move as far as possible to position
    // if (flying) skip over intervening hexes to destination
    // if (swimming) skip over intervening hexes to destination
  },
  follow(player: any) {
    // get as close as possible to player X following the trail
  },
  avoid(player: any) {
    // get as far as possible from player X
  },
  search(types = ['food']) {
    // look for food and water and mana
    // look for anything in the current hex
    // items.filter((i) => i.type === types[0])
  },
  engage(denizenId: any, attack = 'melee') {
    // if (denizen is not in same hex) skip
    // if (attack =melee) opponent can respond
    // if (attack =ranged) opponent can not respond
    // if (attack =spell)
    // player.mana -= 5
    // player.health -= 5
    // if (successful) {
    //   player.items.push(...denizen.drops)
    // }
  },
}

export const optionTree: { [key: string]: string[] } = {
  move: ['walk', 'fly', 'swim', 'follow', 'avoid'],
  search: ['food', 'cache'],
  engage: ['melee', 'ranged', 'spell'],
  attack: [],
  // follow: [],
  // stealth: [],
  // parlay: [],
  // rest: [],
}

// @ts-ignore
if (typeof window !== 'undefined' && window.false) {
  console.log('i', items, denizens, actions, optionTree)
}
