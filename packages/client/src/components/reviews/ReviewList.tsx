import StarRating from './StarRating';

import { useQuery, useMutation } from '@tanstack/react-query';
import { IoSparkles } from 'react-icons/io5';
import ReviewSkeleton from './ReviewSkeleton';
import {
  type SummarizeResponse,
  type GetReviewsResponse,
  reviewsApi,
} from './reviewsApi';

type Props = {
  productId: number;
};

/**
 *
 * each product has its own reviews
 * these reviews have to be cached seperatly
 * this is why we add id as the second element in the array
 *
 */

const ReviewList = ({ productId }: Props) => {
  // Only have mutation and query here: We call the api to get
  // the data / AI / API response
  // this module is responsible for the frontend only
  const summaryMutation = useMutation<SummarizeResponse>({
    mutationFn: () => reviewsApi.summarizeReviews(productId),
  });

  const reviewsQuery = useQuery<GetReviewsResponse>({
    queryKey: ['reviews', productId], // unique combination for caching data (how tanstak finds the data in the data cache)
    queryFn: () => reviewsApi.fetchReviews(productId),
  });

  if (reviewsQuery.isLoading) {
    return (
      <div className="flex flex-col gap-20">
        {[1, 2, 3, 4].map((i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (reviewsQuery.error)
    return (
      <p className="text-red-500 text-center">{reviewsQuery.error.message}</p>
    );

  if (!reviewsQuery.data?.reviews.length) {
    return null;
  }

  const currentSummary =
    reviewsQuery.data.summary || summaryMutation.data?.summary;

  return (
    <div>
      <div className="mb-5">
        {currentSummary ? (
          <div>
            <p className=" pb-1 ">Product Summary!</p>
            <p className="border-b pb-1 leading-8 bg-gray-300  p-4 rounded-lg">
              {currentSummary}
            </p>
          </div>
        ) : (
          <div className="">
            <div>
              <button
                disabled={summaryMutation.isPending}
                onClick={() => summaryMutation.mutate()}
                className=" p-2 flex items-center space-x-1  rounded-lg cursor-pointer bg-neutral-900 text-white"
              >
                <IoSparkles className="animate-pulse" />
                <span>Summarize</span>
              </button>
              {summaryMutation.isPending && (
                <div className="py-5">
                  <ReviewSkeleton />
                </div>
              )}
            </div>

            {summaryMutation.error && (
              <p className="text-red-500 mt-4">
                Could not summarize reviews. Try again!
              </p>
            )}
          </div>
        )}
      </div>
      <div>
        {reviewsQuery.data?.reviews.map((review) => {
          return (
            <div
              key={review.id}
              className="flex flex-col gap-5 shadow-lg mb-8 p-8 rounded-2xl border hover:border-red-400"
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
    </div>
  );
};

export default ReviewList;
