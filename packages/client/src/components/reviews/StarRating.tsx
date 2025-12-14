import { FaRegStar, FaStar } from 'react-icons/fa';

type Props = {
  value: number;
};
const StarRating = ({ value }: Props) => {
  const placeHolders = [1, 2, 3, 4, 5];

  // rev.rating (value) = 2
  // iteration = 1 retrun full star
  // iteration = 2 retrun full star
  // iteration = 3 retrun empty star
  // iteration = 4 retrun empty star
  // iteration = 5 retrun empty star
  return (
    // prettier-ignore
    <div className="flex gap-1 text-yellow-500">
      {placeHolders.map((iteration) =>
        iteration <= value ? <FaStar key={iteration} /> : <FaRegStar key={iteration} />
      )}
    </div>
  );
};

export default StarRating;
