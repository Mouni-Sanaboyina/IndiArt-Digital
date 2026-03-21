import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Cloudinary returns full https:// URLs — use directly
  // Local dev: filenames only, served from backend /uploads
  const imageUrl = product.images?.[0]
    ? product.images[0].startsWith('http')
      ? product.images[0]
      : `http://localhost:5000/uploads/${product.images[0]}`
    : null;

  return (
    <div className="bg-[#00416A] rounded-2xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl border border-[#FFA500]/20">
      <div className="h-48 bg-[#002B50] flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-500 text-sm">No image</div>
        )}
      </div>
      <div className="p-5">
        <h4 className="text-lg font-semibold text-white">{product.name}</h4>
        <p className="text-gray-300 text-sm mt-1 line-clamp-2">{product.description}</p>
        <p className="text-gray-400 text-xs mt-1">by {product.artist}</p>
        <p className="text-[#FFA500] font-bold mt-3 text-sm">Starting from ₹{getLowestPrice(product)}</p>
        <Link
          to={`/product/${product._id}`}
          className="mt-4 block text-center bg-[#FFA500] hover:bg-[#FF4500] text-[#1B1B1B] font-bold py-2 px-4 rounded-xl transition text-sm"
        >
          View & Order
        </Link>
      </div>
    </div>
  );
};

const getLowestPrice = (product) => {
  if (!product.pricingMatrix) return '—';
  const prices = Object.values(product.pricingMatrix);
  return prices.length ? Math.min(...prices) : '—';
};

export default ProductCard;