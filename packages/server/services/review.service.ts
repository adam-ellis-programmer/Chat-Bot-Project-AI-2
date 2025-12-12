import { type Review } from '../generated/prisma/client'
import { llmClient } from '../llm/client'
import { reviewRepository } from '../repositories/review.repository'

// controller asks the service
// the service asks the repository
// service acts as a pass through

export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    // ask repository to give us our reviews
    return reviewRepository.getReviews(productId)
  },

  // Returns a promise with a string of text
  async summarizeReviews(productId: number): Promise<string> {
    // Get the last 10 reviews (Better reflect accurate review and not expensive call)
    const reviews = await reviewRepository.getReviews(productId, 10)
    // Join one long string to send to the model
    const joinedReviews = reviews.map((r) => r.content).join('\n\n')
    const summary = 'This is a placeholder summary'
    // Send to LLM for summarize

    const prompt = `
    Summarize the following customer reviews into a short paragraph
    hightlighting key themes, both positive and negative:
    ${joinedReviews}`

    // no need to await (just return the promise)
    const response = await llmClient.generateText({
      model: 'gpt-4.1',
      prompt,
      temperature: 0.2, // not creative but deterministic
      maxTokens: 500,
    })

    return response.text
  },
}
