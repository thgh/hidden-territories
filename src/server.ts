import 'dotenv/config'
import serve from 'koa-static'
// @ts-ignore
import rewrite from 'koa-rewrite'
import { selectAll } from '@bothrs/util/airtable-env'

import { Server, FlatFile } from 'boardgame.io/server'
import { HiddenTerritories } from './HiddenTerritories'

const PORT = parseInt(process.env.PORT || '8000', 10)
const server = Server({
  games: [HiddenTerritories],
  db: new FlatFile({
    dir: './storage',
    // logging: true,
    // ttl: (optional, see node-persist docs),
  }),
})

server.app.use(async (ctx, next) => {
  if (ctx.url === '/api/terrains') {
    const terrains = await selectAll('Terrains', {
      // @ts-ignore
      'fields[0]': 'name',
      'fields[1]': 'id',
      'fields[2]': 'color',
    })
    ctx.body = terrains
      .map(({ name, id, color }) => ({
        name,
        id,
        color,
      }))
      .sort((a, b) => a.id - b.id)
  }
  if (ctx.url === '/api/cells') {
    const cells = await selectAll('Cells', {
      // @ts-ignore
      'fields[]': 'hex',
      'fields[1]': 'webHex',
      'fields[2]': 't',
    })
    ctx.body = cells
      .filter((c) => c.webHex)
      .map(({ webHex, hex, t }) => ({
        hex,
        x: ((webHex - 1) % 25) - Math.floor((webHex - 1) / 50),
        y: Math.floor((webHex - 1) / 25),
        t: parseInt(t),
      }))
  }
  return next()
})

server.app.use(rewrite(/^\/game\/.*$/, '/'))

server.app.use(serve('build'))

server.run(PORT, () => {
  console.log(`Serving at: http://localhost:${PORT}/`)
})

// server.app.use()
