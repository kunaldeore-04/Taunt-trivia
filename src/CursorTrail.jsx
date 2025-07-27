import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

function CursorTrail({isDark}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  useEffect(() => {
    x.set(position.x);
    y.set(position.y);
  }, [position, x, y]);

  
  useEffect(() => {
    const newDot = { 
      id: Date.now(), 
      x: position.x, 
      y: position.y 
    };
    setTrail(prev => [...prev.slice(-8), newDot]); 
  }, [position]);

  return (
    <>
      <AnimatePresence>
        {trail.map((dot) => (
          <motion.div
            key={dot.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0, 0.41, 0.2, 1.01] }}
            className={`fixed pointer-events-none w-3 h-3 rounded-full z-40 ${isDark ? 'bg-red-400/50' : 'bg-blue-500/50'}`}
            style={{
              left: dot.x - 6,
              top: dot.y - 6,
            }}
          />
        ))}
      </AnimatePresence>

      
    </>
  );
}

export default CursorTrail;
