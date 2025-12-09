console.log('hello')
import express from 'express'
import type { Request, Response } from 'express'
import dotenv from 'dotenv'

import z from 'zod'
import { chatService } from './services/chat.service'

dotenv.config()

const app = express()
app.use(express.json()) // allows access to req.body
const port = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
  res.send(`Server running (hello world!)`)
})
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({
    message: 'Hello world fro the server!!!!',
  })
})

// lastResponseId = response.id
// map conversation id -> last response id

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long (max 1000 chars)'),
  conversationId: z.uuid(),
})

app.post('/api/chat', async (req: Request, res: Response) => {
  const parseResult = chatSchema.safeParse(req.body)

  if (!parseResult.success) {
    res.status(400).json(z.treeifyError(parseResult.error))
    return
  }

  try {
    const { prompt, conversationId } = req.body
    const response = await chatService.sendMessage(prompt, conversationId)

    res.json({
      message: response.message,
      // conversations: Array.from(conversations.entries()),
    })
  } catch (error) {
    res.status(500).json({ msg: 'Opps something went wrong ' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
