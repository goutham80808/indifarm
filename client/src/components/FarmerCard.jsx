import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaLeaf } from "react-icons/fa";
import StarRating from "./StarRating";

const FarmerCard = ({ farmer }) => {
  return (
    <div className="card transition-transform duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <FaLeaf className="text-green-500 text-2xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{farmer.name}</h3>
            {farmer.address && (
              <div className="flex items-center text-gray-500 text-sm">
                <FaMapMarkerAlt className="mr-1" />
                <span>
                  {farmer.address.city}, {farmer.address.state}
                </span>
              </div>
            )}
            {farmer.averageRating > 0 && (
              <div className="flex items-center mt-2">
                <StarRating rating={farmer.averageRating} size="text-sm" />
                <span className="text-sm text-gray-500 ml-2">
                  ({farmer.totalRatings} reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        <Link
          to={`/farmers/${farmer._id}`}
          className="block w-full bg-green-500 text-white text-center py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          View Farm
        </Link>
      </div>
    </div>
  );
};

export default FarmerCard;
