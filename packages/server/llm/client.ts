import OpenAI from 'openai'
import { InferenceClient } from '@huggingface/inference'
const openAiClient = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
})

const inferenceClient = new InferenceClient(process.env.HF_TOKEN)

type GenerateTextOptions = {
  model?: string
  prompt?: string
  instructions?: string
  temperature?: number
  maxTokens?: number
  previousResponseId?: string
}

type GenerateTextResult = {
  id: string
  text: string
}

export const llmClient = {
  async generateText({
    model = 'gpt-4.1',
    prompt,
    instructions,
    temperature = 0.2,
    maxTokens = 300,
    previousResponseId,
  }: GenerateTextOptions): Promise<GenerateTextResult> {
    const response = await openAiClient.responses.create({
      model,
      input: prompt,
      instructions,
      temperature,
      max_output_tokens: maxTokens,
      previous_response_id: previousResponseId,
    })

    return {
      id: response.id,
      text: response.output_text,
    }
  },

  async summarize(text: string) {
    const output = await inferenceClient.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: text,
      provider: 'hf-inference',
    })

    console.log('output', output)

    return output.summary_text
  },
}
