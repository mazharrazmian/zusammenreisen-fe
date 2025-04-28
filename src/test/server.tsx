// src/test/server.ts
import { setupServer } from 'msw/node'
import {rest}  from 'msw'

export const server = setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json({ id: 1, name: 'John Doe' }))
  })
)
