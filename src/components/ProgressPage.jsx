import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Star, Target, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StudentService from '../services/StudentService';
import { FaStar, FaTrophy } from 'react-icons/fa';

function ProgressPage() {
  const navigate = useNavigate();
  const { studentData, token } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!token || !studentData?.id) {
        setLoading(false);
        setError('No authentication token or student data found.');
        return;
      }
      try {
        setLoading(true);
        const data = await StudentService.getStudentProgress(studentData.id, token);
        setProgressData(data);
      } catch (err) {
        setError(err.message || 'Failed to load progress data.');
        console.error('Error fetching progress data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [token, studentData]);

  const handleBackNavigation = () => {
    if (studentData) {
      navigate('/estudiante');
    } else {
      navigate('/');
    }
  };

  const grades = [
    { id: '4', title: 'Cuarto Grado', color: 'from-green-400 to-green-600' },
    { id: '5', title: 'Quinto Grado', color: 'from-blue-400 to-blue-600' },
    { id: '6', title: 'Sexto Grado', color: 'from-purple-400 to-purple-600' }
  ];

  // Aggregate progress data
  const aggregatedProgress = grades.reduce((acc, grade) => {
    acc[grade.id] = {
      completed: 0,
      total: 0,
      stars: 0,
      correctAnswers: 0,
      totalAttempts: 0,
      uniqueExercises: new Set()
    };
    return acc;
  }, {});

  progressData.forEach(p => {
    const gradeId = p.ejercicio.grado.toString();
    if (aggregatedProgress[gradeId]) {
      aggregatedProgress[gradeId].totalAttempts++;
      if (p.es_correcta) {
        aggregatedProgress[gradeId].correctAnswers++;
        aggregatedProgress[gradeId].stars++; // Assuming 1 star per correct answer
      }
      aggregatedProgress[gradeId].uniqueExercises.add(p.ejercicio.id);
    }
  });

  // Calculate total completed and total exercises (unique exercises attempted)
  let totalCompleted = 0;
  let totalStars = 0;
  let totalUniqueExercisesAttempted = new Set();

  Object.values(aggregatedProgress).forEach(gradeStats => {
    totalCompleted += gradeStats.correctAnswers; // Counting correct attempts as completed for now
    totalStars += gradeStats.stars;
    gradeStats.total = gradeStats.uniqueExercises.size; // Total unique exercises attempted in this grade
    gradeStats.completed = gradeStats.correctAnswers; // For simplicity, correct answers = completed
    gradeStats.uniqueExercises.forEach(exerciseId => totalUniqueExercisesAttempted.add(exerciseId));
  });

  const overallPercentage = totalUniqueExercisesAttempted.size > 0 ? (totalCompleted / totalUniqueExercisesAttempted.size) * 100 : 0;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando progreso...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackNavigation}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {studentData ? 'Mi Dashboard' : 'Inicio'}
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 text-center flex-1">
            Mi Progreso
          </h1>
          
          <div className="w-20"></div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{totalStars}</div>
            <div className="text-gray-600">Estrellas Totales</div>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{totalCompleted}</div>
            <div className="text-gray-600">Ejercicios Completados</div>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{Math.round(overallPercentage)}%</div>
            <div className="text-gray-600">Progreso General</div>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{studentData?.puntos_recompensa || 0}</div>
            <div className="text-gray-600">Puntos de Recompensa</div>
          </div>
        </div>

        {/* Grade Progress */}
        <div className="space-y-6">
          {grades.map((grade) => {
            const gradeStats = aggregatedProgress[grade.id];
            const percentage = gradeStats.total > 0 ? 
              (gradeStats.completed / gradeStats.total) * 100 : 0;
            
            return (
              <div key={grade.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className={`bg-gradient-to-r ${grade.color} p-6 text-white`}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">{grade.title}</h3>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-300" />
                      <span className="font-bold">{gradeStats.stars}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-700">Progreso</span>
                    <span className="text-gray-600">
                      {gradeStats.completed} de {gradeStats.total} ejercicios
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div
                      className={`bg-gradient-to-r ${grade.color} h-4 rounded-full transition-all duration-1000 relative`}
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xs font-bold">
                        {Math.round(percentage)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => navigate(`/ejercicios/${grade.id}`)}
                      className={`bg-gradient-to-r ${grade.color} text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all`}
                    >
                      Continuar Practicando
                    </button>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">{Math.round(percentage)}%</div>
                      <div className="text-sm text-gray-600">Completado</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivational Message */}
        <div className="text-center mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Sigue así! <FaStar className="inline ml-2" />
          </h3>
          <p className="text-gray-600 text-lg">
            Cada ejercicio que resuelves te acerca más a ser un experto en matemáticas.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;