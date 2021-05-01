import { Ctx } from 'boardgame.io'
import { createPlayer, player, uniqFunc } from '../lib/player'
import type {
  GameState,
  InitPlayerOptions,
  PlanActionCardProps,
  Allocation,
} from '../lib/types'

export function initPlayer(G: GameState, ctx: Ctx, options: InitPlayerOptions) {
  if (!ctx.playerID) {
    return console.warn('no player?')
  }
  if (G.players.find((p) => p.id === ctx.playerID)) {
    return console.warn('player already exists')
  }
  G.players = G.players.concat(createPlayer({ ...options, id: ctx.playerID }))
}
export function planAction(G: GameState, ctx: Ctx, plan: PlanActionCardProps) {
  if (!ctx.playerID) {
    return console.warn('no player?')
  }
  const me = G.players.find((p) => p.id === ctx.playerID)
  if (!me) {
    return console.warn('player not found')
  }
  me.cards[plan.index] = plan.action
}
export function confirmPlannedCards(G: GameState, ctx: Ctx) {
  player(G, ctx, (me) => {
    if (me.plannedCardsConfirmed) {
      return console.warn('muster already confirmed')
    }
    me.plannedCardsConfirmed = true
  })
}
export function confirmDice(G: GameState, ctx: Ctx) {
  player(G, ctx, (me) => {
    if (me.diceConfirmed) {
      return console.warn('dice already confirmed')
    }
    me.diceConfirmed = true
  })
}
export function allocateDie(G: GameState, ctx: Ctx, allocation: Allocation) {
  player(G, ctx, (me) => {
    if (!me.allocations) me.allocations = []
    if (allocation.index > -1) me.allocations.unshift(allocation)
    me.allocations = me.allocations.filter(uniqFunc((a) => a.die.index))
  })
}
export function confirmAllocation(G: GameState, ctx: Ctx) {
  player(G, ctx, (me) => {
    if (me.allocationConfirmed) {
      return console.warn('dice already confirmed')
    }
    me.allocationConfirmed = true
  })
}
export function waitForAll(G: GameState, ctx: Ctx) {
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
export function endMusterPhase(G: GameState, ctx: Ctx) {
  // console.log('G.waiting', G.waiting)
  ctx.events?.endPhase?.()
}
