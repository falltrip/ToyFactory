import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

export default function Profile() {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // For scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    layoutEffect: false
  });
  
  const verticalPillarY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const horizontalPillarX = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  
  // Generate 3D render elements (similar to the image)
  const [renderElements] = useState(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      width: Math.random() * 60 + 20,
      height: Math.random() * 200 + 50,
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 400,
      z: Math.random() * 500 - 250,
      opacity: Math.random() * 0.5 + 0.3,
      hue: Math.random() * 40 + 190, // Blue to cyan hues
      type: i % 3, // Different shapes
      rotateY: Math.random() * 45,
      rotateX: Math.random() * 45,
      delay: i * 0.1
    }));
  });
  
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
          setIsInView(true);
        }
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setMousePosition({
          x: x,
          y: y
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Calculate perspective motion based on mouse position
  const calculatePerspectiveMotion = (x: number, y: number, z: number, factor = 0.05) => {
    if (!containerRef.current) return { x, y, z };
    
    const centerX = containerRef.current.clientWidth / 2;
    const centerY = containerRef.current.clientHeight / 2;
    
    const mouseX = mousePosition.x;
    const mouseY = mousePosition.y;
    
    const deltaX = (mouseX - centerX) * factor;
    const deltaY = (mouseY - centerY) * factor;
    
    return {
      x: x - deltaX * (z / 500),
      y: y - deltaY * (z / 500),
      z
    };
  };
  
  return (
    <section 
      id="profile" 
      ref={sectionRef}
      className="min-h-screen py-20 px-4 bg-blue-950 relative flex items-center overflow-hidden perspective-1000"
    >
      {/* Subtle background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 opacity-80"></div>
      
      {/* No title */}
      
      {/* 3D rendered elements container */}
      <div 
        ref={containerRef}
        className="absolute inset-0 perspective-2000 overflow-hidden"
      >
        {/* Glass blocks resembling 3D rendering */}
        {renderElements.map((el, i) => {
          const perspective = calculatePerspectiveMotion(el.x, el.y, el.z);
          
          return (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2"
              initial={{ 
                opacity: 0,
                x: perspective.x,
                y: perspective.y,
                rotateX: el.rotateX - 20,
                rotateY: el.rotateY - 20,
                rotateZ: 0
              }}
              animate={{ 
                opacity: el.opacity,
                x: perspective.x,
                y: perspective.y,
                z: perspective.z,
                rotateX: el.rotateX,
                rotateY: el.rotateY,
                rotateZ: 0
              }}
              transition={{
                duration: 1,
                delay: el.delay,
                ease: "easeOut"
              }}
              style={{
                width: el.width,
                height: el.height,
                background: `linear-gradient(180deg, 
                  hsla(${el.hue}, 100%, 70%, 0.2) 0%, 
                  hsla(${el.hue}, 100%, 55%, 0.4) 50%, 
                  hsla(${el.hue}, 100%, 40%, 0.2) 100%)`,
                backdropFilter: "blur(8px)",
                borderTop: "1px solid rgba(255, 255, 255, 0.4)",
                borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
                borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                boxShadow: "0 0 15px rgba(0, 255, 255, 0.2)",
                transformStyle: "preserve-3d",
                willChange: "transform, opacity"
              }}
            />
          );
        })}
        
        {/* Central vertical and horizontal highlights */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-12 h-[80vh] bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
          style={{ y: verticalPillarY, x: "-50%", transformOrigin: "center" }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 h-12 w-[80vw] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
          style={{ x: horizontalPillarX, y: "-50%", transformOrigin: "center" }}
        />
        
        {/* Light burst from center */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(120,230,255,0.3) 40%, transparent 70%)",
            boxShadow: "0 0 30px rgba(120, 230, 255, 0.6)"
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* No overlay text */}
    </section>
  );
}
