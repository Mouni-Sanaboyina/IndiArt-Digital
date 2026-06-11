import { Link } from 'react-router-dom';

const PLANS = [
  {
    name: 'Basic',
    price: '₹199',
    per: 'per order',
    features: ['100 Business Cards', 'Standard Printing', 'A4 / Matte finish', '5–7 Days Delivery', '3 Design Revisions'],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹499',
    per: 'per order',
    features: ['250 Business Cards', 'Premium Printing', 'A3 / Glossy / Matte', '3–5 Days Delivery', 'Unlimited Revisions'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '₹999',
    per: 'per order',
    features: ['500+ Prints', 'Luxury & Custom Printing', 'All Sizes & Finishes', '1–2 Days Express', 'Priority Support'],
    highlight: false,
  },
];

const Pricing = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] pb-16">
    <div className="text-center py-16 px-6">
      <h1 className="text-5xl font-extrabold text-[#FFA500]">Pricing Plans</h1>
      <p className="text-gray-300 mt-4 max-w-xl mx-auto">
        Choose a plan that fits your needs. All orders go through our quality review before printing.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
      {PLANS.map(plan => (
        <div
          key={plan.name}
          className={`rounded-2xl p-8 shadow-xl transition duration-300 hover:scale-105 ${
            plan.highlight
              ? 'bg-[#00416A] border-2 border-[#FFA500]'
              : 'bg-[#00416A] border border-[#FFA500]/30'
          }`}
        >
          {plan.highlight && (
            <span className="bg-[#FFA500] text-[#1B1B1B] text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
              Most Popular
            </span>
          )}
          <h3 className="text-2xl font-bold text-white">{plan.name} Plan</h3>
          <p className="text-[#FFA500] text-4xl font-extrabold mt-3">
            {plan.price} <span className="text-lg font-light text-gray-300">{plan.per}</span>
          </p>
          <ul className="mt-5 space-y-2">
            {plan.features.map(f => (
              <li key={f} className="text-gray-300 text-sm flex items-center gap-2">
                <span className="text-[#FFA500]">✔</span> {f}
              </li>
            ))}
          </ul>
          <Link
            to="/services"
            className="mt-6 block text-center bg-[#FFA500] hover:bg-[#FF4500] text-[#1B1B1B] font-bold py-3 rounded-xl transition"
          >
            Get Started
          </Link>
        </div>
      ))}
    </div>

    <div className="text-center mt-12 px-6">
      <p className="text-gray-400">
        Need a custom quote?{' '}
        <Link to="/contact" className="text-[#FFA500] hover:underline font-semibold">Contact us</Link>
      </p>
    </div>

    <footer className="bg-[#1B1B1B] text-gray-300 text-center py-6 mt-16">
      <p>&copy; 2025 IndiArt Digital. All Rights Reserved.</p>
    </footer>
  </div>
);

export default Pricing;