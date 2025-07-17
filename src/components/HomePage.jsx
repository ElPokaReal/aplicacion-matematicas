import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Star, Users, BookOpen, Play, LogIn, ArrowLeft } from 'lucide-react';
import { GiBearFace, GiRabbit, GiOwl } from 'react-icons/gi';
import { FaStar, FaTrophy, FaPuzzlePiece } from 'react-icons/fa';

function HomePage() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleTeacherLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/maestro/login');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Botón de regreso al menú principal */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => navigate('/')}
          className="bg-white/90 backdrop-blur-sm text-indigo-600 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Menú Principal
        </button>
      </div>

      {/* Botón de Maestro */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleTeacherLogin}
          className="bg-white/90 backdrop-blur-sm text-indigo-600 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium cursor-pointer"
          type="button"
        >
          <LogIn className="w-4 h-4" />
          ¿Eres maestro? Inicia Sesión
        </button>
      </div>

      {/* Elementos decorativos flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-pink-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-green-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-40 w-14 h-14 bg-blue-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10">
        <div className={`text-center transform transition-all duration-1000 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Logo y Título */}
          <div className="mb-12">
            <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-4 drop-shadow-lg">
              MateAventuras
            </h1>
            <p className="text-3xl text-gray-700 font-medium mb-2">
              ¡Descubre la magia de las matemáticas!
            </p>
            <p className="text-xl text-gray-600">
              Aprende jugando con ejercicios súper divertidos
            </p>
          </div>

          {/* Características con animales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-5xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex justify-center items-center text-center mb-4">
                <GiRabbit className="text-indigo-600" size={48} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Aprende Jugando</h3>
              <p className="text-gray-600">Con Conejo Rápido resuelve ejercicios súper divertidos</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex justify-center items-center mb-4">
                <GiBearFace className="text-yellow-600" size={48} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Gana Premios</h3>
              <p className="text-gray-600">Oso Sabio te dará medallas y trofeos especiales</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex justify-center items-center mb-4">
                <GiOwl className="text-purple-600" size={48} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Sigue tu Progreso</h3>
              <p className="text-gray-600">Búho Inteligente registra todos tus logros</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/estudiante')}
              className="group bg-gradient-to-r from-green-400 to-blue-500 text-white px-12 py-6 rounded-full text-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-4 mx-auto drop-shadow"
            >
              <Play className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              ¡Empezar mi Aventura!
            </button>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/progreso')}
                className="bg-white/80 backdrop-blur-sm text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaPuzzlePiece className="inline mr-2" /> Mi Progreso
              </button>
              <button
                onClick={() => navigate('/recompensas')}
                className="bg-white/80 backdrop-blur-sm text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaTrophy className="inline mr-2" /> Mis Premios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;