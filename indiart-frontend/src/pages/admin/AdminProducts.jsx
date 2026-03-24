import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const CATEGORIES = ['Business Cards', 'Flyers', 'Posters', 'T-Shirts', 'Stickers', 'Invitations'];
const SIZES = ['A4', 'A3', 'A2'];
const PAPER_TYPES = ['matte', 'glossy'];
const FINISHES = ['standard', 'premium'];

const buildPricingMatrix = (base) => {
  const sizeMultiplier  = { A4: 1, A3: 1.6, A2: 2.4 };
  const paperMultiplier = { matte: 1, glossy: 1.15 };
  const finishMultiplier = { standard: 1, premium: 1.3 };
  const matrix = {};
  for (const s of SIZES) {
    for (const p of PAPER_TYPES) {
      for (const f of FINISHES) {
        matrix[`${s}-${p}-${f}`] = Math.round(base * sizeMultiplier[s] * paperMultiplier[p] * finishMultiplier[f]);
      }
    }
  }
  return matrix;
};

const emptyForm = {
  name: '', category: 'Business Cards', description: '', artist: 'IndiArt Studio',
  basePrice: '', availableSizes: ['A4', 'A3'], availablePaperTypes: ['matte', 'glossy'],
  availableFinishes: ['standard', 'premium'], images: [],
};

const AdminProducts = () => {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeCategory, setActiveCategory] = useState('Business Cards');
  const [error, setError]               = useState('');
  const [showForm, setShowForm]         = useState(false);
  const [form, setForm]                 = useState(emptyForm);
  const [submitting, setSubmitting]     = useState(false);
  const [successMsg, setSuccessMsg]     = useState('');

  const fetchProducts = (cat) => {
    setLoading(true);
    setError('');
    API.get(`/products?category=${encodeURIComponent(cat)}`)
      .then(({ data }) => setProducts(data.products))
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(activeCategory); }, [activeCategory]);

  const toggle = (key, value) => {
    setForm(prev => {
      const arr = prev[key];
      return { ...prev, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.basePrice || form.images.length === 0) {
      alert('Please fill in Name, Base Price, and upload at least one image.');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('category', form.category);
      fd.append('description', form.description);
      fd.append('artist', form.artist);
      fd.append('pricingMatrix', JSON.stringify(buildPricingMatrix(Number(form.basePrice))));
      fd.append('availableSizes', JSON.stringify(form.availableSizes));
      fd.append('availablePaperTypes', JSON.stringify(form.availablePaperTypes));
      fd.append('availableFinishes', JSON.stringify(form.availableFinishes));
      form.images.forEach(img => fd.append('images', img));

      await API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccessMsg(`✅ "${form.name}" added successfully!`);
      setForm(emptyForm);
      setShowForm(false);
      if (activeCategory === form.category) fetchProducts(activeCategory);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to add product.');
    } finally {
      setSubmitting(false);
    }
  };

  const deactivate = async (id, name) => {
    if (!confirm(`Deactivate "${name}"? It will no longer appear in the catalog.`)) return;
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

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="text-[#FFA500] hover:text-[#FF4500] text-sm">← Dashboard</Link>
            <h1 className="text-3xl font-extrabold text-[#FFA500]">Product Catalog</h1>
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className="bg-[#FFA500] hover:bg-[#FF8C00] text-[#1B1B1B] font-bold px-5 py-2 rounded-xl transition"
          >
            {showForm ? '✕ Cancel' : '+ Add Product'}
          </button>
        </div>

        {successMsg && (
          <div className="mb-6 bg-green-500/20 border border-green-400 text-green-300 px-4 py-3 rounded-xl text-sm">
            {successMsg}
          </div>
        )}

        {/* ── ADD PRODUCT FORM ── */}
        {showForm && (
          <div className="bg-[#1B1B1B] border border-[#FFA500]/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-[#FFA500] mb-6">New Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Product Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#003459] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#FFA500]"
                  placeholder="e.g. Modern Elegance" />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Category *</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-[#003459] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#FFA500]">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Artist</label>
                <input value={form.artist} onChange={e => setForm(p => ({ ...p, artist: e.target.value }))}
                  className="w-full bg-[#003459] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#FFA500]"
                  placeholder="IndiArt Studio" />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Base Price (₹) *</label>
                <input type="number" value={form.basePrice} onChange={e => setForm(p => ({ ...p, basePrice: e.target.value }))}
                  className="w-full bg-[#003459] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#FFA500]"
                  placeholder="e.g. 199" />
                <p className="text-gray-500 text-xs mt-1">A3 = 1.6×, A2 = 2.4×, Glossy = 1.15×, Premium = 1.3×</p>
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-400 text-sm mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-[#003459] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#FFA500]"
                  placeholder="Short description of this product..." />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Available Sizes</label>
                <div className="flex gap-2 flex-wrap">
                  {SIZES.map(s => (
                    <button key={s} type="button" onClick={() => toggle('availableSizes', s)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${form.availableSizes.includes(s) ? 'bg-[#FFA500] text-[#1B1B1B] border-[#FFA500]' : 'border-gray-600 text-gray-400 hover:border-[#FFA500]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Paper Types</label>
                <div className="flex gap-2 flex-wrap">
                  {PAPER_TYPES.map(p => (
                    <button key={p} type="button" onClick={() => toggle('availablePaperTypes', p)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition capitalize ${form.availablePaperTypes.includes(p) ? 'bg-[#FFA500] text-[#1B1B1B] border-[#FFA500]' : 'border-gray-600 text-gray-400 hover:border-[#FFA500]'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Finishes</label>
                <div className="flex gap-2 flex-wrap">
                  {FINISHES.map(f => (
                    <button key={f} type="button" onClick={() => toggle('availableFinishes', f)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition capitalize ${form.availableFinishes.includes(f) ? 'bg-[#FFA500] text-[#1B1B1B] border-[#FFA500]' : 'border-gray-600 text-gray-400 hover:border-[#FFA500]'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-400 text-sm mb-2 block">Product Images * (up to 6, max 5MB each)</label>
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple
                  onChange={e => setForm(p => ({ ...p, images: Array.from(e.target.files).slice(0, 6) }))}
                  className="w-full text-gray-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#FFA500] file:text-[#1B1B1B] file:font-semibold file:cursor-pointer hover:file:bg-[#FF8C00]" />
                {form.images.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {form.images.map((img, i) => (
                      <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-[#FFA500]/30">
                        <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={handleSubmit} disabled={submitting}
                className="bg-[#FFA500] hover:bg-[#FF8C00] disabled:opacity-50 text-[#1B1B1B] font-bold px-6 py-2.5 rounded-xl transition">
                {submitting ? 'Adding...' : 'Add Product'}
              </button>
              <button onClick={() => { setShowForm(false); setForm(emptyForm); }}
                className="border border-gray-600 text-gray-300 hover:border-gray-400 px-6 py-2.5 rounded-xl transition">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeCategory === cat ? 'bg-[#FFA500] text-[#1B1B1B]' : 'border border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500]/20'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Product Table */}
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
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {products.map(product => {
                  const image = product.images?.[0];
                  const imgSrc = image?.startsWith('http') ? image : null;
                  return (
                    <tr key={product._id} className="hover:bg-[#003459]/40 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#003459] rounded-lg overflow-hidden flex-shrink-0">
                            {imgSrc ? (
                              <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No img</div>
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
                      <td className="p-4">
                        <button onClick={() => deactivate(product._id, product.name)}
                          className="text-red-400 hover:text-red-300 text-xs font-semibold border border-red-400/40 px-3 py-1 rounded-lg transition">
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