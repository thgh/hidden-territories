import { Ctx } from 'boardgame.io'
import type { GameState, Quest } from '../lib/types'

export function toggleVote(G: GameState, ctx: Ctx, vote: string) {
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

export function loadQuest(G: GameState, ctx: Ctx, quest: Quest) {
  G.quest = quest
  G.cells = quest.cells
}

export function confirmQuest(G: GameState, ctx: Ctx, quest: Quest) {
  ctx.events?.endPhase?.()
}
