import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { cartCount, fetchCart, clearCartState } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart, isLoggedIn]);

  const handleLogout = () => {
    logout();
    clearCartState();
    navigate('/');
  };

  return (
    <nav className="bg-[#1B1B1B] shadow-lg px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img src="/logo.jpg" alt="IndiArt" className="h-10 w-auto" onError={e => e.target.style.display='none'} />
        <span className="text-[#FFA500] text-xl font-bold">IndiArt Digital</span>
      </Link>

      {/* Nav links */}
      <ul className="hidden md:flex items-center gap-8 text-[#FFA500] font-semibold text-sm">
        <li><Link to="/" className="hover:text-[#FF4500] transition">Home</Link></li>
        <li><Link to="/services" className="hover:text-[#FF4500] transition">Services</Link></li>
        <li><Link to="/portfolio" className="hover:text-[#FF4500] transition">Portfolio</Link></li>
        <li><Link to="/pricing" className="hover:text-[#FF4500] transition">Pricing</Link></li>
        <li><Link to="/contact" className="hover:text-[#FF4500] transition">Contact</Link></li>
        {isAdmin && (
          <li>
            <Link to="/admin/dashboard" className="text-purple-400 hover:text-purple-300 transition">
              Admin Panel
            </Link>
          </li>
        )}
      </ul>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Cart — only for non-admin logged in users */}
        {isLoggedIn && !isAdmin && (
          <Link to="/cart" className="relative text-[#FFA500] hover:text-[#FF4500] transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF4500] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {/* Auth buttons */}
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            {!isAdmin && (
              <Link to="/my-orders" className="text-gray-300 hover:text-white text-sm transition">
                My Orders
              </Link>
            )}
            <span className="text-gray-400 text-sm hidden md:block">Hi, {user?.name?.split(' ')[0]}</span>
            <button
              onClick={handleLogout}
              className="bg-[#FF4500] hover:bg-[#e03d00] text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link to="/login"
              className="text-[#FFA500] border border-[#FFA500] hover:bg-[#FFA500] hover:text-[#1B1B1B] text-sm font-semibold px-4 py-2 rounded-lg transition">
              Login
            </Link>
            <Link to="/register"
              className="bg-[#FFA500] hover:bg-[#FF4500] text-[#1B1B1B] text-sm font-semibold px-4 py-2 rounded-lg transition">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;