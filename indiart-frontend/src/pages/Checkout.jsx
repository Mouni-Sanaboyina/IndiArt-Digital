import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cart, fetchCart, clearCartState } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(true);
  const [placing, setPlacing]   = useState(false);
  const [error, setError]       = useState('');
  const fileInputRef            = useRef(null);

  const [delivery, setDelivery] = useState({
    name: '', phone: '', address: '', city: '', pincode: ''
  });
  const [artworkFile, setArtworkFile]           = useState(null);
  const [customInstructions, setCustomInstructions] = useState('');
  const [filePreview, setFilePreview]           = useState(null);

  useEffect(() => {
    const load = async () => {
      await fetchCart();
      setLoading(false);
    };
    load();
  }, [fetchCart]);

  const handleChange = e => setDelivery({ ...delivery, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArtworkFile(file);
    // Preview for images only
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = ev => setFilePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null); // PDF — no preview, just show filename
    }
  };

  const removeFile = () => {
    setArtworkFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      // Use FormData because we may have a file
      const formData = new FormData();
      formData.append('deliveryDetails', JSON.stringify(delivery));
      formData.append('customInstructions', customInstructions);
      if (artworkFile) formData.append('artworkFile', artworkFile);

      const { data } = await API.post('/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearCartState();
      navigate('/order-confirmation', { state: { orderId: data.orderId } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#FFA500] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const items = cart?.items || [];
  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] py-12 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">

        {/* LEFT — Delivery + Customization */}
        <div className="space-y-6">

          {/* Delivery Details */}
          <div className="bg-[#1B1B1B] rounded-2xl p-7 border border-[#FFA500]/20">
            <h2 className="text-2xl font-extrabold text-[#FFA500] mb-6">Delivery Details</h2>
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              {[
                { name: 'name',    label: 'Full Name',     placeholder: 'Your name' },
                { name: 'phone',   label: 'Phone Number',  placeholder: '+91 00000 00000' },
                { name: 'address', label: 'Address',       placeholder: 'Street, Area' },
                { name: 'city',    label: 'City',          placeholder: 'Hyderabad' },
                { name: 'pincode', label: 'Pincode',       placeholder: '500072' },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="text-[#FFA500] text-sm font-semibold block mb-1">{label}</label>
                  <input
                    name={name} required
                    value={delivery[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full p-3 rounded-lg bg-[#00416A] text-white border border-[#FFA500]/40 focus:outline-none focus:border-[#FFA500] placeholder-gray-500"
                  />
                </div>
              ))}
            </form>
          </div>

          {/* Customization — Artwork Upload */}
          <div className="bg-[#1B1B1B] rounded-2xl p-7 border border-[#FFA500]/20">
            <h2 className="text-2xl font-extrabold text-[#FFA500] mb-2">Your Artwork</h2>
            <p className="text-gray-400 text-sm mb-5">
              Upload your custom design file. We'll print exactly what you send.
              Supported: JPG, PNG, WebP, PDF — max 10MB.
            </p>

            {/* Upload area */}
            {!artworkFile ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#FFA500]/40 hover:border-[#FFA500] rounded-xl p-8 cursor-pointer transition group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition">📁</div>
                <p className="text-[#FFA500] font-semibold">Click to upload your artwork</p>
                <p className="text-gray-500 text-sm mt-1">or drag and drop here</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="border border-[#FFA500]/30 rounded-xl p-4">
                {/* Image preview */}
                {filePreview && (
                  <img src={filePreview} alt="Artwork preview" className="w-full h-48 object-contain rounded-lg mb-3 bg-[#00416A]" />
                )}
                {/* PDF placeholder */}
                {!filePreview && (
                  <div className="w-full h-24 bg-[#00416A] rounded-lg flex items-center justify-center mb-3">
                    <span className="text-3xl">📄</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{artworkFile.name}</p>
                    <p className="text-gray-400 text-xs">{(artworkFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-400 hover:text-red-300 text-sm font-semibold border border-red-400/30 px-3 py-1 rounded-lg transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Custom Instructions */}
            <div className="mt-5">
              <label className="text-[#FFA500] text-sm font-semibold block mb-1">
                Special Instructions <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={customInstructions}
                onChange={e => setCustomInstructions(e.target.value)}
                placeholder="e.g. Use exact colors from the file, add bleed marks, specific font preferences..."
                className="w-full p-3 rounded-lg bg-[#00416A] text-white border border-[#FFA500]/40 focus:outline-none focus:border-[#FFA500] placeholder-gray-500 text-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            form="checkout-form"
            disabled={placing}
            className="w-full bg-[#FFA500] hover:bg-[#FF4500] disabled:bg-gray-600 text-[#1B1B1B] font-extrabold py-4 rounded-xl transition text-lg"
          >
            {placing ? 'Placing Order...' : 'Place Order ✓'}
          </button>
        </div>

        {/* RIGHT — Order Summary */}
        <div className="bg-[#1B1B1B] rounded-2xl p-7 border border-[#FFA500]/20 h-fit">
          <h2 className="text-2xl font-extrabold text-[#FFA500] mb-6">Order Summary</h2>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item._id} className="flex justify-between items-start border-b border-gray-700 pb-4">
                <div>
                  <p className="text-white font-semibold">{item.productName}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {item.selectedConfig.size} · {item.selectedConfig.paperType} · {item.selectedConfig.finish}
                  </p>
                  <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="text-[#FFA500] font-bold">₹{item.subtotal}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#FFA500]/30">
            <span className="text-gray-300 text-lg font-semibold">Total</span>
            <span className="text-[#FFA500] font-extrabold text-2xl">₹{cart.totalAmount}</span>
          </div>

          {/* Artwork uploaded indicator in summary */}
          {artworkFile && (
            <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl p-3 flex items-center gap-2">
              <span className="text-green-400 text-sm">✅</span>
              <p className="text-green-400 text-sm font-semibold">Artwork attached: {artworkFile.name}</p>
            </div>
          )}

          <p className="text-gray-500 text-xs mt-4">
            Payment on delivery. Your order will be reviewed by our team before printing begins.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Checkout;