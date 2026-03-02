import { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      await response.json();
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 px-4" style={{ background: 'linear-gradient(180deg, #0a0a0f, #0d1420, #0a0a0f)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#00ff88] mb-3 block">Contact</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Get in <span className="neon-text">Touch</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Have questions or need support? We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00ff88]/10 rounded-lg flex items-center justify-center border border-[#00ff88]/30">
                  <span className="text-[#00ff88] text-xl">📧</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email</h4>
                  <p className="text-gray-400">support@vehixa.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00ff88]/10 rounded-lg flex items-center justify-center border border-[#00ff88]/30">
                  <span className="text-[#00ff88] text-xl">📞</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Phone</h4>
                  <p className="text-gray-400">+1 (800) 555-0123</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00ff88]/10 rounded-lg flex items-center justify-center border border-[#00ff88]/30">
                  <span className="text-[#00ff88] text-xl">📍</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Address</h4>
                  <p className="text-gray-400">123 Tech Street<br/>Innovation City, IC 12345</p>
                </div>
              </div>

              {/* Response Time */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00ff88]/10 rounded-lg flex items-center justify-center border border-[#00ff88]/30">
                  <span className="text-[#00ff88] text-xl">⏱️</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Response Time</h4>
                  <p className="text-gray-400">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-[#0d1117]/60 to-[#161b22]/60 border border-[#00ff88]/20 rounded-xl p-8 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-[#0d1117]/80 border border-[#30363d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-[#0d1117]/80 border border-[#30363d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-[#0d1117]/80 border border-[#30363d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-all"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0d1117]/80 border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-all"
                >
                  <option value="">Select a subject...</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Pricing Question">Pricing Question</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  rows={5}
                  className="w-full px-4 py-3 bg-[#0d1117]/80 border border-[#30363d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-all resize-none"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  ✅ Thank you! We've received your message and will get back to you soon.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-[#00ff88] to-[#00cc6f] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00ff88]/50 disabled:opacity-50 transition-all"
              >
                {loading ? '⏳ Sending...' : '✉️ Send Message'}
              </button>

              <p className="text-gray-500 text-xs text-center mt-4">
                Required fields are marked with *
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
