import { useState } from 'react';

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
            <h2 className="font-[Orbitron] text-2xl sm:text-3xl font-bold text-white mb-6">
              Get In <span className="neon-text">Touch</span>
            </h2>
            {sent ? (
              <div className="glass-card p-8 text-center">
                <span className="text-4xl mb-3 block">✅</span>
                <p className="text-[#00ff88] font-[Orbitron] text-sm">Message sent successfully!</p>
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
                <span className="text-2xl">🚗</span>
                <span className="font-[Orbitron] font-bold text-xl neon-text">AutoVitals AI</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Intelligent Vehicle Health Evaluation platform powered by cutting-edge AI and machine learning.
                Predict failures, optimize maintenance, and keep vehicles running at peak performance.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-[Orbitron] text-xs uppercase tracking-wider text-gray-500">Quick Links</h4>
              {['Home', 'About', 'Features', 'Live Evaluation', 'Dashboard', 'Alerts'].map(link => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(' ', '-').replace('live-evaluation', 'evaluation')}`}
                  className="block text-gray-400 text-sm hover:text-[#00ff88] transition-colors"
                >
                  → {link}
                </a>
              ))}
            </div>

            <div className="mt-8 space-y-2">
              <h4 className="font-[Orbitron] text-xs uppercase tracking-wider text-gray-500">Tech Stack</h4>
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
            © 2024 AutoVitals AI. Built for Hackathon Demo.
          </p>
          <p className="text-gray-600 text-xs flex items-center gap-1">
            Made with <span className="text-[#ff3344]">♥</span> by AutoVitals Team
          </p>
        </div>
      </div>
    </footer>
  );
}
