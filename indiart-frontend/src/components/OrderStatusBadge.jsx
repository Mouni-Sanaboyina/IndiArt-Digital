const styles = {
  pending:  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
  approved: 'bg-green-500/20 text-green-400 border border-green-500/40',
  rejected: 'bg-red-500/20 text-red-400 border border-red-500/40',
  printed:  'bg-blue-500/20 text-blue-400 border border-blue-500/40',
};

const icons = {
  pending:  '🟡',
  approved: '🟢',
  rejected: '🔴',
  printed:  '✅',
};

const OrderStatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold capitalize ${styles[status] || styles.pending}`}>
    {icons[status]} {status}
  </span>
);

export default OrderStatusBadge;