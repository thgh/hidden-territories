import type { Ctx, Game, State } from 'boardgame.io'
import { ActivePlayers } from 'boardgame.io/core'
import type { EventsAPI } from 'boardgame.io/dist/types/src/plugins/events/events'

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
      next: 'plan',
    },

    // Lay out cards in front of you
    plan: {
      moves: {
        initPlayer,
        planAction,
        confirmMuster,
        confirmDice,
        allocateDie,
        confirmAllocation,
        waitForAll,
      },
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
      next: 'execute',
    },

    // Card
    execute: {
      moves: {
        executeCard() {},
        done() {},
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
                  // execute first card of ctx.activePlayer (move, )
                  // execute second card
                  // ...
                  // execute first card of next player based on initiative order
                  // execute second card
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

export interface GameProps extends State<GameState, Ctx> {
  playerID: any
  events: EventsAPI
  isActive: boolean
  isMultiplayer: boolean
  // G: GameState
  moves: Record<string, any>
  // ctx: Ctx
  // [key: string]: any
}

export interface Moves {
  // Prepare
  toggleVote: (option: number) => void
  loadQuest: (quest: Quest) => void

  // Plan
  planAction: PlanActionCard
  initPlayer: (options: InitPlayerOptions) => void
  confirmMuster: () => void

  // Execute
  travel: (cell: Cell) => void
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
  vote: null | { [key: string]: number }
  quest: null | Quest

  waiting: string[]

  positions: Cell[]
  cells: Cell[]
  players: Player[]
}

export interface Quest {
  id: string
}

export interface Cell extends Position {
  terrain?: number
}

export interface Position {
  x: number
  y: number
}

export interface Player extends Cell {
  id: string
  // split in spellbook (spells)
  // split in journal (lore)
  // split in backpack (raw)
  // split in spellbook (spells)
  inventory: Item[]
  persona: PersonaConfig
  health: number
  gold: number
  xp: number

  // Muster phase
  cards: (ActionCard | null)[]
  musterConfirmed: boolean
  diceConfirmed: boolean
  allocationConfirmed: boolean

  // Daytime phase
  activeCard: number
  actionConfirmed: boolean
  moveTarget: Cell | null
  moveCount: number
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

export interface ActionCard {
  type: string
  modifier?: string
}

export type PlanActionCard = (option: PlanActionCardProps) => void

export interface PlanActionCardProps {
  action: ActionCard | null
  index: number
}

export interface InitPlayerOptions {}

export type AllocateDie = (option: any) => void

// Moves

// Moves > Prepare

function toggleVote(G: GameState, ctx: Ctx, vote: number) {
  if (!ctx.playerID) {
    return console.log('cannot vote', vote)
  }
  if (!G.vote) {
    G.vote = {}
  }
  if (G.vote[ctx.playerID] === vote) {
    delete G.vote[ctx.playerID]
  } else {
    G.vote[ctx.playerID] = vote
  }
}
function loadQuest(G: GameState, ctx: Ctx, quest: Quest) {
  G.quest = quest

  ctx.events?.endPhase?.()
}

// Moves > Muster (Plan)

function initPlayer(G: GameState, ctx: Ctx, options: InitPlayerOptions) {
  if (!ctx.playerID) {
    return console.warn('no player?')
  }
  if (G.players.find((p) => p.id === ctx.playerID)) {
    return console.warn('player already exists')
  }
  G.players = inert(
    G.players.concat(createPlayer({ ...options, id: ctx.playerID }))
  )
}
function planAction(G: GameState, ctx: Ctx, plan: PlanActionCardProps) {
  if (!ctx.playerID) {
    return console.warn('no player?')
  }
  const me = G.players.find((p) => p.id === ctx.playerID)
  if (!me) {
    return console.warn('player not found')
  }
  me.cards[plan.index] = plan.action
}
function confirmMuster(G: GameState, ctx: Ctx) {
  player(G, ctx, (me) => {
    if (me.musterConfirmed) {
      return console.warn('muster already confirmed')
    }
    me.musterConfirmed = true
  })
}
function confirmDice(G: GameState, ctx: Ctx) {
  player(G, ctx, (me) => {
    if (me.diceConfirmed) {
      return console.warn('dice already confirmed')
    }
    me.diceConfirmed = true
  })
}
function allocateDie(G: GameState, ctx: Ctx) {
  player(G, ctx, (me) => {
    console.error('todo')
  })
}
function confirmAllocation(G: GameState, ctx: Ctx) {
  player(G, ctx, (me) => {
    if (me.allocationConfirmed) {
      return console.warn('dice already confirmed')
    }
    me.allocationConfirmed = true
  })
}
function waitForAll(G: GameState, ctx: Ctx) {
  if (!ctx.playerID) {
    return console.warn('no player?')
  }
  if (G.waiting.includes(ctx.playerID)) {
    return console.warn('already waiting...')
  }

  if (G.waiting.length + 1 >= G.players.length) {
    console.log(
      'everyone is waiting, lets go to next phase',
      G.waiting.length,
      G.players.length
    )
    ctx.events?.endPhase?.()
    return
  }

  console.log('letswait', G.waiting.concat(ctx.playerID))
  G.waiting = inert(G.waiting.concat(ctx.playerID))
}

// Moves > Execute

// Helpers

export function createPlayer(player: { id: string } & Partial<Player>) {
  return {
    inventory: [],
    backpack: [],
    cards: [null, null, null, null, null],

    // Muster phase (plan)
    musterConfirmed: false,
    diceConfirmed: false,
    allocationConfirmed: false,

    // Daytime phase
    activeCard: -1,
    actionConfirmed: false,
    moveTarget: null,
    moveCount: 0,

    health: 12,
    gold: 0,
    xp: 0,
    x: 0,
    y: 0,
    persona: createPersona(),
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

export function color() {
  var h = Math.floor(rand(0, 360))
  var s = Math.floor(rand(42, 98))
  var l = Math.floor(rand(30, 70))
  return `hsl(${h},${s}%,${l}%)`
}
export function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function inert(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

function player(G: GameState, ctx: Ctx, func: (p: Player) => void) {
  if (!ctx.playerID) {
    return console.warn('no player?')
  }
  const me = G.players.find((p) => p.id === ctx.playerID)
  if (!me) {
    return console.warn(
      'player not found',
      G.players.map((p) => p.musterConfirmed)
    )
  }
  return func(me)
}
