import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ToggleButton from './ToggleButton';
import Question from './Question';
import CursorTrail from './CursorTrail';

const App = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`relative overflow-hidden min-h-screen transition-all duration-500 ease-in-out cursor-none ${
      isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' 
             : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-black'
    }`}>
      
      {/* Enhanced background shapes */}
      <motion.div className="absolute inset-0 pointer-events-none">
        <motion.div
          key={`shape1-${isDark}`} // Add unique key that changes with isDark
          className={`absolute bottom-140 w-96 h-96 rounded-full opacity-20 blur-3xl ${
            isDark ? 'bg-gradient-to-tr from-blue-500 to-purple-600' 
                   : 'bg-gradient-to-tr from-blue-700 to-purple-700'
          }`}
          animate={{ 
            x: [0, 100, -50, 0], 
            y: [0, -80, 60, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          key={`shape2-${isDark}`} // Add unique key that changes with isDark
          className={`absolute right-0 bottom-0 w-[800px] h-[800px] rounded-full opacity-15 blur-3xl ${
            isDark ? 'bg-gradient-to-bl from-pink-500 to-yellow-400' 
                   : 'bg-gradient-to-bl from-pink-600 to-yellow-600'
          }`}
          animate={{ 
            x: [0, -120, 80, 0], 
            y: [0, 100, -110, 0],
            rotate: [0, 90, 180, 360]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
       
        <motion.div
          key={`shape3-${isDark}`} // Add unique key that changes with isDark
          className={`absolute top-120 right-260 w-196 h-196 rounded-full opacity-20 blur-3xl ${
            isDark ? 'bg-gradient-to-tr from-blue-900 to-pink-400' 
                   : 'bg-gradient-to-tr from-cyan-700 to-amber-500'
          }`}
          animate={{ 
            x: [0, 10, -5, 0], 
            y: [0, -8, 6, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.div>

      <CursorTrail isDark={isDark} />
      <ToggleButton isDark={isDark} handleToggle={() => setIsDark(!isDark)} />
      <Question isDark={isDark} />
    </div>
  );
};

export default App;