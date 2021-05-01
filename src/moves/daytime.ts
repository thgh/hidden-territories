import { Ctx } from 'boardgame.io'
import { player } from '../lib/player'
import type { GameState, Position, Player, Situation } from '../lib/types'

// Actions > general

export function executeCard(G: GameState, ctx: Ctx) {
  player(G, ctx, (me) => {
    const card = me.cards.find(Boolean)
    if (!card) {
      return console.warn('no cards left to execute')
    }
    me.cards = me.cards.slice(1)
    const c = me.cards.filter(Boolean).length
    me.blocking.unshift({
      type: 'message',
      title:
        c > 1
          ? c + ' cards to go'
          : c === 1
          ? 'Time for your last card!'
          : 'That was your last action card',
      description: '...',
    })
  })
}

// Actions > move

export function executeMove(G: GameState, ctx: Ctx, target: Position | null) {
  player(G, ctx, (me) => {
    const card = me.cards.find(Boolean)
    if (card?.type !== 'move') {
      return console.warn('no move card!')
    }

    if (!target) {
      me.cards = me.cards.slice(1)
      return
    }

    if (ctx.random!.Number() > 0.5) {
      me.cards = me.cards.slice(1)
      resolve(G, ctx, {
        title: 'You are lost',
        description: 'Read page 239',
      })
      return
    }

    me.x = target.x
    me.y = target.y

    const e = ctx.random!.Number()
    if (e > 0.5) {
      return move_encounter(G, ctx, me)
    }

    return move_arrived(G, ctx, me)
  })
  endDaytimePhaseCheck(G, ctx)
}

export function move_encounter(G: GameState, ctx: Ctx, player: Player) {
  console.log('encounter!', player)
  player.blocking.unshift({
    type: 'encounter',
    title: 'You encountered a denizen',
    description: 'Read page 239',
    denizen: '',
  })
}

export function move_arrived(G: GameState, ctx: Ctx, player: Player) {
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
  endDaytimePhaseCheck(G, ctx)
}

// Resolve situations

export function fight(G: GameState, ctx: Ctx) {
  if (ctx.random!.Number() > 0.5) {
    resolve(G, ctx, {
      title: 'You slayed the monster',
    })
  } else {
    resolve(G, ctx, {
      title: 'You were hit by the denizen',
      description: 'Aww, this hurts',
    })
  }
}

export function evade(G: GameState, ctx: Ctx) {
  if (ctx.random!.Number() > 0.5) {
    resolve(G, ctx, {
      title: 'You evaded successfully',
    })
  } else {
    resolve(G, ctx, {
      title: 'Nope, failed to evade',
      description: 'Aww, this hurts',
    })
  }
}

// Actions > Search

export function search(G: GameState, ctx: Ctx, type: string) {
  nextActionCard(G, ctx)
  const here = locate(G, ctx)

  const poi = here.tokens.find((t) => t.type === 'poi')
  if (poi) {
    return resolve(G, ctx, {
      title: 'You found a poi',
    })
  }

  const cache = here.tokens.find((t) => t.type === 'cache')
  if (cache) {
    return resolve(G, ctx, {
      title: 'You found a cache',
    })
  }

  const enc = here.tokens.find((t) => t.type === 'encounter')
  if (enc) {
    player(G, ctx, (me) => {
      move_encounter(G, ctx, me)
    })
    return
  }

  if (ctx.random!.Number() > 0.5) {
    resolve(G, ctx, {
      title: 'You searched successfully',
    })
  } else {
    resolve(G, ctx, {
      title: 'Nope, you found nothing',
    })
  }
}

// Actions >

export function engage(G: GameState, ctx: Ctx) {
  nextActionCard(G, ctx)
  if (ctx.random!.Number() > 0.5) {
    resolve(G, ctx, {
      title: 'You engaged successfully',
    })
  } else {
    resolve(G, ctx, {
      title: 'Nope, you failed to engage',
    })
  }
}

// Actions > Rest

export function rest(G: GameState, ctx: Ctx) {
  nextActionCard(G, ctx)
  if (ctx.random!.Number() > 0.5) {
    resolve(G, ctx, {
      title: 'You rested successfully',
    })
  } else {
    resolve(G, ctx, {
      title: 'Nope, you failed to rest',
    })
  }
}

// Actions >

export function stealth(G: GameState, ctx: Ctx) {
  nextActionCard(G, ctx)
  if (ctx.random!.Number() > 0.5) {
    resolve(G, ctx, {
      title: 'You hid successfully',
    })
  } else {
    resolve(G, ctx, {
      title: 'You were found by the monster!',
    })
  }
}

// Actions >

export function parlay(G: GameState, ctx: Ctx) {
  nextActionCard(G, ctx)
  if (ctx.random!.Number() > 0.5) {
    resolve(G, ctx, {
      title: 'You parlayed successfully',
      description: 'You now have a friend',
    })
  } else {
    resolve(G, ctx, {
      title: 'Nope, you failed to parlay',
      description: 'Your parlay resulted in an angry monster',
    })
  }
}

// Done

export function endDaytimePhaseCheck(G: GameState, ctx: Ctx) {
  const busy = G.players.find(
    (p) => p.cards.filter(Boolean).length || p.blocking.length
  )
  if (!busy) {
    endDaytimePhase(G, ctx)
  }
}

export function endDaytimePhase(G: GameState, ctx: Ctx) {
  G.players.forEach((p) => {
    Object.assign(p, {
      activeCard: -1,
      actionConfirmed: false,
      moveTarget: null,
      moveCount: 0,

      // Muster prep
      cards: [null, null, null, null, null],
      dice: [],
      allocations: [],
    })
    p.blocking = []
  })
  ctx.events?.endPhase?.()
}

// Helpers

function resolve(G: GameState, ctx: Ctx, resolution: Partial<Situation>) {
  player(G, ctx, (me) => {
    me.blocking[0] = {
      type: 'message',
      title: 'Situation resolved',
      description: 'TODO: explain',
      ...resolution,
    }
  })
}

function nextActionCard(G: GameState, ctx: Ctx) {
  player(G, ctx, (me) => {
    me.cards = me.cards.slice(1)
  })
}

function locate(G: GameState, ctx: Ctx) {
  const me = G.players.find((p) => p.id === ctx.playerID)
  if (!me) throw new Error('player not located')
  return {
    hex: G.cells.find((p) => p.x === me.x && p.y === me.y)!,
    tokens: G.tokens.filter(
      (t) => t.position && t.position.x === me.x && t.position.y === me.y
    )!,
  }
}
