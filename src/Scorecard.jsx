// Scorecard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Scorecard = ({ questions, userAnswers, onBackToQuiz, isDark = false }) => {
  const correctAnswers = userAnswers.filter(answer => answer?.isCorrect).length;
  const totalQuestions = questions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getScoreMessage = () => {
    if (percentage >= 80) return { message: "Excellent! 🎉", color: "emerald" };
    if (percentage >= 60) return { message: "Good job! 👍", color: "blue" };
    if (percentage >= 40) return { message: "Not bad! 📈", color: "yellow" };
    return { message: "Keep practicing! 💪", color: "red" };
  };

  const scoreInfo = getScoreMessage();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className={`w-full max-w-2xl p-8 rounded-2xl ${
          isDark 
            ? 'bg-zinc-800/50 shadow-2xl border border-zinc-600/50 text-white' 
            : 'bg-gray-50/10 shadow-2xl border border-white/50 text-zinc-800'
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-bold mb-4"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Quiz Complete!
          </motion.h1>
          
          <motion.div
            className={`text-6xl font-bold mb-4 text-${scoreInfo.color}-500`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            {percentage}%
          </motion.div>
          
          <motion.p
            className="text-xl mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {scoreInfo.message}
          </motion.p>
          
          <motion.p
            className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            You got {correctAnswers} out of {totalQuestions} questions correct
          </motion.p>
        </div>

        <motion.button
          onClick={onBackToQuiz}
          className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isDark
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } shadow-lg hover:shadow-xl`}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          Take Quiz Again
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Scorecard;
