import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { fetchCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Config state
  const [size, setSize]           = useState('');
  const [paperType, setPaperType] = useState('');
  const [finish, setFinish]       = useState('');
  const [quantity, setQuantity]   = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        const p = data.product;
        setProduct(p);
        // Set defaults to first available options
        setSize(p.availableSizes[0]);
        setPaperType(p.availablePaperTypes[0]);
        setFinish(p.availableFinishes[0]);
      } catch {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // Compute live price from pricingMatrix
  const configKey = `${size}-${paperType}-${finish}`;
  const unitPrice = product?.pricingMatrix?.[configKey] || 0;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setAdding(true);
    setError('');
    setSuccess('');
    try {
      await API.post('/cart/add', {
        productId: product._id,
        selectedConfig: { size, paperType, finish },
        quantity,
      });
      await fetchCart(); // update navbar badge
      setSuccess('Added to cart! 🛒');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#FFA500] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error && !product) return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] flex items-center justify-center">
      <p className="text-red-400 text-xl">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] py-12 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">

        {/* Left: Images */}
        <div>
          <div className="bg-[#002B50] rounded-2xl overflow-hidden h-80 flex items-center justify-center">
            {product.images?.length > 0 ? (
              <img
                src={`http://localhost:5000/uploads/${product.images[currentImage]}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-gray-500">No image</p>
            )}
          </div>
          {/* Thumbnail strip */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setCurrentImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${i === currentImage ? 'border-[#FFA500]' : 'border-transparent'}`}>
                  <img src={`http://localhost:5000/uploads/${img}`} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Config + Add to Cart */}
        <div>
          <p className="text-[#FFA500] text-sm font-semibold uppercase tracking-widest">{product.category}</p>
          <h1 className="text-4xl font-extrabold text-white mt-2">{product.name}</h1>
          <p className="text-gray-400 text-sm mt-1">by {product.artist}</p>
          <p className="text-gray-300 mt-4">{product.description}</p>

          {/* Config selectors */}
          <div className="mt-8 space-y-5">
            {/* Size */}
            <div>
              <label className="text-[#FFA500] text-sm font-semibold block mb-2">Size</label>
              <div className="flex gap-3">
                {product.availableSizes.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`px-5 py-2 rounded-lg font-semibold text-sm transition ${size === s ? 'bg-[#FFA500] text-[#1B1B1B]' : 'border border-[#FFA500]/50 text-[#FFA500] hover:bg-[#FFA500]/20'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Paper Type */}
            <div>
              <label className="text-[#FFA500] text-sm font-semibold block mb-2">Paper Type</label>
              <div className="flex gap-3">
                {product.availablePaperTypes.map(p => (
                  <button key={p} onClick={() => setPaperType(p)}
                    className={`px-5 py-2 rounded-lg font-semibold text-sm capitalize transition ${paperType === p ? 'bg-[#FFA500] text-[#1B1B1B]' : 'border border-[#FFA500]/50 text-[#FFA500] hover:bg-[#FFA500]/20'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Finish */}
            <div>
              <label className="text-[#FFA500] text-sm font-semibold block mb-2">Finish</label>
              <div className="flex gap-3">
                {product.availableFinishes.map(f => (
                  <button key={f} onClick={() => setFinish(f)}
                    className={`px-5 py-2 rounded-lg font-semibold text-sm capitalize transition ${finish === f ? 'bg-[#FFA500] text-[#1B1B1B]' : 'border border-[#FFA500]/50 text-[#FFA500] hover:bg-[#FFA500]/20'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-[#FFA500] text-sm font-semibold block mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 bg-[#003459] text-white rounded-lg hover:bg-[#FFA500] hover:text-[#1B1B1B] transition font-bold text-lg">−</button>
                <span className="text-white font-bold text-xl w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  className="w-9 h-9 bg-[#003459] text-white rounded-lg hover:bg-[#FFA500] hover:text-[#1B1B1B] transition font-bold text-lg">+</button>
              </div>
            </div>
          </div>

          {/* Live Price */}
          <div className="mt-6 bg-[#003459] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Unit Price</p>
              <p className="text-[#FFA500] font-bold text-lg">₹{unitPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Total ({quantity} pcs)</p>
              <p className="text-white font-extrabold text-2xl">₹{totalPrice}</p>
            </div>
          </div>

          {success && <p className="text-green-400 font-semibold mt-4">{success}</p>}
          {error && <p className="text-red-400 mt-4">{error}</p>}

          <button
            onClick={handleAddToCart}
            disabled={adding || unitPrice === 0}
            className="mt-6 w-full bg-[#FFA500] hover:bg-[#FF4500] disabled:bg-gray-600 disabled:cursor-not-allowed text-[#1B1B1B] font-extrabold py-4 rounded-xl transition text-lg"
          >
            {adding ? 'Adding...' : isLoggedIn ? 'Add to Cart 🛒' : 'Login to Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;