import { Link } from "react-router-dom";
import { placeholder } from "../assets";
import { getValidImage } from "../utils/imageUtils";
import StarRating from "./StarRating";

const ProductCard = ({ product }) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  const validImage = getValidImage(product.images, placeholder);

  return (
    <div className="card transition-transform duration-300">
      <Link to={`/products/${product._id}`} className="relative h-48 overflow-hidden rounded-t-xl block">
        <img
          src={validImage}
          alt={product.name}
          onError={handleImageError}
          className="w-full h-56 object-cover cursor-pointer"
        />
        {product.isOrganic && (
          <span className="absolute top-2 right-2 badge badge-green">
            Organic
          </span>
        )}
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2">
          {product.category?.name || "General"}
        </p>
        {product.farmer && product.farmer.averageRating > 0 && (
          <div className="flex items-center mb-2">
            <StarRating rating={product.farmer.averageRating} size="text-xs" />
            <span className="text-xs text-gray-500 ml-2">
              ({product.farmer.totalRatings})
            </span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-green-600 font-bold">
            ₨{product.price.toFixed(2)} / {product.unit}
          </span>
          <Link
            to={`/products/${product._id}`}
            className="text-sm text-green-500 hover:text-green-700 font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
