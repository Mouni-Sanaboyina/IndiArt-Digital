import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(data.user, data.token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] flex items-center justify-center px-4">
      <div className="bg-[#1B1B1B] rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-[#FFA500] text-center mb-2">Create Account</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Join IndiArt Digital today</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your Name' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
            { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="text-[#FFA500] text-sm font-semibold block mb-1">{label}</label>
              <input
                type={type} required
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full p-3 rounded-lg bg-[#00416A] text-white border border-[#FFA500]/40 focus:outline-none focus:border-[#FFA500] placeholder-gray-500"
              />
            </div>
          ))}

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#FFA500] hover:bg-[#FF4500] disabled:bg-gray-600 text-[#1B1B1B] font-extrabold py-3 rounded-xl transition text-lg"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#FFA500] hover:underline font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;