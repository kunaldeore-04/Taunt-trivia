  export default function ToggleButton({isDark, handleToggle}) {
      const text = !isDark ? "🌙" : "☀️";
    return (
      <button
     onClick={handleToggle} 
     className={`${!isDark
        ? 'bg-white/90 hover:bg-white text-gray-700 border-gray-200 shadow-gray-400/50': 
          'bg-zinc-800/50 hover:bg-zinc-700 text-yellow-300 border-zinc-400 shadow-gray-900/70'
      } absolute top-4 right-4 p-3 rounded-full border shadow-lg hover:shadow-xl text-xl transition-all duration-300 hover:rotate-25 hover:scale-110 group backdrop-blur-sm`}>
      <span className="block group-hover:scale-110 transition-transform duration-300">
        {text}
      </span>
    </button> 
    );
  }
