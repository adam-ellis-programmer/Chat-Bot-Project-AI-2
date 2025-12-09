import type { Request, Response } from 'express'
import { chatService } from '../services/chat.service'
import z from 'zod'

// index.ts no need to know what libary we are validating data with
// implementation detail
const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long (max 1000 chars)'),
  conversationId: z.uuid(),
})

// Public interface
export const chatController = {
  async sendMessage(req: Request, res: Response) {
    // returns error if not valid
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
  },
}
