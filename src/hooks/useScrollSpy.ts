import { useEffect, useState } from 'react';

const sections = ['home', 'about', 'features', 'evaluation', 'dashboard', 'alerts', 'contact'];

export function useScrollSpy() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          setActive(sections[i]);
          return;
        }
      }
      setActive('home');
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return active;
}
