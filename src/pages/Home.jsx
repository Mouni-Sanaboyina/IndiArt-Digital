import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Business Cards', slug: 'Business Cards', icon: '🪪' },
  { name: 'Flyers',         slug: 'Flyers',         icon: '📄' },
  { name: 'Posters',        slug: 'Posters',        icon: '🖼️' },
  { name: 'T-Shirts',       slug: 'T-Shirts',       icon: '👕' },
  { name: 'Stickers',       slug: 'Stickers',       icon: '🏷️' },
  { name: 'Invitations',    slug: 'Invitations',    icon: '💌' },
];

const Home = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e]">
    {/* Hero */}
    <header className="text-center py-24 px-6 flex flex-col items-center">
      <h1 className="text-6xl font-extrabold text-[#FFA500] drop-shadow-md">IndiArt Digital</h1>
      <p className="mt-4 text-xl text-gray-300 max-w-2xl">
        Premium custom printing for your business and personal needs. Configure your print, place your order, we handle the rest.
      </p>
      <div className="flex gap-4 mt-8">
        <Link to="/services"
          className="bg-[#FFA500] hover:bg-[#FF4500] text-[#1B1B1B] font-bold py-4 px-8 rounded-full shadow-lg transition duration-300">
          Explore Services
        </Link>
        <Link to="/register"
          className="border-2 border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500] hover:text-[#1B1B1B] font-bold py-4 px-8 rounded-full transition duration-300">
          Get Started
        </Link>
      </div>
    </header>

    {/* Services Grid */}
    <section className="py-16 px-6">
      <h2 className="text-3xl font-bold text-center text-[#FFA500] mb-12">Our Services</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {CATEGORIES.map(cat => (
          <Link key={cat.slug} to={`/services?category=${encodeURIComponent(cat.slug)}`}>
            <div className="bg-[#003459] p-6 shadow-xl rounded-2xl border-t-4 border-[#FFA500] hover:scale-105 transition duration-300 text-center">
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h4 className="text-xl font-semibold text-white">{cat.name}</h4>
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* How it works */}
    <section className="py-16 px-6 bg-[#00416A]/40">
      <h2 className="text-3xl font-bold text-center text-[#FFA500] mb-12">How It Works</h2>
      <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
        {[
          { step: '1', title: 'Browse', desc: 'Explore our catalog of premium print designs' },
          { step: '2', title: 'Configure', desc: 'Pick your size, paper type and finish' },
          { step: '3', title: 'Order', desc: 'Add to cart and checkout securely' },
          { step: '4', title: 'Delivered', desc: 'We print and dispatch to your door' },
        ].map(({ step, title, desc }) => (
          <div key={step} className="bg-[#1B1B1B] p-6 rounded-2xl border border-[#FFA500]/30">
            <div className="w-12 h-12 bg-[#FFA500] rounded-full flex items-center justify-center text-[#1B1B1B] font-bold text-xl mx-auto mb-4">{step}</div>
            <h4 className="text-white font-semibold text-lg">{title}</h4>
            <p className="text-gray-400 text-sm mt-2">{desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-[#1B1B1B] text-gray-300 text-center py-6 mt-8">
      <p>&copy; 2025 IndiArt Digital. All Rights Reserved.</p>
      <p className="text-sm text-gray-500 mt-1">KPHB Colony, Hyderabad, Telangana</p>
    </footer>
  </div>
);

export default Home;