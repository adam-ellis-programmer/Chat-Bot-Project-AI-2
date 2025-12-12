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
}
