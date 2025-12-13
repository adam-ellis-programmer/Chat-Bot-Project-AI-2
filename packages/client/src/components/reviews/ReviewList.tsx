import axios from 'axios';
import { useState, useEffect } from 'react';
import StarRating from './StarRating';

type Props = {
  productId: number;
};

type Review = {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
};

type GetReviewsResponse = {
  summary: string | null;
  reviews: Review[];
};

const ReviewList = ({ productId }: Props) => {
  const [reviewData, setReviewData] = useState<GetReviewsResponse>();

  const fetchReviews = async () => {
    const { data } = await axios.get<GetReviewsResponse>(
      `/api/products/${productId}/reviews`
    );
    // /api/products/15/reviews
    setReviewData(data);
  };

  useEffect(() => {
    return () => {
      fetchReviews();
    };
  }, []);

  return (
    <div>
      {reviewData?.reviews.map((review, index) => {
        return (
          <div
            key={review.id}
            className="flex flex-col gap-5 shadow-lg mb-8 p-8 rounded-2xl"
          >
            <div className="font-semibold text-rose-500">{review.author}</div>
            <div>
              <StarRating value={review.rating} />
            </div>
            <p className="">{review.content}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
