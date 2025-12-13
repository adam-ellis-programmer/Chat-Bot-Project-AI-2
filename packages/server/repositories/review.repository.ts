import dayjs from 'dayjs'
import { PrismaClient, type Review } from '../generated/prisma/client'
import { prisma } from '../lib/prisma'
// only has the database access code
export const reviewRepository = {
  async getReviews(productId: number, limit?: number): Promise<Review[]> {
    // SELECT * FROM reviews WHERE productId = @productId ORDER BY
    // NO AWAIT :
    // Hover over reviews to see data schema type
    return prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  },

  async storeReviewSummary(productId: number, summary: string) {
    const now = new Date()
    const expiresAt = dayjs().add(7, 'days').toDate()

    const data = {
      content: summary,
      expiresAt,
      generatedAt: now,
      productId,
    }

    // must return the promis
    return prisma.summary.upsert({
      where: { productId },
      create: data,
      update: data,
    })
  },

  // Returns a promise but do not have to use async as returning straight away
  async getReviewSummary(productId: number): Promise<string | null> {
    const summary = await prisma.summary.findFirst({
      where: {
        AND: [
          { productId },
          {
            expiresAt: {
              gt: new Date(), // translates to: Where expiresAt > current Day Time
            },
          },
        ],
      },
    })
    return summary ? summary.content : null
  },
}
