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
  confirmPlannedCards: () => void

  // Daytime
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
  plannedCardsConfirmed: boolean
  diceConfirmed: boolean
  allocations: { index: number; die: { side: number; index: number } }[]
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

// planAction()
export type PlanActionCard = (option: PlanActionCardProps) => void
export interface PlanActionCardProps {
  action: ActionCard | null
  index: number
}

// createPlayer()
export interface InitPlayerOptions {}

// rollDice
export interface RolledDie {
  side: number
  index: number
}

// allocate()
export type AllocateDie = (option: any) => void
export interface Allocation {
  die: RolledDie
  index: number
}

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
function confirmPlannedCards(G: GameState, ctx: Ctx) {
  player(G, ctx, (me) => {
    if (me.plannedCardsConfirmed) {
      return console.warn('muster already confirmed')
    }
    me.plannedCardsConfirmed = true
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
function allocateDie(G: GameState, ctx: Ctx, allocation: Allocation) {
  player(G, ctx, (me) => {
    if (!me.allocations) me.allocations = []
    if (allocation.index > -1) me.allocations.unshift(allocation)
    me.allocations = me.allocations.filter(uniqFunc((a) => a.die.index))
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
  G.waiting = G.waiting.concat(ctx.playerID)
}
function endMusterPhase(G: GameState, ctx: Ctx) {
  console.log('G.waiting', G.waiting)
}

// Moves > Daytime

// Helpers

export function createPlayer(player: { id: string } & Partial<Player>) {
  return {
    inventory: [],
    backpack: [],

    // Muster phase (plan)
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
export function roll(count: number) {
  return Array(count)
    .fill(1)
    .map((_, index) => ({ index, side: Math.floor(rand(1, 6)) }))
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
      G.players.map((p) => p.plannedCardsConfirmed)
    )
  }
  return func(me)
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
