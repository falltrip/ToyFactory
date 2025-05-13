import { useCallback } from 'react';

export default function Footer() {
  const handleHomeClick = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  
  return (
    <footer className="py-8 px-4 bg-cyber-black border-t border-neon-cyan/20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <button 
              onClick={handleHomeClick}
              className="text-2xl font-orbitron font-bold tracking-wider text-white flex items-center"
            >
              <span className="text-neon-cyan">TOY</span>
              <span className="text-neon-magenta">FACTORY</span>
            </button>
          </div>
          
          <div className="text-cyber-text/50 text-sm font-space">
            <div>© {new Date().getFullYear()} TOY FACTORY. All digital rights reserved.</div>
            <div className="mt-1">Designed and built in the cyber dimension.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
