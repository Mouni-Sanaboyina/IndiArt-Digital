import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders')
      .then(({ data }) => setOrders(data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const count = (status) => orders.filter(o => o.status === status).length;
  const revenue = orders
    .filter(o => o.status !== 'rejected')
    .reduce((s, o) => s + o.totalAmount, 0);

  const stats = [
    { label: 'Total Orders', value: orders.length, color: 'text-white', bg: 'bg-[#003459]' },
    { label: 'Pending Review', value: count('pending'), color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Approved', value: count('approved'), color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Rejected', value: count('rejected'), color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Printed', value: count('printed'), color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Est. Revenue', value: `₹${revenue}`, color: 'text-[#FFA500]', bg: 'bg-[#FFA500]/10' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-[#FFA500]">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">IndiArt Digital — Order Management</p>
          </div>
          <Link to="/admin/orders"
            className="bg-[#FFA500] hover:bg-[#FF4500] text-[#1B1B1B] font-bold px-6 py-3 rounded-xl transition">
            Manage Orders →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#FFA500] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {stats.map(({ label, value, color, bg }) => (
                <div key={label} className={`${bg} rounded-2xl p-6 border border-[#FFA500]/20`}>
                  <p className="text-gray-400 text-sm">{label}</p>
                  <p className={`${color} font-extrabold text-3xl mt-2`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Recent pending orders */}
            <div className="bg-[#1B1B1B] rounded-2xl p-6 border border-[#FFA500]/20">
              <h2 className="text-xl font-bold text-[#FFA500] mb-4">Pending Orders</h2>
              {orders.filter(o => o.status === 'pending').length === 0 ? (
                <p className="text-gray-400">No pending orders. All caught up! ✅</p>
              ) : (
                <div className="space-y-3">
                  {orders.filter(o => o.status === 'pending').slice(0, 5).map(order => (
                    <Link key={order._id} to={`/admin/orders/${order._id}`}
                      className="flex justify-between items-center bg-[#003459] rounded-xl p-4 hover:bg-[#00416A] transition">
                      <div>
                        <p className="text-[#FFA500] font-bold">{order.orderId}</p>
                        <p className="text-gray-400 text-sm">{order.userId?.name} · {order.items.length} items</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">₹{order.totalAmount}</p>
                        <p className="text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;