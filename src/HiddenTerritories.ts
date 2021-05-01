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
  endMusterPhase,
} from './moves/muster'
import {
  executeCard,
  executeMove,
  fight,
  evade,
  endSituation,
  endDaytimePhase,
} from './moves/daytime'
import { endNightPhase } from './moves/night'

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
        fight,
        evade,
        endSituation,
        endDaytimePhase,
      },
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
      next: 'night',
    },

    // Rest
    night: {
      moves: {
        endNightPhase,
      },
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
      next: 'muster',
    },

    play: {
      moves: { endNightPhase },
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
      next: 'muster',
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
