import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public pages
import Home from './pages/Home';
import Services from './pages/Services';
import ProductDetail from './pages/ProductDetail';
import Portfolio from './pages/Portfolio';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// User protected pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminProducts from './pages/admin/AdminProducts';

const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <Routes>
          {/* ── PUBLIC ─────────────────────────────── */}
          <Route path="/"            element={<Home />} />
          <Route path="/services"    element={<Services />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/portfolio"   element={<Portfolio />} />
          <Route path="/pricing"     element={<Pricing />} />
          <Route path="/contact"     element={<Contact />} />

          {/* ── GUEST ONLY ─────────────────────────── */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── USER PROTECTED ─────────────────────── */}
          <Route path="/cart" element={
            <ProtectedRoute><Cart /></ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
          <Route path="/order-confirmation" element={
            <ProtectedRoute><OrderConfirmation /></ProtectedRoute>
          } />
          <Route path="/my-orders" element={
            <ProtectedRoute><MyOrders /></ProtectedRoute>
          } />

          {/* ── ADMIN PROTECTED ────────────────────── */}
          <Route path="/admin/dashboard" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute><AdminOrders /></AdminRoute>
          } />
          <Route path="/admin/orders/:id" element={
            <AdminRoute><AdminOrderDetail /></AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute><AdminProducts /></AdminRoute>
          } />

          {/* ── 404 ────────────────────────────────── */}
          <Route path="*" element={
            <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] flex items-center justify-center">
              <div className="text-center">
                <p className="text-[#FFA500] text-6xl font-extrabold">404</p>
                <p className="text-gray-300 mt-4">Page not found.</p>
                <a href="/" className="mt-6 inline-block text-[#FFA500] hover:underline">← Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;