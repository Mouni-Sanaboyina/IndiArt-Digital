import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['Business Cards', 'Flyers', 'Posters', 'T-Shirts', 'Stickers', 'Invitations'];

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activeCategory = searchParams.get('category') || CATEGORIES[0];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await API.get(`/products?category=${encodeURIComponent(activeCategory)}`);
        setProducts(data.products);
      } catch {
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] pb-16">
      <div className="text-center py-16 px-6">
        <h1 className="text-5xl font-extrabold text-[#FFA500]">Our Services</h1>
        <p className="text-gray-300 mt-4 max-w-xl mx-auto">
          High-quality printing services tailored to your needs. Configure your print and order online.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 px-6 mb-12">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSearchParams({ category: cat })}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition duration-200 ${
              activeCategory === cat
                ? 'bg-[#FFA500] text-[#1B1B1B]'
                : 'border border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500] hover:text-[#1B1B1B]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-6">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#FFA500] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {error && <p className="text-red-400 text-center py-8">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="text-gray-400 text-center py-8">No products found in this category.</p>
        )}
        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-8">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;