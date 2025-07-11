import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Star, RotateCcw } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { generateExercise } from '../utils/exerciseGenerator';
import ConfettiAnimation from './ConfettiAnimation';

function ExerciseArea() {
  const { grado } = useParams();
  const navigate = useNavigate();
  const { updateProgress, addReward } = useProgress();
  
  // Verificar si hay un estudiante logueado
  const currentStudent = JSON.parse(localStorage.getItem('currentStudent') || 'null');
  
  const [currentExercise, setCurrentExercise] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState({
    show: false,
    correct: false,
    message: ''
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);

  const handleBackNavigation = () => {
    // Si hay un estudiante logueado, ir a selección de grados
    // Si no, ir al menú principal
    if (currentStudent) {
      navigate('/grados');
    } else {
      navigate('/');
    }
  };
  useEffect(() => {
    if (grado) {
      generateNewExercise();
    }
  }, [grado]);

  const generateNewExercise = () => {
    if (grado) {
      const exercise = generateExercise(parseInt(grado));
      setCurrentExercise(exercise);
      setUserAnswer('');
      setFeedback({ show: false, correct: false, message: '' });
    }
  };

  const checkAnswer = () => {
    if (!currentExercise || userAnswer === '') return;

    const userNumAnswer = parseFloat(userAnswer);
    const correct = Math.abs(userNumAnswer - currentExercise.answer) < 0.01;
    
    setFeedback({
      show: true,
      correct,
      message: correct ? 
        '¡Excelente! 🎉 ¡Respuesta correcta!' : 
        `No es correcto. La respuesta era ${currentExercise.answer}`
    });

    if (correct) {
      setShowConfetti(true);
      setStreak(prev => prev + 1);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Check for streak rewards
      if (streak + 1 === 5) {
        addReward('🔥 Racha de 5 respuestas correctas');
      } else if (streak + 1 === 10) {
        addReward('🚀 Racha de 10 respuestas correctas');
      }
    } else {
      setStreak(0);
    }

    updateProgress(grado, correct);

    setTimeout(() => {
      generateNewExercise();
    }, 2500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  if (!currentExercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Cargando ejercicio...</div>
      </div>
    );
  }

  const gradeInfo = {
    '4': { title: 'Cuarto Grado', color: 'from-green-400 to-green-600' },
    '5': { title: 'Quinto Grado', color: 'from-blue-400 to-blue-600' },
    '6': { title: 'Sexto Grado', color: 'from-purple-400 to-purple-600' }
  };

  const currentGradeInfo = gradeInfo[grado];

  return (
    <div className="min-h-screen p-4">
      {showConfetti && <ConfettiAnimation />}
      
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackNavigation}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {currentStudent ? 'Grados' : 'Inicio'}
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">{currentGradeInfo?.title}</h1>
            {streak > 0 && (
              <div className="flex items-center gap-1 justify-center mt-1">
                <span className="text-yellow-300">🔥</span>
                <span className="text-white font-bold">Racha: {streak}</span>
              </div>
            )}
          </div>
          
          <button
            onClick={generateNewExercise}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Nuevo
          </button>
        </div>

        {/* Exercise Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          
          {/* Exercise Content */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                {currentExercise.type}
              </span>
            </div>

            {currentExercise.problem && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {currentExercise.problem}
                </p>
              </div>
            )}

            <div className="text-4xl font-bold text-gray-800 mb-8 font-mono">
              {currentExercise.question}
            </div>

            {/* Answer Input */}
            <div className="max-w-md mx-auto">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu respuesta"
                className="w-full text-center text-2xl font-bold p-4 border-3 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                disabled={feedback.show}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={checkAnswer}
              disabled={userAnswer === '' || feedback.show}
              className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl text-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verificar Respuesta
            </button>
          </div>

          {/* Feedback */}
          {feedback.show && (
            <div className={`text-center p-4 rounded-xl ${feedback.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {feedback.correct ? (
                  <>
                    <Check className="w-6 h-6" />
                    <Star className="w-6 h-6 text-yellow-500" />
                  </>
                ) : (
                  <X className="w-6 h-6" />
                )}
              </div>
              <p className="text-lg font-bold">{feedback.message}</p>
              {currentExercise.explanation && (
                <p className="mt-2 text-sm opacity-80">{currentExercise.explanation}</p>
              )}
            </div>
          )}
        </div>

        {/* Encouragement */}
        <div className="text-center">
          <p className="text-white/80 text-lg">
            💪 ¡Sigue así! Cada ejercicio te hace más fuerte en matemáticas
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExerciseArea;