import fs from 'fs'
import path from 'path'

import { conversationRepository } from '../repositories/conversation.repository'
import template from '../prompts/chatbot.txt'
import { llmClient } from '../llm/client'

// this is done once when this module is loaded and then we use once in the api request
// not async (.. up one level)
// prettier-ignore
const parkInfo = fs.readFileSync(path.join(__dirname, '..', 'prompts', 'wonderworld.md'), 'utf-8')

// pass instructions to the model
const instructions = template.replace('{{parkInfo}}', parkInfo)

// Annotate:
type ChatResponse = {
  id: string
  message: string
}

// implimentation detail:
// ============================================================
// - The index.ts file should not know what llm we are using
// - This is so we can swap it out and not change all the code
// ============================================================
//
// export the public interface
// called a leaky abstraction
// prettier-ignore

export const chatService = {
  async sendMessage(prompt: string, conversationId: string): Promise<ChatResponse> {
    const response = await llmClient.generateText({
      model: 'gpt-4o-mini',
       prompt,
      instructions,
      temperature: 0.2,
      maxTokens: 200, // 200  tokens
      previousResponseId:
        conversationRepository.getLastResponseId(conversationId), // last response of the conversation
    })

    console.log({
      conversationId,
      respId: response.id,
    })

    // this module can now easy switch between memory and database
    conversationRepository.setLastResponseId(conversationId, response.id)

    // return has to be platform agnostic -- [ONLY CHANGE HERE]
    return {
        id: response.id,
        message: response.text
    }
  },
}
