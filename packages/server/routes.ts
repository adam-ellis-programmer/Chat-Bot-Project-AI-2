import express, { type Request, type Response } from 'express'
import { chatController } from './controllers/chat.controller'
// select all occurrences shift + cmd + L
// esc twice to escape multi cursor editing

const router = express.Router()
router.get('/', (req: Request, res: Response) => {
  res.send(`Server running (hello world!)`)
})

// test route
router.get('/api/hello', (req: Request, res: Response) => {
  res.json({
    message: 'Hello world fro the server!!!!',
  })
})

// route handler (chat controller)
router.post('/api/chat', chatController.sendMessage)

export default router
