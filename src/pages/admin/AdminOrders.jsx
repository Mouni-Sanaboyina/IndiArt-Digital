import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import OrderStatusBadge from '../../components/OrderStatusBadge';

const STATUSES = ['all', 'pending', 'approved', 'rejected', 'printed'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders')
      .then(({ data }) => {
        setOrders(data.orders);
        setFiltered(data.orders);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const applyFilter = (status) => {
    setActiveFilter(status);
    setFiltered(status === 'all' ? orders : orders.filter(o => o.status === status));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/dashboard" className="text-[#FFA500] hover:text-[#FF4500] transition">← Dashboard</Link>
          <h1 className="text-4xl font-extrabold text-[#FFA500]">All Orders</h1>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {STATUSES.map(s => (
            <button key={s} onClick={() => applyFilter(s)}
              className={`px-5 py-2 rounded-full font-semibold text-sm capitalize transition ${
                activeFilter === s ? 'bg-[#FFA500] text-[#1B1B1B]' : 'border border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500]/20'
              }`}>
              {s} {s === 'all' ? `(${orders.length})` : `(${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#FFA500] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No orders found.</p>
        ) : (
          <div className="bg-[#1B1B1B] rounded-2xl overflow-hidden border border-[#FFA500]/20">
            <table className="w-full">
              <thead className="bg-[#003459] text-[#FFA500] text-sm">
                <tr>
                  <th className="text-left p-4">Order ID</th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Items</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map(order => (
                  <tr key={order._id} className="hover:bg-[#003459]/40 transition">
                    <td className="p-4 text-[#FFA500] font-bold">{order.orderId}</td>
                    <td className="p-4">
                      <p className="text-white text-sm">{order.userId?.name || '—'}</p>
                      <p className="text-gray-500 text-xs">{order.userId?.email}</p>
                    </td>
                    <td className="p-4 text-gray-300 text-sm">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                    <td className="p-4 text-white font-bold">₹{order.totalAmount}</td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                    </td>
                    <td className="p-4"><OrderStatusBadge status={order.status} /></td>
                    <td className="p-4">
                      <Link to={`/admin/orders/${order._id}`}
                        className="bg-[#FFA500] hover:bg-[#FF4500] text-[#1B1B1B] text-xs font-bold px-3 py-2 rounded-lg transition">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;