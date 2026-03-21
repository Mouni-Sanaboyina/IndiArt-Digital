import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const CATEGORIES = ['Business Cards', 'Flyers', 'Posters', 'T-Shirts', 'Stickers', 'Invitations'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Business Cards');
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/products?category=${encodeURIComponent(activeCategory)}`)
      .then(({ data }) => setProducts(data.products))
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const deactivate = async (id) => {
    if (!confirm('Deactivate this product? It will no longer appear in the catalog.')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {
      alert('Failed to deactivate product.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="text-[#FFA500] hover:text-[#FF4500] text-sm">← Dashboard</Link>
            <h1 className="text-3xl font-extrabold text-[#FFA500]">Product Catalog</h1>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setActiveCategory(cat); setLoading(true); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeCategory === cat ? 'bg-[#FFA500] text-[#1B1B1B]' : 'border border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500]/20'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#FFA500] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-400 text-center py-8">{error}</p>
        ) : (
          <div className="bg-[#1B1B1B] rounded-2xl overflow-hidden border border-[#FFA500]/20">
            <table className="w-full">
              <thead className="bg-[#003459] text-[#FFA500] text-sm">
                <tr>
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Artist</th>
                  <th className="text-left p-4">Base Price</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {products.map(product => {
                  const image = product.images?.[0];
                  return (
                    <tr key={product._id} className="hover:bg-[#003459]/40 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#003459] rounded-lg overflow-hidden flex-shrink-0">
                            {image ? (
                              <img src={`http://localhost:5000/uploads/${image}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">—</div>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{product.name}</p>
                            <p className="text-gray-500 text-xs line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300 text-sm">{product.category}</td>
                      <td className="p-4 text-gray-400 text-sm">{product.artist}</td>
                      <td className="p-4 text-[#FFA500] font-bold text-sm">
                        from ₹{Math.min(...(product.availableSizes?.length
                          ? product.availableSizes.map(() => 0) // placeholder, real prices need pricingMatrix
                          : [0]))}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => deactivate(product._id)}
                          className="text-red-400 hover:text-red-300 text-xs font-semibold border border-red-400/40 px-3 py-1 rounded-lg transition"
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {products.length === 0 && (
              <p className="text-gray-400 text-center py-12">No products in this category.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;