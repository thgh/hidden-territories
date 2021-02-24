import serve from 'koa-static'
// @ts-ignore
import rewrite from 'koa-rewrite'

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

server.app.use(rewrite(/^\/game\/.*$/, '/'))

server.app.use(serve('build'))

server.run(PORT, () => {
  console.log(`Serving at: http://localhost:${PORT}/`)
})

// server.app.use()
