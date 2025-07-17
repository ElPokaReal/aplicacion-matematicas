import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, Star, ArrowRight, LogIn } from 'lucide-react';
import { FaGamepad, FaTrophy, FaChartBar, FaUserCircle, FaKey, FaLightbulb, FaSmile } from 'react-icons/fa';
import logo from '/logo.jpg';
import { useAuth } from '../context/AuthContext';

function MainMenu() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showStudentLogin, setShowStudentLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 flex flex-col justify-between">
      {/* Header con logo y bienvenida */}
      <header className="flex flex-col items-center pt-8 pb-4">
        <img src={logo} alt="Logo ENB Rosario Almarza" className="h-28 w-auto rounded-lg shadow-lg border-2 border-white bg-white/80 mb-4" />
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 drop-shadow-lg mb-2 text-center">
          ¡Bienvenido a MateAventuras!
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 font-medium mb-2 text-center">
          Plataforma interactiva para estudiantes y maestros
        </p>
      </header>

      {/* Tarjetas de acceso */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mb-12">
          {/* Estudiante */}
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer border-2 border-blue-200">
            <Users className="w-16 h-16 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Estudiantes</h2>
            <p className="text-gray-600 mb-6 text-center">Ingresa con tu código especial y comienza a aprender jugando.</p>
            <button
              onClick={() => setShowStudentLogin(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl text-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all drop-shadow flex items-center justify-center gap-2"
            >
              <LogIn className="w-6 h-6" /> Ingresar como Estudiante
            </button>
          </div>
          {/* Maestro */}
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer border-2 border-green-200">
            <GraduationCap className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Maestros</h2>
            <p className="text-gray-600 mb-6 text-center">Gestiona estudiantes, crea ejercicios y monitorea el progreso.</p>
            <button
              onClick={() => navigate('/maestro/login')}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-xl text-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all drop-shadow flex items-center justify-center gap-2"
            >
              <LogIn className="w-6 h-6" /> Ingresar como Maestro
            </button>
          </div>
        </div>

        {/* Características */}
        <section className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto w-full mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" /> ¿Por qué usar MateAventuras?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <FaGamepad className="text-indigo-600 mb-2" size={40} />
              <p className="font-semibold text-gray-700 text-base">Juegos Educativos</p>
              <p className="text-sm text-gray-600">Aprende matemáticas jugando y divirtiéndote.</p>
            </div>
            <div className="flex flex-col items-center">
              <FaTrophy className="text-yellow-600 mb-2" size={40} />
              <p className="font-semibold text-gray-700 text-base">Premios y Medallas</p>
              <p className="text-sm text-gray-600">Gana recompensas por tu esfuerzo y dedicación.</p>
            </div>
            <div className="flex flex-col items-center">
              <FaChartBar className="text-purple-600 mb-2" size={40} />
              <p className="font-semibold text-gray-700 text-base">Seguimiento</p>
              <p className="text-sm text-gray-600">Ve tu progreso y mejora cada día.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer institucional */}
      <footer className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center text-sm opacity-90 mt-4">
        <span>E.N.B "Rosario Almarza" - Trujillo | Plataforma educativa</span>
      </footer>

      {/* Modal de Login para Estudiantes */}
      {showStudentLogin && (
        <StudentLoginModal 
          onClose={() => setShowStudentLogin(false)}
          onSuccess={() => navigate('/estudiante')}
          login={login}
        />
      )}
    </div>
  );
}

// Modal de login para estudiantes (igual que antes)
function StudentLoginModal({ onClose, onSuccess, login }) {
  const [codigo_alumno, setCodigoAlumno] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login({ codigo_alumno }, 'student');
    if (success) {
      onSuccess();
    } else {
      setError('Código de alumno incorrecto. Pide ayuda a tu maestro.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm md:max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
            ¡Hola Estudiante! <FaSmile className="inline ml-2" />
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Ingresa tu código especial para entrar</p>
        </div>
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-base md:text-lg font-bold text-gray-700 mb-2 md:mb-3 text-center">
              <FaKey className="inline mr-2" /> Mi Código Especial
            </label>
            <input
              type="text"
              value={codigo_alumno}
              onChange={(e) => setCodigoAlumno(e.target.value.toUpperCase())}
              className="w-full px-4 md:px-6 py-3 md:py-4 border-3 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none text-center text-xl md:text-2xl font-bold tracking-wider"
              placeholder="ANA2024"
              maxLength={10}
              required
            />
            <p className="text-xs md:text-sm text-gray-500 text-center mt-2">
              <FaLightbulb className="inline mr-2" /> Tu maestro te dio este código especial
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
              disabled={loading || !codigo_alumno}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 md:py-4 rounded-2xl text-lg md:text-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 md:gap-3 drop-shadow"
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
          <h3 className="font-bold text-blue-800 mb-2 text-center text-sm md:text-base">🎮 Código de Prueba:</h3>
          <div className="grid grid-cols-1 gap-2 text-xs md:text-sm">
            <div className="text-center flex flex-col items-center justify-center">
              <FaUserCircle className="text-indigo-600 mb-1" size={32} />
              <div className="font-bold text-blue-700 text-xs md:text-sm">ANA2024</div>
              <div className="text-blue-600 text-xs"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;