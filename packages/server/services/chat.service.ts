import OpenAI from 'openai'
import { conversationRepository } from '../repositories/conversation.repository'
const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
})

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
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100, // 100  tokens
      previous_response_id:
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
        message: response.output_text
    }
  },
}
