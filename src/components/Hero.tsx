import { useEffect, useState } from 'react';

function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 8,
    size: 1 + Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            background: 'rgba(0,255,136,0.4)',
            animation: `particleFloat ${p.duration}s ${p.delay}s infinite linear`,
          }}
        />
      ))}
    </div>
  );
}

function GridEffect() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden pointer-events-none opacity-20">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,255,136,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.15) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridMove 3s linear infinite',
        }}
      />
    </div>
  );
}

function CarSVG() {
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStopped(true), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative w-full flex justify-center mt-8"
      style={{
        animation: stopped ? 'idleVibrate 0.15s infinite' : 'carDrive 2.5s ease-in-out forwards',
      }}
    >
      <svg viewBox="0 0 400 140" className="w-80 sm:w-96 md:w-[440px]" xmlns="http://www.w3.org/2000/svg">
        {/* Headlight glow */}
        <ellipse cx="350" cy="90" rx="40" ry="20" fill="url(#headlightGrad)"
          style={{ animation: 'headlightGlow 2.5s ease-in-out forwards' }} />

        {/* Car body */}
        <path d="M60 95 L90 55 L180 35 L280 35 L330 55 L360 75 L365 95 L355 100 L55 100 L50 95 Z"
          fill="url(#bodyGrad)" stroke="#00ff88" strokeWidth="1.2" />
        {/* Windows */}
        <path d="M100 58 L175 40 L175 70 L95 70 Z" fill="rgba(0,255,136,0.12)" stroke="rgba(0,255,136,0.4)" strokeWidth="0.8" />
        <path d="M185 40 L270 40 L320 58 L320 70 L185 70 Z" fill="rgba(0,255,136,0.12)" stroke="rgba(0,255,136,0.4)" strokeWidth="0.8" />
        {/* Lower body line */}
        <path d="M55 100 L365 100" stroke="#00ff88" strokeWidth="1" opacity="0.5" />
        <path d="M70 100 L70 108 L150 108 L150 100" fill="none" stroke="#333" strokeWidth="1" />
        <path d="M250 100 L250 108 L340 108 L340 100" fill="none" stroke="#333" strokeWidth="1" />

        {/* Headlight */}
        <rect x="345" y="78" width="18" height="8" rx="3" fill="#00ff88" opacity="0.9"
          style={{ animation: 'headlightGlow 2.5s ease-in-out forwards' }} />
        {/* Taillight */}
        <rect x="48" y="82" width="10" height="6" rx="2" fill="#ff3344" opacity="0.8" />

        {/* Front wheel */}
        <g>
          <circle cx="300" cy="108" r="20" fill="#111" stroke="#444" strokeWidth="2" />
          <circle cx="300" cy="108" r="13" fill="#222" stroke="#555" strokeWidth="1" />
          <g style={{ transformOrigin: '300px 108px', animation: 'wheelSpin 2.5s ease-in-out forwards' }}>
            <line x1="300" y1="95" x2="300" y2="121" stroke="#555" strokeWidth="1.5" />
            <line x1="287" y1="108" x2="313" y2="108" stroke="#555" strokeWidth="1.5" />
            <line x1="291" y1="99" x2="309" y2="117" stroke="#555" strokeWidth="1" />
            <line x1="309" y1="99" x2="291" y2="117" stroke="#555" strokeWidth="1" />
          </g>
          <circle cx="300" cy="108" r="4" fill="#00ff88" opacity="0.5" />
        </g>

        {/* Rear wheel */}
        <g>
          <circle cx="110" cy="108" r="20" fill="#111" stroke="#444" strokeWidth="2" />
          <circle cx="110" cy="108" r="13" fill="#222" stroke="#555" strokeWidth="1" />
          <g style={{ transformOrigin: '110px 108px', animation: 'wheelSpin 2.5s ease-in-out forwards' }}>
            <line x1="110" y1="95" x2="110" y2="121" stroke="#555" strokeWidth="1.5" />
            <line x1="97" y1="108" x2="123" y2="108" stroke="#555" strokeWidth="1.5" />
            <line x1="101" y1="99" x2="119" y2="117" stroke="#555" strokeWidth="1" />
            <line x1="119" y1="99" x2="101" y2="117" stroke="#555" strokeWidth="1" />
          </g>
          <circle cx="110" cy="108" r="4" fill="#00ff88" opacity="0.5" />
        </g>

        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
          <radialGradient id="headlightGrad">
            <stop offset="0%" stopColor="rgba(0,255,136,0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0a1628 50%, #0a0a0f 100%)' }}>
      <Particles />
      <GridEffect />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
        <h1 className="font-[Orbitron] text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in-up">
          <span className="text-white">Drive Smart. </span>
          <span className="neon-text">Predict Early.</span>
          <br />
          <span className="text-white">Stay Safe.</span>
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto"
          style={{ animation: 'fadeInUp 0.8s 0.3s ease-out both' }}>
          AI-powered real-time vehicle health intelligence.
        </p>

        <div className="flex flex-wrap gap-4 justify-center" style={{ animation: 'fadeInUp 0.8s 0.5s ease-out both' }}>
          <a href="#evaluation" className="gradient-btn text-base">🚀 Get Started</a>
          <a href="#dashboard" className="outline-btn text-base">📊 View Live Evaluation</a>
        </div>

        <CarSVG />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-gray-500 tracking-widest uppercase">Scroll</span>
        <svg className="w-5 h-5 text-[#00ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
