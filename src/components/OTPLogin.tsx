import { useState } from 'react';
import { usersService } from '../services';

interface OTPLoginProps {
  onSuccess?: (user: any, token: string) => void;
}

export default function OTPLogin({ onSuccess }: OTPLoginProps) {
  const [step, setStep] = useState<'email' | 'otp' | 'register'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [userExists, setUserExists] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await usersService.sendLoginOTP(email);
      setMessage(result.message);
      setUserExists(result.userExists);
      
      if (!result.userExists) {
        setStep('register');
      } else {
        setStep('otp');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    if (!userExists && !name) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await usersService.verifyLoginOTP(email, otp, {
        name: name || '',
        ...(phone && { phone }),
      });

      setMessage('✅ Authentication successful!');
      
      // Store token and redirect
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      setTimeout(() => {
        onSuccess?.(result.user, result.token);
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setOTP('');
    setName('');
    setPhone('');
    setError(null);
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Vehixa</h1>
          <p className="text-gray-400">AI Vehicle Health Monitoring</p>
        </div>

        {/* Card */}
        <div className="bg-gradient-to-br from-[#0d1117]/80 to-[#161b22]/80 border border-[#00ff88]/20 rounded-xl p-8 backdrop-blur-sm">
          {/* Step 1: Email */}
          {step === 'email' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Sign In / Sign Up</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  {message}
                </div>
              )}

              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#00ff88] to-[#00cc6f] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00ff88]/50 disabled:opacity-50 transition-all"
              >
                {loading ? '⏳ Sending OTP...' : 'Send OTP'}
              </button>

              <p className="text-center text-gray-400 text-sm mt-4">
                We'll send a 6-digit code to your email
              </p>
            </div>
          )}

          {/* Step 2: Register (if new user) */}
          {step === 'register' && !userExists && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400 text-sm mb-6">Complete your profile to get started</p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
                />
              </div>

              <p className="text-gray-400 text-sm mb-4">
                OTP has been sent to <span className="text-[#00ff88] font-semibold">{email}</span>
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Enter OTP *</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value.substring(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] text-center text-2xl tracking-widest"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  {message}
                </div>
              )}

              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#00ff88] to-[#00cc6f] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00ff88]/50 disabled:opacity-50 transition-all mb-3"
              >
                {loading ? '⏳ Verifying...' : 'Create Account & Verify'}
              </button>

              <button
                onClick={handleBack}
                disabled={loading}
                className="w-full py-3 px-4 bg-[#30363d] text-white font-semibold rounded-lg hover:bg-[#3d444d] transition-all"
              >
                Back
              </button>
            </div>
          )}

          {/* Step 3: OTP Verification (if existing user) */}
          {step === 'otp' && userExists && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Verify OTP</h2>

              <p className="text-gray-400 text-sm mb-4">
                Enter the 6-digit code sent to <span className="text-[#00ff88] font-semibold">{email}</span>
              </p>

              <div className="mb-6">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value.substring(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] text-center text-3xl tracking-widest font-bold"
                />
              </div>

              <p className="text-gray-400 text-xs mb-4">Code expires in 10 minutes</p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  {message}
                </div>
              )}

              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#00ff88] to-[#00cc6f] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00ff88]/50 disabled:opacity-50 transition-all mb-3"
              >
                {loading ? '⏳ Verifying...' : 'Verify & Login'}
              </button>

              <button
                onClick={handleBack}
                disabled={loading}
                className="w-full py-3 px-4 bg-[#30363d] text-white font-semibold rounded-lg hover:bg-[#3d444d] transition-all"
              >
                Use Different Email
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Secure sign-in with OTP verification | No password required
        </p>
      </div>
    </div>
  );
}
