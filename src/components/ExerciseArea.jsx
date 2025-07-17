import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Star, RotateCcw } from 'lucide-react';
import { FaStar, FaFire, FaTrophy, FaSmile, FaRocket } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ExerciseService from '../services/ExerciseService';
import StudentService from '../services/StudentService';
import ConfettiAnimation from './ConfettiAnimation';

function ExerciseArea() {
  const { grado } = useParams();
  const navigate = useNavigate();
  const { studentData, token, updateStudentPoints } = useAuth();
  
  const [availableExercises, setAvailableExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState({
    show: false,
    correct: false,
    message: ''
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalExercisesCount, setTotalExercisesCount] = useState(0);
  const [completedExercisesCount, setCompletedExercisesCount] = useState(0);
  const [allExercisesCompleted, setAllExercisesCompleted] = useState(false);

  const handleBackNavigation = () => {
    if (studentData) {
      navigate('/grados');
    } else {
      navigate('/');
    }
  };

  const fetchExerciseData = useCallback(async () => {
    if (!token || !studentData?.id) {
      setLoading(false);
      setError('No authentication token or student data found.');
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const gradeInt = parseInt(grado);

      // Fetch all exercises for the grade
      const allExercises = await ExerciseService.getAllExercises(token, gradeInt);
      const completedExerciseIds = await StudentService.getCompletedExercisesByStudentAndGrade(studentData.id, gradeInt, token);

      const uncompletedExercises = allExercises.filter(
        (exercise) => !completedExerciseIds.includes(exercise.id)
      );

      setAvailableExercises(uncompletedExercises);

      // Fetch total count of exercises for the grade
      const totalCount = await ExerciseService.getTotalExercisesCountByGrade(gradeInt, token);
      setTotalExercisesCount(totalCount);

      // Update completed exercises count based on the fetched completedExerciseIds
      setCompletedExercisesCount(completedExerciseIds.length);

      if (totalCount > 0 && uncompletedExercises.length === 0) {
        setAllExercisesCompleted(true);
        setCurrentExercise(null); // No more exercises to show
      } else if (uncompletedExercises.length > 0) {
        const randomIndex = Math.floor(Math.random() * uncompletedExercises.length);
        setCurrentExercise(uncompletedExercises[randomIndex]);
        setAllExercisesCompleted(false);
      } else { // This means uncompletedExercises.length is 0 and totalCount is also 0 (or less than 0, which shouldn't happen)
        setCurrentExercise(null);
        setAllExercisesCompleted(false);
        // Do NOT set error here, let !currentExercise handle the message
      }
    } catch (err) {
      setError(err.message || 'Failed to load exercise data.');
      console.error('Error fetching exercise data:', err);
    } finally {
      setLoading(false);
    }
  }, [grado, token, studentData]);

  useEffect(() => {
    fetchExerciseData();
  }, [fetchExerciseData]);

  const generateNewExercise = () => {
    if (availableExercises.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableExercises.length);
      setCurrentExercise(availableExercises[randomIndex]);
      setUserAnswer('');
      setFeedback({ show: false, correct: false, message: '' });
    } else {
      setError('No hay ejercicios disponibles para este grado.');
    }
  };

  const checkAnswer = async () => {
    if (!currentExercise || userAnswer === '') return;

    const correct = userAnswer.toLowerCase() === currentExercise.respuesta_correcta.toLowerCase();
    
    setFeedback({
      show: true,
      correct,
      message: correct ? '¡Excelente! ' : `No es correcto. La respuesta era ${currentExercise.respuesta_correcta}`
    });

    if (correct) {
      setShowConfetti(true);
      setStreak(prev => prev + 1);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setStreak(0);
    }

    // Record progress
    if (studentData && token) {
      try {
        await StudentService.recordProgress({
          estudiante_id: studentData.id,
          ejercicio_id: currentExercise.id,
          respuesta_enviada: userAnswer,
          es_correcta: correct
        }, token);
        // After recording progress, re-fetch data to update counts and potentially get a new exercise
        await fetchExerciseData(); 
        // Update student points in AuthContext
        if (correct) {
          const updatedStudent = await StudentService.getStudentById(studentData.id, token); // Fetch latest student data
          updateStudentPoints(updatedStudent);
        } 
      } catch (err) {
        console.error('Error recording progress:', err);
      }
    }

    // Clear feedback after a short delay, and fetch new exercise data
    setTimeout(() => {
      setFeedback({ show: false, correct: false, message: '' });
      setUserAnswer('');
      // fetchExerciseData() is already called after recording progress, so no need to call it again here.
    }, 2500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-800 text-xl">Cargando ejercicio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (allExercisesCompleted && totalExercisesCount > 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md">
          <h2 className="text-3xl font-bold text-green-600 mb-4">¡Felicidades! <FaTrophy className="inline ml-2" /></h2>
          <p className="text-xl text-gray-800 mb-6">
            Has completado todos los ejercicios de este grado.
            Tu maestro agregará muchos más pronto.
          </p>
          <button
            onClick={handleBackNavigation}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl text-lg font-bold hover:shadow-lg transition-all"
          >
            Volver a Grados
          </button>
        </div>
      </div>
    );
  }

  if (!currentExercise) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Oops!</h2>
          <p className="text-xl text-gray-800 mb-6">
            No hay ejercicios disponibles para este grado, intenta pasar por aquí más tarde.
          </p>
          <button
            onClick={handleBackNavigation}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl text-lg font-bold hover:shadow-lg transition-all"
          >
            Volver atrás
          </button>
        </div>
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
    <div className="min-h-screen p-4 bg-gradient-to-br from-slate-50 to-blue-50">
      {showConfetti && <ConfettiAnimation />}
      
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackNavigation}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {studentData ? 'Grados' : 'Inicio'}
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">{currentGradeInfo?.title}</h1>
            {streak > 0 && (
              <div className="flex items-center gap-1 justify-center mt-1">
                <FaFire className="text-yellow-300" />
                <span className="text-gray-800 font-bold">Racha: {streak}</span>
              </div>
            )}
          </div>
          
          <button
            onClick={generateNewExercise}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full hover:bg-white/30 transition-all"
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
                {currentExercise.tipo_operacion}
              </span>
            </div>

            <div className="text-4xl font-bold text-gray-800 mb-8 font-mono">
              {currentExercise.pregunta}
            </div>

            {/* Answer Input */}
            <div className="max-w-md mx-auto">
              <input
                type="text" // Changed to text to allow non-numeric answers
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
            </div>
          )}
        </div>

        {/* Encouragement */}
        <div className="text-center">
          <p className="text-gray-600 text-lg">
            <FaRocket className="inline mr-2" /> ¡Sigue así! Cada ejercicio te hace más fuerte en matemáticas
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExerciseArea;