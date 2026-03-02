import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, CheckCircle, Heart } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && msg) {
      setSent(true);
      setTimeout(() => { setSent(false); setEmail(''); setMsg(''); }, 3000);
    }
  };

  return (
    <footer id="contact" className="relative py-20 px-4" style={{ background: 'linear-gradient(180deg, #0a0a0f, #060610)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#00ff88] mb-3 block">Contact</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Get In <span className="neon-text">Touch</span>
            </h2>
            {sent ? (
              <div className="glass-card p-8 text-center">
                <CheckCircle className="text-[#00ff88] mx-auto mb-3" size={48} />
                <p className="text-[#00ff88] text-sm">Message sent successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00ff88] transition-all placeholder-gray-600"
                />
                <textarea
                  placeholder="Your message"
                  rows={4}
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  required
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00ff88] transition-all placeholder-gray-600 resize-none"
                />
                <button type="submit" className="gradient-btn">Send Message</button>
              </form>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Car className="text-[#00ff88]" size={28} />
                <span className="font-bold text-xl neon-text">Vehixa</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Intelligent Vehicle Health Evaluation platform powered by cutting-edge AI and machine learning.
                Predict failures, optimize maintenance, and keep vehicles running at peak performance.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-gray-500">Quick Links</h4>
              {[
                { label: 'Home', path: '/' },
                { label: 'Live Evaluation', path: '/live-evaluation' },
                { label: 'Dashboard', path: '/dashboard' },
                { label: 'Contact', path: '/contact' },
              ].map(link => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="block text-gray-400 text-sm hover:text-[#00ff88] transition-colors"
                >
                  → {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-8 space-y-2">
              <h4 className="text-xs uppercase tracking-wider text-gray-500">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'ML/AI', 'Python'].map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs bg-white/5 text-gray-400 border border-white/5">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © 2024 Vehixa. Built for Hackathon Demo.
          </p>
          <p className="text-gray-600 text-xs flex items-center gap-1">
            Made with <Heart className="text-[#ff3344]" size={14} fill="#ff3344" /> by Vehixa Team
          </p>
        </div>
      </div>
    </footer>
  );
}
