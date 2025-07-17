import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Trophy, TrendingUp, Star, Target, Users, LogOut } from 'lucide-react';
import { FaUser, FaStar, FaTrophy, FaPuzzlePiece, FaChalkboardTeacher, FaMedal, FaRocket, FaRainbow, FaHandPaper } from 'react-icons/fa';
import { GiBearFace, GiRabbit, GiOwl } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import StudentService from '../services/StudentService';
import RewardService from '../services/RewardService';

function StudentDashboard() {
  const navigate = useNavigate();
  const { studentData, token, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unlockedRewardsCount, setUnlockedRewardsCount] = useState(0);
  const [totalExercisesCompleted, setTotalExercisesCompleted] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !studentData?.id) {
        setLoading(false);
        setError('No authentication token or student data found.');
        return;
      }
      try {
        // Fetch unlocked rewards count
        const unlocked = await RewardService.getUnlockedRewardsByStudent(studentData.id, token);
        setUnlockedRewardsCount(unlocked.length);

        // Fetch total exercises completed (assuming a new endpoint for this)
        // For now, I'll use a placeholder or derive from progress if available
        // This would ideally come from a backend endpoint like /api/progreso-estudiantes/countCompleted
        const progressResponse = await StudentService.getStudentProgress(studentData.id, token);
        setTotalExercisesCompleted(progressResponse.length); // Assuming each entry is a completed exercise

      } catch (err) {
        setError(err.message || 'Failed to load student dashboard data.');
        console.error('Error fetching student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, studentData]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-800 text-xl">Cargando...</div>
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

  // Reemplazo los arrays subjects y quickStats para usar íconos de react-icons en vez de emojis
  const subjects = [
    {
      id: 'matematicas',
      title: 'Matemáticas',
      icon: <FaChalkboardTeacher size={48} className="text-indigo-600 mx-auto" />, // se mantiene
      character: <GiRabbit size={32} className="text-indigo-600 mx-auto" />, // conejo violeta
      characterName: 'Mateo',
      color: 'from-blue-400 to-purple-500',
      description: 'Suma, resta, multiplicación y más',
      action: () => navigate('/grados')
    },
    {
      id: 'geometria',
      title: 'Geometría',
      icon: <FaPuzzlePiece size={48} className="text-yellow-600 mx-auto" />,
      character: <GiBearFace size={32} className="text-yellow-600 mx-auto" />, // oso amarillo
      characterName: 'Bruno',
      color: 'from-green-400 to-teal-500',
      description: 'Formas, figuras y medidas',
      action: () => navigate('/grados')
    },
    {
      id: 'problemas',
      title: 'Problemas',
      icon: <FaPuzzlePiece size={48} className="text-purple-600 mx-auto" />,
      character: <GiOwl size={32} className="text-purple-600 mx-auto" />, // búho morado
      characterName: 'Olivia',
      color: 'from-orange-400 to-red-500',
      description: 'Resuelve problemas divertidos',
      action: () => navigate('/grados')
    }
  ];
  const quickStats = [
    { label: 'Estrellas', value: studentData?.puntos_recompensa || 0, icon: <FaStar />, color: 'bg-yellow-400' },
    { label: 'Ejercicios', value: totalExercisesCompleted, icon: <FaPuzzlePiece />, color: 'bg-blue-400' },
    { label: 'Premios', value: unlockedRewardsCount, icon: <FaTrophy />, color: 'bg-purple-400' },
    { label: 'Nivel', value: (studentData?.puntos_recompensa || 0) < 10 ? 'Principiante' : (studentData?.puntos_recompensa || 0) < 50 ? 'Intermedio' : 'Avanzado', icon: <FaRocket />, color: 'bg-green-400' }
  ];

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 text-6xl animate-pulse opacity-30 flex justify-center items-center"><FaStar className="text-white" /></div>
        <div className="absolute bottom-20 left-10 text-5xl animate-bounce opacity-30 flex justify-center items-center"><FaMedal className="text-white" /></div>
        <div className="absolute top-1/2 right-20 text-4xl animate-pulse opacity-30 flex justify-center items-center"><FaRocket className="text-white" /></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header con información del estudiante */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-red-600 px-6 py-3 rounded-full hover:bg-white transition-all shadow-lg font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Salir
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  ¡Hola, {studentData?.nombre?.split(' ')[0]}! <FaHandPaper className="inline ml-2" />
                </h1>
                <p className="text-xl text-gray-700">
                  {studentData?.grado}° Grado • Código: {studentData?.codigo_alumno}
                </p>
              </div>
            </div>
            <p className="text-lg text-gray-600">¿Qué quieres aprender hoy?</p>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg text-center transform hover:scale-105 transition-all">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2 text-2xl`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Materias principales */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            <FaChalkboardTeacher className="inline mr-2" /> Elige tu Materia Favorita
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                onClick={subject.action}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className={`bg-gradient-to-r ${subject.color} p-8 text-white relative`}>
                  <div className="text-6xl mb-4">{subject.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{subject.title}</h3>
                  <p className="text-white/90">{subject.description}</p>
                  
                  {/* Personaje guía */}
                  <div className="absolute top-4 right-4 bg-white/20 rounded-full p-3">
                    <div className="text-3xl">{subject.character}</div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-700">
                      Con {subject.characterName}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-gray-700">
                        {studentData?.puntos_recompensa || 0}
                      </span>
                    </div>
                  </div>
                  
                  <button className={`w-full bg-gradient-to-r ${subject.color} text-white py-3 rounded-xl font-bold hover:shadow-lg transform group-hover:scale-105 transition-all drop-shadow`}>¡Empezar Aventura!</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => navigate('/progreso')}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer transform hover:scale-105 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-3xl">
                📊
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Mi Progreso</h3>
                <p className="text-gray-600">Ve qué tan bien lo estás haciendo</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/recompensas')}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer transform hover:scale-105 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl">
                🏆
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Mis Premios</h3>
                <p className="text-gray-600">Mira todas tus medallas y trofeos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje motivacional personalizado */}
        <div className="text-center mt-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-3xl p-8 shadow-xl">
          <div className="text-6xl mb-4 flex justify-center items-center"><FaRainbow className="text-white drop-shadow-lg" /></div>
          <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
            ¡{studentData?.nombre?.split(' ')[0]}, eres increíble!
          </h3>
          <p className="text-white/90 text-lg drop-shadow">
            Cada día que practicas te vuelves más inteligente. ¡Sigue así!
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;