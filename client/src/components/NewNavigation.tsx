import { useState, useEffect } from 'react';
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
  { href: "#app", label: "APP", color: "text-white", hoverColor: "hover:text-neon-magenta" },
  { href: "#game", label: "GAME", color: "text-white", hoverColor: "hover:text-neon-yellow" },
  { href: "#image", label: "IMAGE", color: "text-white", hoverColor: "hover:text-neon-green" },
  { href: "#video", label: "VIDEO", color: "text-white", hoverColor: "hover:text-neon-blue" }
];

export default function NewNavigation() {
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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="px-4 md:px-8 py-2">
        <div className={cn(
          "w-full transition-all duration-500 px-4 py-3 rounded-md",
          scrolled 
            ? "bg-cyber-black/90 backdrop-blur-lg" 
            : "bg-cyber-black/40 backdrop-blur-sm"
        )}>
          <div className="flex flex-col md:flex-row justify-between items-center relative">
            <div className="flex items-center justify-between w-full md:w-auto">
              <button
                onClick={() => handleLinkClick('home')}
                className="text-3xl md:text-4xl font-orbitron font-bold tracking-wider text-white flex items-center group"
              >
                <div className="flex items-center overflow-hidden">
                  <motion.span 
                    className="text-neon-cyan"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: [1, 0.8, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >TOY</motion.span>
                  <motion.span className="mx-1"></motion.span>
                  <motion.span 
                    className="text-neon-magenta text-2xl md:text-3xl mt-1"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >FACTORY</motion.span>
                </div>
                <motion.div 
                  className="ml-2 h-4 w-4 rounded-full bg-neon-cyan"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                    boxShadow: [
                      "0 0 0 0 rgba(0, 255, 255, 0.4)",
                      "0 0 0 10px rgba(0, 255, 255, 0)",
                      "0 0 0 0 rgba(0, 255, 255, 0.4)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
              </button>
              
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
                  onClick={() => handleLinkClick(link.href.substring(1))}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                  className={cn(
                    "font-orbitron text-sm transition-colors duration-300 relative group",
                    activeSection === link.href.substring(1) ? "text-neon-cyan" : link.color,
                    link.hoverColor
                  )}
                >
                  {link.label}
                  {activeSection === link.href.substring(1) && (
                    <motion.span 
                      layoutId="activeIndicator"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-neon-cyan" 
                    />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </motion.header>
  );
}