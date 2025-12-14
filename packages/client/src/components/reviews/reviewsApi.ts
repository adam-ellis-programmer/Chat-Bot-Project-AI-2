import axios from 'axios';

export type Review = {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
};

export type GetReviewsResponse = {
  summary: string | null;
  reviews: Review[];
};

export type SummarizeResponse = {
  summary: string;
};

export const reviewsApi = {
  // --> axios returns a promise so we return straight away and use .then()
  fetchReviews(productId: number) {
    return axios
      .get<GetReviewsResponse>(`/api/products/${productId}/reviews`)
      .then((res) => res.data);
  },

  // No need for await returned result straight back to callback
  summarizeReviews(productId: number) {
    return axios
      .post<SummarizeResponse>(`/api/products/${productId}/reviews/summarize`)
      .then((res) => res.data);
  },
};
