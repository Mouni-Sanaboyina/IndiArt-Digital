import { useEffect, useState } from 'react';
import API from '../api/axios';
import OrderStatusBadge from '../components/OrderStatusBadge';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    API.get('/orders/my')
      .then(({ data }) => setOrders(data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#FFA500] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#FFA500] mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-[#1B1B1B] rounded-2xl border border-[#FFA500]/20 overflow-hidden">
                {/* Header row */}
                <button
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-[#00416A]/30 transition"
                >
                  <div>
                    <p className="text-[#FFA500] font-bold text-lg">{order.orderId}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                      {' · '}{order.items.length} item{order.items.length > 1 ? 's' : ''}
                      {' · '}<span className="text-white font-semibold">₹{order.totalAmount}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-gray-400">{expanded === order._id ? '▲' : '▼'}</span>
                  </div>
                </button>

                {/* Expanded details */}
                {expanded === order._id && (
                  <div className="px-6 pb-6 border-t border-gray-700">

                    {/* Items */}
                    <div className="mt-4 space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-[#003459] rounded-xl p-4">
                          <div>
                            <p className="text-white font-semibold">{item.productName}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              {item.selectedConfig.size} · {item.selectedConfig.paperType} · {item.selectedConfig.finish} · Qty {item.quantity}
                            </p>
                          </div>
                          <p className="text-[#FFA500] font-bold">₹{item.subtotal}</p>
                        </div>
                      ))}
                    </div>

                    {/* Delivery address */}
                    <div className="mt-4 bg-[#003459] rounded-xl p-4">
                      <p className="text-[#FFA500] text-sm font-semibold mb-2">Delivery Address</p>
                      <p className="text-gray-300 text-sm">{order.deliveryDetails.name} · {order.deliveryDetails.phone}</p>
                      <p className="text-gray-400 text-sm">{order.deliveryDetails.address}, {order.deliveryDetails.city} — {order.deliveryDetails.pincode}</p>
                    </div>

                    {/* Admin note on rejection */}
                    {order.status === 'rejected' && order.adminNote && (
                      <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <p className="text-red-400 text-sm font-semibold">Rejection Reason</p>
                        <p className="text-gray-300 text-sm mt-1">{order.adminNote}</p>
                      </div>
                    )}

                    {/* Status history */}
                    <div className="mt-4">
                      <p className="text-[#FFA500] text-sm font-semibold mb-2">Status History</p>
                      <div className="space-y-1">
                        {order.statusHistory.map((s, i) => (
                          <p key={i} className="text-gray-400 text-xs">
                            <span className="capitalize font-semibold text-gray-300">{s.status}</span>
                            {' — '}{new Date(s.changedAt).toLocaleString('en-IN')}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;