import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import OrderStatusBadge from '../../components/OrderStatusBadge';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote]       = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => setError('Order not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    if (status === 'rejected' && !note.trim()) {
      setError('Please enter a rejection reason before rejecting.');
      return;
    }
    setUpdating(true); setError(''); setSuccess('');
    try {
      const { data } = await API.patch(`/orders/${id}/status`, { status, adminNote: note });
      setOrder(data.order);
      setNote('');
      setSuccess(`Order marked as ${status}.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#FFA500] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error && !order) return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] flex items-center justify-center">
      <p className="text-red-400 text-xl">{error}</p>
    </div>
  );

  const artwork = order?.artworkFile;
  const hasArtwork = artwork?.url;
  const isImage = hasArtwork && artwork.fileType?.startsWith('image/');
  const isPDF   = hasArtwork && artwork.fileType === 'application/pdf';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] py-12 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <Link to="/admin/orders" className="text-[#FFA500] hover:text-[#FF4500] transition text-sm">← All Orders</Link>
          <h1 className="text-3xl font-extrabold text-[#FFA500]">Order {order?.orderId}</h1>
          <OrderStatusBadge status={order?.status} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT COLUMN */}
          <div className="space-y-5">

            {/* Customer */}
            <div className="bg-[#1B1B1B] rounded-2xl p-5 border border-[#FFA500]/20">
              <p className="text-[#FFA500] font-semibold mb-3">Customer</p>
              <p className="text-white font-semibold">{order?.userId?.name}</p>
              <p className="text-gray-400 text-sm">{order?.userId?.email}</p>
            </div>

            {/* Delivery */}
            <div className="bg-[#1B1B1B] rounded-2xl p-5 border border-[#FFA500]/20">
              <p className="text-[#FFA500] font-semibold mb-3">Delivery Address</p>
              <p className="text-white">{order?.deliveryDetails?.name}</p>
              <p className="text-gray-400 text-sm">{order?.deliveryDetails?.phone}</p>
              <p className="text-gray-400 text-sm mt-1">
                {order?.deliveryDetails?.address},<br />
                {order?.deliveryDetails?.city} — {order?.deliveryDetails?.pincode}
              </p>
            </div>

            {/* Items */}
            <div className="bg-[#1B1B1B] rounded-2xl p-5 border border-[#FFA500]/20">
              <p className="text-[#FFA500] font-semibold mb-3">Items Ordered</p>
              <div className="space-y-3">
                {order?.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-start py-3 border-b border-gray-700 last:border-0">
                    <div>
                      <p className="text-white font-semibold text-sm">{item.productName}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {item.category} · {item.selectedConfig.size} · {item.selectedConfig.paperType} · {item.selectedConfig.finish}
                      </p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity} × ₹{item.unitPrice}</p>
                    </div>
                    <p className="text-[#FFA500] font-bold">₹{item.subtotal}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 pt-3 border-t border-[#FFA500]/30">
                <span className="text-gray-300 font-semibold">Total</span>
                <span className="text-[#FFA500] font-extrabold text-2xl">₹{order?.totalAmount}</span>
              </div>
            </div>

            {/* Customer Artwork Upload */}
            <div className="bg-[#1B1B1B] rounded-2xl p-5 border border-[#FFA500]/20">
              <p className="text-[#FFA500] font-semibold mb-3">Customer Artwork</p>

              {hasArtwork ? (
                <div>
                  {/* Image preview */}
                  {isImage && (
                    <img
                      src={artwork.url}
                      alt="Customer artwork"
                      className="w-full rounded-xl mb-3 max-h-64 object-contain bg-[#00416A]"
                    />
                  )}
                  {/* PDF */}
                  {isPDF && (
                    <div className="bg-[#00416A] rounded-xl p-4 flex items-center gap-3 mb-3">
                      <span className="text-3xl">📄</span>
                      <div>
                        <p className="text-white font-semibold text-sm">{artwork.originalName}</p>
                        <p className="text-gray-400 text-xs">PDF Document</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-semibold">{artwork.originalName}</p>
                      <p className="text-gray-400 text-xs">{artwork.fileType}</p>
                    </div>
                    <a
                      href={artwork.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#FFA500] hover:bg-[#FF4500] text-[#1B1B1B] text-xs font-bold px-4 py-2 rounded-lg transition"
                    >
                      Download ↗
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-[#00416A]/40 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm">No artwork uploaded by customer.</p>
                  <p className="text-gray-500 text-xs mt-1">Customer will use the selected design template.</p>
                </div>
              )}

              {/* Custom Instructions */}
              {order?.customInstructions && (
                <div className="mt-4 bg-[#003459] rounded-xl p-4">
                  <p className="text-[#FFA500] text-sm font-semibold mb-1">Special Instructions</p>
                  <p className="text-gray-300 text-sm">{order.customInstructions}</p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">

            {/* Pending action */}
            {order?.status === 'pending' && (
              <div className="bg-[#1B1B1B] rounded-2xl p-5 border border-yellow-500/30">
                <p className="text-yellow-400 font-semibold mb-1">⏳ Awaiting Review</p>
                <p className="text-gray-400 text-sm mb-4">Review the order and artwork, then approve or reject.</p>
                <label className="text-[#FFA500] text-sm font-semibold block mb-1">
                  Note <span className="text-gray-500 font-normal">(required if rejecting)</span>
                </label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g. File resolution too low. Please re-upload at 300 DPI."
                  rows={3}
                  className="w-full p-3 rounded-lg bg-[#00416A] text-white border border-[#FFA500]/40 focus:outline-none focus:border-[#FFA500] placeholder-gray-500 text-sm mb-4"
                />
                {error   && <p className="text-red-400 text-sm mb-3">{error}</p>}
                {success && <p className="text-green-400 text-sm mb-3">{success}</p>}
                <div className="flex gap-3">
                  <button onClick={() => updateStatus('approved')} disabled={updating}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition">
                    ✅ Approve
                  </button>
                  <button onClick={() => updateStatus('rejected')} disabled={updating}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition">
                    ❌ Reject
                  </button>
                </div>
              </div>
            )}

            {/* Approved → mark printed */}
            {order?.status === 'approved' && (
              <div className="bg-[#1B1B1B] rounded-2xl p-5 border border-green-500/30">
                <p className="text-green-400 font-semibold mb-1">✅ Order Approved</p>
                <p className="text-gray-400 text-sm mb-4">Mark as printed once the order is dispatched.</p>
                {error   && <p className="text-red-400 text-sm mb-3">{error}</p>}
                {success && <p className="text-green-400 text-sm mb-3">{success}</p>}
                <button onClick={() => updateStatus('printed')} disabled={updating}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition">
                  🖨️ Mark as Printed & Dispatched
                </button>
              </div>
            )}

            {/* Rejection note */}
            {order?.status === 'rejected' && order?.adminNote && (
              <div className="bg-red-500/10 rounded-2xl p-5 border border-red-500/30">
                <p className="text-red-400 font-semibold mb-2">❌ Rejection Note</p>
                <p className="text-gray-300 text-sm">{order.adminNote}</p>
              </div>
            )}

            {/* Printed */}
            {order?.status === 'printed' && (
              <div className="bg-blue-500/10 rounded-2xl p-5 border border-blue-500/30">
                <p className="text-blue-400 font-semibold">✅ Printed & Dispatched</p>
                <p className="text-gray-400 text-sm mt-1">This order has been completed.</p>
              </div>
            )}

            {/* Status history */}
            <div className="bg-[#1B1B1B] rounded-2xl p-5 border border-[#FFA500]/20">
              <p className="text-[#FFA500] font-semibold mb-3">Status History</p>
              <div className="space-y-2">
                {order?.statusHistory?.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#FFA500] flex-shrink-0" />
                    <div>
                      <span className="text-gray-300 text-sm font-semibold capitalize">{s.status}</span>
                      <span className="text-gray-500 text-xs ml-2">
                        {new Date(s.changedAt).toLocaleString('en-IN')}
                      </span>
                      {s.changedBy && s.changedBy !== 'system' && (
                        <span className="text-gray-600 text-xs ml-2">by {s.changedBy}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;