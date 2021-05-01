import { Ctx } from 'boardgame.io'
import type { GameState, Quest } from '../lib/types'

export function toggleVote(G: GameState, ctx: Ctx, vote: number) {
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

  ctx.events?.endPhase?.()
}
