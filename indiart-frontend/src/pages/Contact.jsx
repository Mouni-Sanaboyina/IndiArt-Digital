import { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production this would POST to a backend contact endpoint
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] pb-16">
      <div className="text-center py-16 px-6">
        <h1 className="text-5xl font-extrabold text-[#FFA500]">Get in Touch</h1>
        <p className="text-gray-300 mt-4 max-w-xl mx-auto">
          Have questions or need a custom quote? Reach out and we'll get back to you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto px-6">

        {/* Contact Form */}
        <div className="bg-[#00416A] p-8 rounded-2xl shadow-xl border border-[#FFA500]/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { key: 'name', label: 'Your Name', type: 'text', placeholder: 'Enter your name' },
              { key: 'email', label: 'Your Email', type: 'email', placeholder: 'Enter your email' },
              { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Enter subject' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-[#FFA500] font-semibold text-sm block mb-1">{label}</label>
                <input
                  type={type} required
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full p-3 rounded-lg bg-[#1B1B1B] text-white border border-[#FFA500]/40 focus:outline-none focus:border-[#FFA500] placeholder-gray-500"
                />
              </div>
            ))}
            <div>
              <label className="text-[#FFA500] font-semibold text-sm block mb-1">Message</label>
              <textarea
                rows={5} required
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Write your message here..."
                className="w-full p-3 rounded-lg bg-[#1B1B1B] text-white border border-[#FFA500]/40 focus:outline-none focus:border-[#FFA500] placeholder-gray-500"
              />
            </div>
            {sent && <p className="text-green-400 font-semibold text-sm">Message sent! We'll get back to you soon.</p>}
            <button type="submit"
              className="w-full bg-[#FFA500] hover:bg-[#FF4500] text-[#1B1B1B] font-extrabold py-3 rounded-xl transition">
              Send Message
            </button>
          </form>
        </div>

        {/* Map + Contact Info */}
        <div className="space-y-6">
          <div className="rounded-2xl overflow-hidden shadow-xl h-64">
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.352622039455!2d78.39869437516727!3d17.490672783414233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9194828733ab%3A0x39e4d2a6f7c2280f!2sIndiart%20Digital%20Flex%20Print%20LED%20Sign%20Color%20Lab!5e0!3m2!1sen!2sin!4v1738478110974!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
            />
          </div>

          <div className="bg-[#00416A] rounded-2xl p-6 border border-[#FFA500]/20 space-y-3">
            <p className="text-gray-300">📞 <span className="text-[#FFA500] font-semibold">+91 0000000000</span></p>
            <p className="text-gray-300">📧 <span className="text-[#FFA500] font-semibold">indiartdigital2020@gmail.com</span></p>
            <p className="text-gray-300">
              📍 <span className="text-[#FFA500] font-semibold">
                MIG-57 & 58, Shop No. 3, Lakshmi Subarmanya Arcade,<br />
                Road No. 1, KPHB Colony, Near Prasad Hospital,<br />
                Hyderabad-500072, Telangana, India
              </span>
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-[#1B1B1B] text-gray-300 text-center py-6 mt-16">
        <p>&copy; 2025 IndiArt Digital. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Contact;