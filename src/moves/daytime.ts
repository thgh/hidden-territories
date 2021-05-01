import { Ctx } from 'boardgame.io'
import { player } from '../lib/player'
import type { GameState, Position, Player } from '../lib/types'

export function executeCard(G: GameState, ctx: Ctx) {
  // console.log('G.waiting', G.waiting)

  player(G, ctx, (me) => {
    const card = me.cards[0]
    if (!card) {
      return console.warn('no cards left to execute')
    }
    me.cards = me.cards.slice(1)
    const c = me.cards.length
    me.blocking.unshift({
      type: 'message',
      title:
        c > 1
          ? c + 'cards to go'
          : c === 1
          ? 'Time for your last card!'
          : 'That was your last action card',
      description: '...',
      countdown: 2,
    })
  })
}
export function executeMove(G: GameState, ctx: Ctx, target: Position) {
  player(G, ctx, (me) => {
    const card = me.cards[0]
    if (card?.type !== 'move') {
      return console.warn('no move card!')
    }

    me.cards = me.cards.slice(1)

    if (ctx.random!.Number() > 0.5) {
      return lost(G, ctx, me)
    }

    me.x = target.x
    me.y = target.y
    console.log('executeMove', target)

    const e = ctx.random!.Number()
    if (e > 0.5) {
      return encounter(G, ctx, me)
    }

    return arrived(G, ctx, me)
  })
}
export function lost(G: GameState, ctx: Ctx, player: Player) {
  console.log('lost!', player)
  // Remove all action cards?
  player.blocking.unshift({
    type: 'lost',
    title: 'You are lost',
    description: 'Read page 239',
  })
}
export function encounter(G: GameState, ctx: Ctx, player: Player) {
  console.log('encounter!', player)
  player.blocking.unshift({
    type: 'encounter',
    title: 'You encountered a denizen',
    description: 'Read page 239',
    denizen: '',
  })
}
export function arrived(G: GameState, ctx: Ctx, player: Player) {
  console.log('arrived!')
  player.blocking.unshift({
    type: 'message',
    title: 'You have arrived',
    description: 'Going strong!',
    countdown: 3,
  })
}
export function endSituation(G: GameState, ctx: Ctx) {
  player(G, ctx, (p) => {
    p.blocking = p.blocking.slice(1)
  })
}
export function endDaytimePhase(G: GameState, ctx: Ctx) {
  // console.log('G.waiting', G.waiting)
  ctx.events?.endPhase?.()
}
