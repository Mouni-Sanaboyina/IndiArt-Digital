import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, fetchCart, setCart, setCartCount } = useCart();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // itemId being updated
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      await fetchCart();
      setLoading(false);
    };
    load();
  }, [fetchCart]);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    setUpdating(itemId);
    try {
      const { data } = await API.patch('/cart/update', { itemId, quantity });
      setCart(data.cart);
      setCartCount(data.cart.items.length);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId) => {
    setUpdating(itemId);
    try {
      const { data } = await API.delete(`/cart/remove/${itemId}`);
      setCart(data.cart);
      setCartCount(data.cart.items.length);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#FFA500] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const items = cart?.items || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#FFA500] mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Your cart is empty.</p>
            <Link to="/services" className="mt-6 inline-block bg-[#FFA500] hover:bg-[#FF4500] text-[#1B1B1B] font-bold py-3 px-8 rounded-xl transition">
              Browse Services
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item._id} className="bg-[#1B1B1B] rounded-2xl p-5 flex items-center gap-5 border border-[#FFA500]/20">
                  {/* Image */}
                  <div className="w-20 h-20 bg-[#00416A] rounded-xl overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No img</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <p className="text-white font-semibold text-lg">{item.productName}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {item.selectedConfig.size} · {item.selectedConfig.paperType} · {item.selectedConfig.finish}
                    </p>
                    <p className="text-[#FFA500] font-semibold mt-1">₹{item.unitPrice} each</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={updating === item._id}
                      className="w-8 h-8 bg-[#003459] text-white rounded-lg hover:bg-[#FFA500] hover:text-[#1B1B1B] transition font-bold disabled:opacity-50">−</button>
                    <span className="text-white font-bold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={updating === item._id}
                      className="w-8 h-8 bg-[#003459] text-white rounded-lg hover:bg-[#FFA500] hover:text-[#1B1B1B] transition font-bold disabled:opacity-50">+</button>
                  </div>

                  {/* Subtotal */}
                  <p className="text-white font-extrabold text-lg w-20 text-right">₹{item.subtotal}</p>

                  {/* Remove */}
                  <button onClick={() => removeItem(item._id)}
                    disabled={updating === item._id}
                    className="text-red-400 hover:text-red-300 transition disabled:opacity-50 ml-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 bg-[#1B1B1B] rounded-2xl p-6 border border-[#FFA500]/30">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-lg">Total ({items.length} item{items.length > 1 ? 's' : ''})</span>
                <span className="text-[#FFA500] font-extrabold text-3xl">₹{cart.totalAmount}</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="mt-6 w-full bg-[#FFA500] hover:bg-[#FF4500] text-[#1B1B1B] font-extrabold py-4 rounded-xl transition text-xl"
              >
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;