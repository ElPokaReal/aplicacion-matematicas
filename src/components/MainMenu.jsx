import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, Star, ArrowRight } from 'lucide-react';

function MainMenu() {
  const navigate = useNavigate();
  const [showStudentLogin, setShowStudentLogin] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Elementos decorativos flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-pink-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-green-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-40 w-14 h-14 bg-blue-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10">
        
        {/* Logo y Título Principal */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-2 md:mb-4 drop-shadow-lg">
            🌟 MateAventura
          </h1>
          <p className="text-xl md:text-3xl text-gray-700 font-medium mb-1 md:mb-2">
            ¡Descubre la magia de las matemáticas!
          </p>
          <p className="text-base md:text-xl text-gray-600">
            Elige cómo quieres acceder a la plataforma
          </p>
        </div>

        {/* Opciones de Acceso */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto mb-6 md:mb-8 w-full">
          
          {/* Acceso para Estudiantes */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Soy Estudiante</h2>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-lg">
                Accede con tu código especial y comienza a aprender jugando
              </p>
              <button
                onClick={() => setShowStudentLogin(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 md:py-4 rounded-xl text-lg md:text-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2 md:gap-3"
              >
                <Users className="w-5 h-5 md:w-6 md:h-6" />
                Acceder como Estudiante
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          {/* Acceso para Maestros */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <GraduationCap className="w-8 h-8 md:w-12 md:h-12 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Soy Maestro</h2>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-lg">
                Gestiona estudiantes, crea ejercicios y monitorea el progreso
              </p>
              <button
                onClick={() => navigate('/maestro/login')}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 md:py-4 rounded-xl text-lg md:text-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2 md:gap-3"
              >
                <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
                Acceder como Maestro
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Características destacadas */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 max-w-3xl mx-auto w-full">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">✨ ¿Qué puedes hacer en MateAventura?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-center">
            <div className="p-3 md:p-4">
              <div className="text-3xl md:text-4xl mb-1 md:mb-2">🎮</div>
              <p className="font-semibold text-gray-700 text-sm md:text-base">Juegos Educativos</p>
              <p className="text-xs md:text-sm text-gray-600">Aprende matemáticas jugando</p>
            </div>
            <div className="p-3 md:p-4">
              <div className="text-3xl md:text-4xl mb-1 md:mb-2">🏆</div>
              <p className="font-semibold text-gray-700 text-sm md:text-base">Premios y Medallas</p>
              <p className="text-xs md:text-sm text-gray-600">Gana recompensas por tu esfuerzo</p>
            </div>
            <div className="p-3 md:p-4">
              <div className="text-3xl md:text-4xl mb-1 md:mb-2">📊</div>
              <p className="font-semibold text-gray-700 text-sm md:text-base">Seguimiento</p>
              <p className="text-xs md:text-sm text-gray-600">Ve tu progreso en tiempo real</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Login para Estudiantes */}
      {showStudentLogin && (
        <StudentLoginModal 
          onClose={() => setShowStudentLogin(false)}
          onSuccess={() => navigate('/estudiante')}
        />
      )}
    </div>
  );
}

// Componente del Modal de Login para Estudiantes
function StudentLoginModal({ onClose, onSuccess }) {
  const [studentCode, setStudentCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Códigos de estudiantes simulados (en producción vendrían de la base de datos)
  const validCodes = [
    { code: 'ANA2024', name: 'Ana García', grade: 4, avatar: '👧' },
    { code: 'CARLOS2024', name: 'Carlos Mendoza', grade: 5, avatar: '👦' },
    { code: 'MARIA2024', name: 'María López', grade: 6, avatar: '👧' },
    { code: 'DIEGO2024', name: 'Diego Ruiz', grade: 4, avatar: '👦' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simular verificación del código
    setTimeout(() => {
      const student = validCodes.find(s => s.code.toLowerCase() === studentCode.toLowerCase());
      
      if (student) {
        // Guardar datos del estudiante en localStorage
        localStorage.setItem('currentStudent', JSON.stringify(student));
        onSuccess();
      } else {
        setError('Código incorrecto. Pide ayuda a tu maestro.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm md:max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">¡Hola Estudiante! 👋</h2>
          <p className="text-gray-600 text-sm md:text-base">Escribe tu código especial para entrar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-base md:text-lg font-bold text-gray-700 mb-2 md:mb-3 text-center">
              🔑 Mi Código Especial
            </label>
            <input
              type="text"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value.toUpperCase())}
              className="w-full px-4 md:px-6 py-3 md:py-4 border-3 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none text-center text-xl md:text-2xl font-bold tracking-wider"
              placeholder="ANA2024"
              maxLength={10}
              required
            />
            <p className="text-xs md:text-sm text-gray-500 text-center mt-2">
              💡 Tu maestro te dio este código especial
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-300 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded-2xl text-center text-sm md:text-base">
              <div className="text-xl md:text-2xl mb-1 md:mb-2">😕</div>
              {error}
            </div>
          )}

          <div className="space-y-3 md:space-y-4">
            <button
              type="submit"
              disabled={loading || studentCode.length < 3}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 md:py-4 rounded-2xl text-lg md:text-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 md:gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verificando...
                </>
              ) : (
                <>
                  <Star className="w-5 h-5 md:w-6 md:h-6" />
                  ¡Entrar a MateAventura!
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 py-2 md:py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-all text-sm md:text-base"
            >
              Cancelar
            </button>
          </div>
        </form>

        {/* Códigos de ejemplo para demostración */}
        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-2xl">
          <h3 className="font-bold text-blue-800 mb-2 text-center text-sm md:text-base">🎮 Códigos de Prueba:</h3>
          <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
            {validCodes.map((student, index) => (
              <div key={index} className="text-center">
                <div className="text-base md:text-lg">{student.avatar}</div>
                <div className="font-bold text-blue-700 text-xs md:text-sm">{student.code}</div>
                <div className="text-blue-600 text-xs">{student.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;