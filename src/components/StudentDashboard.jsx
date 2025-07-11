import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Trophy, TrendingUp, Star, Target, Users, LogOut } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

function StudentDashboard() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [currentStudent, setCurrentStudent] = useState(null);

  useEffect(() => {
    const studentData = localStorage.getItem('currentStudent');
    if (studentData) {
      setCurrentStudent(JSON.parse(studentData));
    } else {
      // Si no hay estudiante logueado, redirigir al menú principal
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentStudent');
    navigate('/');
  };

  if (!currentStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  const subjects = [
    {
      id: 'matematicas',
      title: 'Matemáticas',
      icon: '🔢',
      character: '🦊',
      characterName: 'Mateo',
      color: 'from-blue-400 to-purple-500',
      description: 'Suma, resta, multiplicación y más',
      action: () => navigate('/grados')
    },
    {
      id: 'geometria',
      title: 'Geometría',
      icon: '📐',
      character: '🐻',
      characterName: 'Bruno',
      color: 'from-green-400 to-teal-500',
      description: 'Formas, figuras y medidas',
      action: () => navigate('/grados')
    },
    {
      id: 'problemas',
      title: 'Problemas',
      icon: '🧩',
      character: '🦉',
      characterName: 'Olivia',
      color: 'from-orange-400 to-red-500',
      description: 'Resuelve problemas divertidos',
      action: () => navigate('/grados')
    }
  ];

  const quickStats = [
    { label: 'Estrellas', value: progress.totalStars, icon: '⭐', color: 'bg-yellow-400' },
    { label: 'Ejercicios', value: progress.grade4.completed + progress.grade5.completed + progress.grade6.completed, icon: '📝', color: 'bg-blue-400' },
    { label: 'Premios', value: progress.rewards.length, icon: '🏆', color: 'bg-purple-400' },
    { label: 'Nivel', value: progress.totalStars < 10 ? 'Principiante' : progress.totalStars < 50 ? 'Intermedio' : 'Avanzado', icon: '🎯', color: 'bg-green-400' }
  ];

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 text-6xl animate-pulse opacity-30">🌟</div>
        <div className="absolute bottom-20 left-10 text-5xl animate-bounce opacity-30">⭐</div>
        <div className="absolute top-1/2 right-20 text-4xl animate-pulse opacity-30">✨</div>
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
              <div className="text-6xl">{currentStudent.avatar}</div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  ¡Hola, {currentStudent.name.split(' ')[0]}! 👋
                </h1>
                <p className="text-xl text-gray-700">
                  {currentStudent.grade}° Grado • Código: {currentStudent.code}
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
            🎓 Elige tu Materia Favorita
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
                        {subject.id === 'matematicas' ? progress.totalStars : Math.floor(progress.totalStars / 3)}
                      </span>
                    </div>
                  </div>
                  
                  <button className={`w-full bg-gradient-to-r ${subject.color} text-white py-3 rounded-xl font-bold hover:shadow-lg transform group-hover:scale-105 transition-all`}>
                    ¡Empezar Aventura!
                  </button>
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
          <div className="text-6xl mb-4">🌈</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            ¡{currentStudent.name.split(' ')[0]}, eres increíble! 🌟
          </h3>
          <p className="text-white/90 text-lg">
            Cada día que practicas te vuelves más inteligente. ¡Sigue así!
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;