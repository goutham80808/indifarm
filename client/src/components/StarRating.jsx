import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, size = "text-sm", showText = false, className = "" }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const getStarColor = (index) => {
    if (index < fullStars) return "text-yellow-400";
    if (index === fullStars && hasHalfStar) return "text-yellow-400";
    return "text-gray-300";
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4.0) return "Very Good";
    if (rating >= 3.5) return "Good";
    if (rating >= 3.0) return "Fair";
    if (rating >= 2.0) return "Poor";
    return "Very Poor";
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`${size} ${getStarColor(index)}`}
          />
        ))}
      </div>
      {showText && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)} ({getRatingText(rating)})
        </span>
      )}
    </div>
  );
};

export default StarRating;
