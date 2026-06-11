import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      // Redirect admin to dashboard, users to where they came from
      navigate(data.user.role === 'admin' ? '/admin/dashboard' : from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] flex items-center justify-center px-4">
      <div className="bg-[#1B1B1B] rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-[#FFA500] text-center mb-2">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Login to your IndiArt account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[#FFA500] text-sm font-semibold block mb-1">Email</label>
            <input
              type="email" required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg bg-[#00416A] text-white border border-[#FFA500]/40 focus:outline-none focus:border-[#FFA500] placeholder-gray-500"
            />
          </div>
          <div>
            <label className="text-[#FFA500] text-sm font-semibold block mb-1">Password</label>
            <input
              type="password" required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full p-3 rounded-lg bg-[#00416A] text-white border border-[#FFA500]/40 focus:outline-none focus:border-[#FFA500] placeholder-gray-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#FFA500] hover:bg-[#FF4500] disabled:bg-gray-600 text-[#1B1B1B] font-extrabold py-3 rounded-xl transition text-lg"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#FFA500] hover:underline font-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;