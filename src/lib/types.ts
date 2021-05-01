import type { State, Ctx } from 'boardgame.io'
import type { EventsAPI } from 'boardgame.io/dist/types/src/plugins/events/events'

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
  executeCard: () => void
  executeMove: (target: Position | null) => void
  search: (type: 'cache' | 'poi' | 'denizen' | 'encounter') => void
  rest: () => void
  stealth: () => void
  parlay: () => void
  engage: () => void
  endSituation: () => void
  endDaytimePhase: () => void

  // Situations
  fight: () => void
  evade: () => void

  travel: (cell: Cell) => void
  allocateDice: () => void
  powerUpDistance: () => void
  rollDice: () => void
  nextCell: () => void
  sneak: () => void
  random: () => void
  interact: () => void
  resolve: () => void
}

export interface GameState {
  vote: null | { [key: string]: number }
  quest: null | Quest

  waiting: string[]

  cells: Cell[]
  players: Player[]
  tokens: Token[]
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

export interface Token {
  title: string
  type: 'encounter' | 'cache' | 'poi' | 'food'
  position?: Position
  shape?: 'round' | 'hex'
  visible?: boolean
  health?: number
  items?: Token[]
}

export interface Player extends Cell {
  id: string
  name: string
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

  //
  blocking: Situation[]
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

export interface Situation {
  type: 'encounter' | 'lost' | 'message'
  title: string
  description: string
  countdown?: number
  denizen?: string
}

// planAction()
export type PlanActionCard = (option: PlanActionCardProps) => void
export interface PlanActionCardProps {
  action: ActionCard | null
  index: number
}

// createPlayer()
export interface InitPlayerOptions {
  persona: PersonaConfig
}

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
