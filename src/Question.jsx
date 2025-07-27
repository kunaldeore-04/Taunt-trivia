import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import or define your Scorecard component
import Scorecard from './Scorecard'; // Adjust the import path as needed

// Enhanced animation variants (keeping your existing ones)
const shakeVariant = {
  initial: { x: 0, rotate: 0 },
  animate: { 
    x: [0, -10, 10, -8, 8, -4, 4, 0], 
    rotate: [0, -1, 1, -0.5, 0.5, 0],
    transition: { 
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

const pulseVariant = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.05, 1.1, 1.05, 1], 
    boxShadow: [
      "0px 0px 0px rgba(16,185,129,0)", 
      "0px 0px 8px 2px rgba(16,185,129,0.4)", 
      "0px 0px 16px 4px rgba(16,185,129,0.6)",
      "0px 0px 8px 2px rgba(16,185,129,0.4)", 
      "0px 0px 0px rgba(16,185,129,0)"
    ], 
    transition: { 
      duration: 0.8,
      ease: "easeInOut"
    } 
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const optionVariant = {
  initial: { opacity: 0, x: -20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    y: -2,
    boxShadow: "0px 8px 25px rgba(0,0,0,0.15)",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

const resultVariant = {
  initial: { opacity: 0, y: 20, scale: 0.9 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: 0.8
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

const confettiVariant = {
  initial: { scale: 0, rotate: 0 },
  animate: {
    scale: [0, 1.2, 1],
    rotate: [0, 180, 360],
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const Question = ({ isDark = false, questionsFile = '/questions.json' }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScorecard, setShowScorecard] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]); // Track user answers for scoring

  // Load questions from JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/questions.json'); 
        if (!response.ok) {
          throw new Error(`Failed to load questions: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Validate and process questions
        const processedQuestions = data.map((q, index) => {
          if (!q.question || !q.options || !Array.isArray(q.options)) {
            throw new Error(`Invalid question format at index ${index}`);
          }
          
          // Find the correct answer (first option without explicit isCorrect, or first one)
          const correctIndex = q.options.findIndex(opt => opt.isCorrect !== false) || 0;
          
          return {
            ...q,
            options: q.options.map((opt, i) => ({
              id: i + 1,
              text: opt.text,
              comment: opt.comment,
              isCorrect: i === correctIndex
            }))
          };
        });
        
        setQuestions(processedQuestions);
        setError(null);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [questionsFile]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    setIsAnswered(true);
    
    // Track user answer
    const newAnswer = {
      questionIndex: currentQuestionIndex,
      selectedOption: option,
      isCorrect: option.isCorrect,
      question: currentQuestion.question
    };
    
    setUserAnswers(prev => {
      const updated = [...prev];
      updated[currentQuestionIndex] = newAnswer;
      return updated;
    });
    
    setTimeout(() => {
      setShowResult(true);
    }, 800);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetQuestionState();
    }
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setShowResult(false);
    setIsAnswered(false);
  };

  const handleShowScore = () => {
    setShowScorecard(true);
  };

  const handleBackToQuiz = () => {
    setShowScorecard(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    resetQuestionState();
  };

  // Show Scorecard if requested
  if (showScorecard) {
    return (
      <Scorecard 
        questions={questions}
        userAnswers={userAnswers}
        onBackToQuiz={handleBackToQuiz}
        isDark={isDark}
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4`}>
        <motion.div 
          className={`p-8 rounded-2xl ${
            isDark ? 'bg-zinc-800/50 text-white' : 'bg-gray-50/10 text-zinc-800'
          }`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mx-auto mb-4"></div>
            <p className="text-lg">Loading questions...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4`}>
        <div className={`p-8 rounded-2xl text-center ${
          isDark ? 'bg-red-900/20 text-red-200 border border-red-600/30' : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          <h2 className="text-xl font-bold mb-2">Error Loading Questions</h2>
          <p className="text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No questions available
  if (!questions.length) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4`}>
        <div className={`p-8 rounded-2xl text-center ${
          isDark ? 'bg-zinc-800/50 text-white' : 'bg-gray-50/10 text-zinc-800'
        }`}>
          <p className="text-lg">No questions available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4`}>
      <motion.div 
        className={`w-full max-w-lg p-6 rounded-2xl transition-all duration-500 ease-out backdrop-blur-sm ${
          isDark 
            ? 'bg-zinc-800/50 shadow-2xl border border-zinc-600/50' 
            : 'bg-gray-50/10 shadow-2xl border border-white/50'
        }`}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        whileHover={{ 
          scale: 1.005,
          boxShadow: isDark 
            ? "0px 20px 40px rgba(0,0,0,0.4)" 
            : "0px 20px 40px rgba(0,0,0,0.1)"
        }}
        key={currentQuestionIndex} // Force re-render on question change
      >
        {/* Question Counter */}
        <div className={`text-center mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Question Header */}
        <motion.div 
          className='my-6 text-center relative'
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <motion.h1 
            className={`text-xl font-bold leading-relaxed transition-colors duration-300 ${
              isDark ? 'text-gray-100' : 'text-zinc-800'
            }`}
            animate={{
              scale: isAnswered ? [1, 1.05, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {currentQuestion.question}
          </motion.h1>
        </motion.div>

        {/* Options */}
        <motion.div 
          className='space-y-4 my-8'
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {currentQuestion.options.map((option, index) => {
            let optionStyle = `w-full p-4 rounded-xl border-2 transition-all duration-300 ease-out cursor-pointer relative overflow-hidden`;
            let variant = optionVariant;
            let animate = "animate";
            
            const rippleStyle = "absolute inset-0 opacity-0 transition-opacity duration-300";
            
            if (selectedOption) {
              if (option.isCorrect && option.id === selectedOption.id) {
                variant = pulseVariant;
                animate = "animate";
                optionStyle += isDark 
                  ? ' bg-emerald-900/60 border-emerald-500/80 text-emerald-100 shadow-lg shadow-emerald-500/20' 
                  : ' bg-emerald-100 border-emerald-400 text-emerald-800 shadow-lg shadow-emerald-500/20';
              } else if (!option.isCorrect && option.id === selectedOption.id) {
                variant = shakeVariant;
                animate = "animate";
                optionStyle += isDark 
                  ? ' bg-red-900/40 border-red-500/60 text-red-200 shadow-lg shadow-red-500/20' 
                  : ' bg-red-100 border-red-400 text-red-800 shadow-lg shadow-red-500/20';
              } else {
                if (option.isCorrect) {
                  optionStyle += isDark 
                    ? ' bg-emerald-900/30 border-emerald-600/40 text-emerald-200' 
                    : ' bg-emerald-50 border-emerald-300 text-emerald-700';
                } else {
                  optionStyle += isDark 
                    ? ' border-zinc-600/50 text-zinc-400 opacity-60' 
                    : ' bg-zinc-100/50 border-zinc-300 text-zinc-500 opacity-60';
                }
              }
            } else {
              optionStyle += isDark 
                ? ' border-zinc-600/70 text-white hover:border-zinc-500 hover:bg-zinc-700/50' 
                : ' bg-zinc-50/50 border-zinc-300 text-zinc-800 hover:border-zinc-400 hover:bg-zinc-100/80';
            }

            return (
              <motion.button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className={optionStyle}
                variants={variant}
                initial="initial"
                animate={animate}
                whileHover={!selectedOption ? "hover" : {}}
                whileTap={!selectedOption ? "tap" : {}}
                disabled={selectedOption !== null}
                style={{ zIndex: selectedOption?.id === option.id ? 10 : 1 }}
              >
                <div className='flex items-center justify-between relative z-10'>
                  <span className="font-medium text-left">{option.text}</span>
                  
                  {/* Success/Error Icons */}
                  <AnimatePresence>
                    {selectedOption && (
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        {option.isCorrect ? (
                          <motion.div 
                            className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                            variants={confettiVariant}
                            initial="initial"
                            animate="animate"
                          >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        ) : option.id === selectedOption.id ? (
                          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        ) : null}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <motion.div
                  className={`${rippleStyle} ${
                    isDark ? 'bg-white/10' : 'bg-zinc-900/5'
                  }`}
                  whileHover={{ opacity: 1 }}
                />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Result Message */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              className="text-center"
              variants={resultVariant}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div
                className={`p-4 rounded-xl mb-6 ${
                  selectedOption?.isCorrect
                    ? isDark
                      ? 'bg-emerald-900/30 text-emerald-200 border border-emerald-600/30'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : isDark
                      ? 'bg-red-900/30 text-red-200 border border-red-600/30'
                      : 'bg-red-100 text-red-800 border border-red-300'
                }`}
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 1,
                  delay: 0.2
                }}
              >
                <motion.p 
                  className="font-semibold text-lg mb-2"
                  animate={{
                    y: [0, -2, 0]
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3
                  }}
                >
                  {selectedOption?.isCorrect ? '🎉 Correct!' : '❌ Incorrect!'}
                </motion.p>
                <p className="text-sm leading-relaxed">
                  {selectedOption?.comment || (selectedOption?.isCorrect 
                    ? 'Well done!' 
                    : `The correct answer is: ${currentQuestion.options.find(opt => opt.isCorrect)?.text}`)}
                </p>
              </motion.div>
              
              {/* Navigation Button */}
              <div className="flex justify-center">
                {currentQuestionIndex < questions.length - 1 ? (
                  <motion.button
                    onClick={handleNext}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isDark
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } shadow-lg hover:shadow-xl`}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Next Question
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleShowScore}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isDark
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    } shadow-lg hover:shadow-xl`}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Show Score 📊
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Question;
