import {useState} from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';

export default function Navbar(){
    const links = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'features', label: 'Features' },
  { id: 'evaluation', label: 'Live Evaluation' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'contact', label: 'Contact' },
];

     const active = useScrollSpy();
  const [open, setOpen] = useState(false);
    return(
        <nav className='fixed top-0 left-0 right-0 z-50' style={{background: 'rgba(10, 10, 15, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'}}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16'>
                <a href="#home" className="flex items-center gap-2">
                <span className="text-2xl">🚗</span>
                <span className="font-[Orbitron] font-bold text-lg neon-text tracking-wider">AutoVitals AI</span>
                </a>
                <div className='hidden md:flex items-center gap-1'>
                    {links.map(l => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300"
              style={{
                color: active === l.id ? '#00ff88' : '#94a3b8',
                background: active === l.id ? 'rgba(0,255,136,0.08)' : 'transparent',
                textShadow: active === l.id ? '0 0 10px rgba(0,255,136,0.5)' : 'none',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.color = '#00ff88';
                (e.target as HTMLElement).style.textShadow = '0 0 10px rgba(0,255,136,0.5)';
              }}
              onMouseLeave={e => {
                if (active !== l.id) {
                  (e.target as HTMLElement).style.color = '#94a3b8';
                  (e.target as HTMLElement).style.textShadow = 'none';
                }
              }}
            >
              {l.label}
            </a>
          ))}
                </div>
            </div>
        </nav>
    )
}