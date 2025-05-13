import { motion, useTransform, useScroll, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export default function Hero() {
  const [randomGradients] = useState([
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 }
  ]);
  
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Scroll-based animations
  const logoScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.8]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 0.8, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.3], [0.1, 0.3]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  
  // Create 3D tech elements (inspired by the attached image)
  const [techElements] = useState(() => 
    Array.from({ length: 16 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 100,
      z: Math.random() * 200 - 80,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
      type: i % 3 // 0: rectangle, 1: square, 2: circle
    }))
  );

  return (
    <section 
      id="home" 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden perspective-1000"
    >
      {/* Tech universe background (inspired by the image) */}
      <div className="absolute inset-0 bg-cyber-black z-0">
        {/* Depth grid */}
        <motion.div 
          className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] grid-rows-[repeat(auto-fill,minmax(60px,1fr))]"
          style={{ opacity: gridOpacity }}
        >
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} 
              className="border border-neon-cyan/10"
              style={{
                opacity: Math.random() * 0.5 + 0.1,
              }}
            ></div>
          ))}
        </motion.div>
      
        {/* Tech path lines (inspired by the image) */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="w-full h-full relative" 
            style={{ scale: bgScale }}
          >
            {/* Center point */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
              
              {/* Rays emanating from center */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30) * (Math.PI / 180);
                const length = 2000;
                const endX = Math.cos(angle) * length;
                const endY = Math.sin(angle) * length;
                
                return (
                  <motion.div 
                    key={i}
                    className={cn(
                      "absolute top-1/2 left-1/2 origin-left h-[1px]",
                      i % 3 === 0 ? "bg-neon-cyan/30" : i % 3 === 1 ? "bg-neon-magenta/30" : "bg-neon-blue/30"
                    )}
                    style={{ 
                      width: length,
                      rotate: i * 30,
                      translateX: "-50%",
                      translateY: "-50%",
                      opacity: 0.3 + (Math.sin(i) * 0.2)
                    }}
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                      scaleX: [0.95, 1, 0.95]
                    }}
                    transition={{
                      duration: 3 + (i % 5),
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )
              })}
              
              {/* Animated glowing dots along rays */}
              {Array.from({ length: 8 }).map((_, i) => {
                const delay = i * 1.5;
                const angle = (i * 45) * (Math.PI / 180);
                
                return (
                  <motion.div
                    key={i}
                    className={cn(
                      "absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full",
                      i % 3 === 0 ? "bg-neon-cyan" : i % 3 === 1 ? "bg-neon-magenta" : "bg-neon-blue"
                    )}
                    style={{
                      boxShadow: i % 3 === 0 
                        ? "0 0 10px rgba(0, 255, 255, 0.7)" 
                        : i % 3 === 1 
                          ? "0 0 10px rgba(255, 0, 255, 0.7)" 
                          : "0 0 10px rgba(0, 128, 255, 0.7)"
                    }}
                    animate={{
                      x: [0, Math.cos(angle) * 1000],
                      y: [0, Math.sin(angle) * 1000],
                      opacity: [1, 0]
                    }}
                    transition={{
                      duration: 5,
                      ease: "linear",
                      repeat: Infinity,
                      delay: delay,
                    }}
                  />
                )
              })}
            </div>
          </motion.div>
        </div>
        
        {/* 3D tech floating elements */}
        <div className="absolute inset-0 pointer-events-none z-1">
          {techElements.map((el, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `calc(50% + ${el.x}px)`,
                top: `calc(50% + ${el.y}px)`,
                translateZ: el.z,
                scale: el.scale,
                rotate: el.rotation
              }}
              animate={{
                y: [el.y - 20, el.y + 20, el.y - 20],
                rotateX: [0, el.rotation, 0],
                rotateY: [0, el.rotation * 0.7, 0],
                rotateZ: [0, el.rotation * 0.3, 0],
              }}
              transition={{
                duration: 15 + (i % 10),
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              {el.type === 0 ? (
                <div className={cn(
                  "w-16 h-8 border border-neon-cyan/50 opacity-30 backdrop-blur-sm",
                  i % 2 === 0 ? "bg-neon-cyan/5" : "bg-transparent"
                )}></div>
              ) : el.type === 1 ? (
                <div className={cn(
                  "w-12 h-12 border border-neon-magenta/50 opacity-30 backdrop-blur-sm",
                  i % 2 === 0 ? "bg-neon-magenta/5" : "bg-transparent"
                )}></div>
              ) : (
                <div className={cn(
                  "w-10 h-10 rounded-full border border-neon-blue/50 opacity-30 backdrop-blur-sm",
                  i % 2 === 0 ? "bg-neon-blue/5" : "bg-transparent"
                )}></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Main logo/title that expands with scroll */}
      <motion.div 
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{ 
          scale: logoScale,
          opacity: logoOpacity,
          y: titleY
        }}
      >
        <div className="h-full w-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative perspective-1000"
          >
            {/* Outer ring */}
            <motion.div
              className="absolute -inset-4 rounded-full opacity-70"
              style={{
                background: "radial-gradient(circle, rgba(0,255,255,0.2) 0%, rgba(255,0,255,0.1) 70%, transparent 100%)",
              }}
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            ></motion.div>
            
            {/* Main circle container */}
            <div className="relative h-[300px] w-[300px] md:h-[450px] md:w-[450px] lg:h-[550px] lg:w-[550px] bg-cyber-black rounded-full border border-neon-cyan/30 overflow-hidden flex items-center justify-center perspective">
              {/* Animated background inside the circle */}
              <div className="absolute inset-0">
                <motion.div 
                  className="absolute inset-0 opacity-30"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%']
                  }}
                  transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at ${randomGradients[0].x}% ${randomGradients[0].y}%, rgba(0, 255, 255, 0.2) 0%, transparent 30%),
                      radial-gradient(circle at ${randomGradients[1].x}% ${randomGradients[1].y}%, rgba(255, 0, 255, 0.2) 0%, transparent 30%),
                      radial-gradient(circle at ${randomGradients[2].x}% ${randomGradients[2].y}%, rgba(0, 128, 255, 0.1) 0%, transparent 25%)
                    `,
                  }}
                ></motion.div>
              </div>
              
              {/* Central glowing element */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-20 h-20 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(0,255,255,0.3) 0%, rgba(0,0,0,0) 70%)",
                    boxShadow: "0 0 40px rgba(0, 255, 255, 0.3)"
                  }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                ></motion.div>
              </div>
              
              {/* Inner rotating rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-[80%] h-[80%] rounded-full border border-neon-cyan/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                
                <motion.div
                  className="w-[60%] h-[60%] rounded-full border border-neon-magenta/20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                
                <motion.div
                  className="w-[40%] h-[40%] rounded-full border border-neon-blue/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                ></motion.div>
              </div>
              
              {/* Only center digital creative space text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="p-8 relative z-10 flex flex-col gap-3 w-full"
              >
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                  className="text-2xl md:text-3xl lg:text-4xl tracking-wider text-neon-cyan font-orbitron font-bold text-left"
                >
                  Your Imagination Hub
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3, duration: 0.8 }}
                  className="text-xs md:text-sm tracking-wide text-white/70 font-space text-right"
                >
                  Turn visions into reality, one creation at a time. Unleash your imagination in this boundless space.
                </motion.p>
              </motion.div>
            </div>
            
            {/* Orbiting elements around the main circle */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = i * (Math.PI * 2 / 5);
              const radius = 300;
              const delay = i * 0.2;
              const duration = 40 + (i * 5);
              
              return (
                <motion.div
                  key={i}
                  className={cn(
                    "absolute w-4 h-4",
                    i % 3 === 0 ? "bg-neon-cyan/40" : i % 3 === 1 ? "bg-neon-magenta/40" : "bg-neon-blue/40"
                  )}
                  style={{
                    borderRadius: i % 2 === 0 ? "50%" : "0%",
                    left: "50%",
                    top: "50%",
                    marginLeft: "-8px",
                    marginTop: "-8px",
                    boxShadow: i % 3 === 0 
                      ? "0 0 10px rgba(0, 255, 255, 0.7)" 
                      : i % 3 === 1 
                        ? "0 0 10px rgba(255, 0, 255, 0.7)" 
                        : "0 0 10px rgba(0, 128, 255, 0.7)"
                  }}
                  animate={{
                    x: [
                      Math.cos(angle) * radius,
                      Math.cos(angle + Math.PI * 2) * radius
                    ],
                    y: [
                      Math.sin(angle) * radius,
                      Math.sin(angle + Math.PI * 2) * radius
                    ],
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: duration,
                    ease: "linear",
                    repeat: Infinity,
                    delay: delay,
                  }}
                />
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Entry button */}
      <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="flex justify-center items-center"
        >
          <Button 
            variant="neon" 
            size="lg" 
            onClick={() => {
              const appSection = document.getElementById('app');
              if (appSection) {
                window.scrollTo({
                  top: appSection.offsetTop - 100,
                  behavior: 'smooth'
                });
              }
            }}
            className="relative overflow-hidden border border-neon-cyan/50 bg-cyber-black/80 px-8 py-6 group hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"
          >
            <span className="relative z-10 font-orbitron text-white group-hover:text-black transition-colors duration-300">ENTER SPACE</span>
            <motion.span
              className="absolute inset-0 bg-neon-cyan"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </Button>
        </motion.div>
      </div>
      
      {/* Technical overlay elements */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-neon-cyan/30"></div>
      <div className="absolute bottom-2 left-0 right-0 h-[1px] bg-neon-cyan/20"></div>
      <div className="absolute bottom-4 left-0 right-0 h-[1px] bg-neon-cyan/10"></div>
      
      {/* Corner design elements */}
      <motion.div 
        className="absolute bottom-8 left-8 z-10 opacity-60"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="w-20 h-20 border-l-2 border-b-2 border-neon-cyan"></div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-8 right-8 z-10 opacity-60"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      >
        <div className="w-20 h-20 border-r-2 border-b-2 border-neon-magenta"></div>
      </motion.div>
    </section>
  );
}
