import { useLocation, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || '—';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] flex items-center justify-center px-4">
      <div className="bg-[#1B1B1B] rounded-2xl shadow-2xl p-10 w-full max-w-lg text-center border border-[#FFA500]/30">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-extrabold text-[#FFA500]">Order Placed!</h1>
        <p className="text-gray-300 mt-3">
          Your order has been received and is pending review by our team.
        </p>

        <div className="mt-6 bg-[#003459] rounded-xl p-5">
          <p className="text-gray-400 text-sm">Your Order ID</p>
          <p className="text-[#FFA500] font-extrabold text-2xl mt-1">{orderId}</p>
        </div>

        <div className="mt-6 bg-[#003459] rounded-xl p-5 text-left space-y-2">
          <p className="text-gray-300 text-sm">📋 <span className="text-yellow-400 font-semibold">Pending</span> — Under review</p>
          <p className="text-gray-300 text-sm">✅ <span className="text-green-400 font-semibold">Approved</span> — Print job queued</p>
          <p className="text-gray-300 text-sm">🖨️ <span className="text-blue-400 font-semibold">Printed</span> — Dispatched to you</p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link to="/my-orders"
            className="w-full bg-[#FFA500] hover:bg-[#FF4500] text-[#1B1B1B] font-extrabold py-3 rounded-xl transition">
            Track My Order
          </Link>
          <Link to="/services"
            className="w-full border border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500] hover:text-[#1B1B1B] font-bold py-3 rounded-xl transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;