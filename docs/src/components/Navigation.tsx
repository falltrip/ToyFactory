import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMediaQuery } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NavLink {
  href: string;
  label: string;
  color: string;
  hoverColor: string;
}

const navLinks: NavLink[] = [
  { href: "#home", label: "HOME", color: "text-neon-cyan", hoverColor: "hover:text-white" },
  { href: "#profile", label: "PROFILE", color: "text-white", hoverColor: "hover:text-neon-cyan" },
  { href: "#app", label: "APP", color: "text-white", hoverColor: "hover:text-neon-magenta" },
  { href: "#game", label: "GAME", color: "text-white", hoverColor: "hover:text-neon-yellow" },
  { href: "#image", label: "IMAGE", color: "text-white", hoverColor: "hover:text-neon-green" },
  { href: "#video", label: "VIDEO", color: "text-white", hoverColor: "hover:text-neon-blue" },
  { href: "#etc", label: "ETC", color: "text-white", hoverColor: "hover:text-neon-magenta" }
];

export default function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setActiveSection(id);
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
      if (isMobile) {
        setIsMenuOpen(false);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
      
      const sections = document.querySelectorAll('section[id]');
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionHeight = rect.height;
        const sectionId = section.getAttribute('id') || '';
        
        if (
          scrollPosition >= sectionTop - 100 &&
          scrollPosition < sectionTop + sectionHeight - 100
        ) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-cyber-black/80 backdrop-blur-md border-b border-neon-cyan/30 py-2" 
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center relative">
        <div className="flex items-center justify-between w-full md:w-auto">
          <motion.button
            onClick={() => handleLinkClick('home')}
            className="text-3xl md:text-4xl font-orbitron font-bold tracking-wider text-white flex items-center"
          >
            {scrolled ? (
              <>
                <span className="text-neon-cyan">TOY</span>
                <span className="text-white">FACTORY</span>
              </>
            ) : (
              <span className="sr-only">TOY FACTORY</span>
            )}
          </motion.button>
          <button 
            onClick={toggleMenu}
            className={cn(
              "md:hidden p-2 transition-colors",
              scrolled ? "text-white" : "text-neon-cyan"
            )}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        
        <nav className={cn(
          "md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 w-full md:w-auto mt-4 md:mt-0",
          isMenuOpen ? "flex" : "hidden"
        )}>
          {navLinks.map((link, index) => (
            <motion.button
              key={link.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              onClick={() => handleLinkClick(link.href.substring(1))}
              className={cn(
                "font-orbitron text-sm transition-colors duration-300 relative group",
                activeSection === link.href.substring(1) ? "text-neon-cyan" : link.color,
                link.hoverColor
              )}
            >
              {link.label}
              <span className={cn(
                "absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full",
                activeSection === link.href.substring(1) ? "bg-neon-cyan w-full" : "bg-white"
              )}></span>
            </motion.button>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
