import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Star, Award, Crown, Zap } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

export default function RewardsPage() {
  const navigate = useNavigate();
  const { progress } = useProgress();

  // Verificar si hay un estudiante logueado
  const currentStudent = JSON.parse(localStorage.getItem('currentStudent') || 'null');
  
  const handleBackNavigation = () => {
    // Si hay un estudiante logueado, ir a su dashboard
    // Si no, ir al menú principal
    if (currentStudent) {
      navigate('/estudiante');
    } else {
      navigate('/');
    }
  };
  const achievementTiers = [
    { threshold: 10, icon: Star, title: 'Principiante', description: 'Primeras 10 estrellas', color: 'from-yellow-400 to-yellow-600' },
    { threshold: 25, icon: Award, title: 'Estudiante', description: '25 estrellas obtenidas', color: 'from-blue-400 to-blue-600' },
    { threshold: 50, icon: Trophy, title: 'Experto', description: '50 estrellas obtenidas', color: 'from-purple-400 to-purple-600' },
    { threshold: 100, icon: Crown, title: 'Maestro', description: '100 estrellas obtenidas', color: 'from-orange-400 to-orange-600' },
    { threshold: 200, icon: Zap, title: 'Genio Matemático', description: '200 estrellas obtenidas', color: 'from-pink-400 to-pink-600' }
  ];

  const getUnlockedAchievements = () => {
    return achievementTiers.filter(tier => progress.totalStars >= tier.threshold);
  };

  const getNextAchievement = () => {
    return achievementTiers.find(tier => progress.totalStars < tier.threshold);
  };

  const unlockedAchievements = getUnlockedAchievements();
  const nextAchievement = getNextAchievement();

  const specialRewards = [
    { id: 1, title: 'Primera Estrella', description: 'Tu primera respuesta correcta', emoji: '⭐', unlocked: progress.totalStars >= 1 },
    { id: 2, title: 'Racha de Fuego', description: '5 respuestas correctas seguidas', emoji: '🔥', unlocked: progress.rewards.some(r => r.includes('Racha de 5')) },
    { id: 3, title: 'Súper Racha', description: '10 respuestas correctas seguidas', emoji: '🚀', unlocked: progress.rewards.some(r => r.includes('Racha de 10')) },
    { id: 4, title: 'Explorador', description: 'Probaste los 3 grados', emoji: '🗺️', unlocked: progress.grade4.completed > 0 && progress.grade5.completed > 0 && progress.grade6.completed > 0 },
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackNavigation}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {currentStudent ? 'Mi Dashboard' : 'Inicio'}
          </button>
          
          <h1 className="text-4xl font-bold text-white text-center flex-1">
            🏆 Mis Premios
          </h1>
          
          <div className="w-20"></div>
        </div>

        {/* Current Stats */}
        <div className="bg-white rounded-2xl p-6 mb-8 text-center shadow-xl">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{progress.totalStars}</div>
              <div className="text-gray-600">Estrellas Totales</div>
            </div>
          </div>
          
          {nextAchievement && (
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-blue-800 font-semibold">
                Próximo objetivo: {nextAchievement.title}
              </p>
              <p className="text-blue-600 text-sm">
                Te faltan {nextAchievement.threshold - progress.totalStars} estrellas
              </p>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(progress.totalStars / nextAchievement.threshold) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Achievement Levels */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            🎖️ Niveles de Logros
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievementTiers.map((tier) => {
              const isUnlocked = progress.totalStars >= tier.threshold;
              const IconComponent = tier.icon;
              
              return (
                <div
                  key={tier.title}
                  className={`bg-white rounded-2xl p-6 shadow-xl transition-all ${
                    isUnlocked ? 'ring-4 ring-yellow-400' : 'opacity-60'
                  }`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${tier.color} rounded-full flex items-center justify-center mx-auto mb-4 ${
                    !isUnlocked && 'grayscale'
                  }`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-center mb-2">
                    {tier.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center text-sm mb-2">
                    {tier.description}
                  </p>
                  
                  <div className="text-center">
                    {isUnlocked ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                        ✅ DESBLOQUEADO
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                        🔒 {tier.threshold} estrellas
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Special Rewards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            🌟 Premios Especiales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specialRewards.map((reward) => (
              <div
                key={reward.id}
                className={`bg-white rounded-2xl p-6 shadow-xl transition-all ${
                  reward.unlocked ? 'ring-2 ring-green-400' : 'opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`text-4xl ${!reward.unlocked && 'grayscale'}`}>
                    {reward.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {reward.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {reward.description}
                    </p>
                  </div>
                  <div>
                    {reward.unlocked ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                        ✅
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        🔒
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Rewards */}
        {progress.rewards.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              🎁 Premios por Rachas
            </h2>
            
            <div className="space-y-4">
              {progress.rewards.map((reward, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-lg">
                  <p className="text-center font-semibold text-gray-800">
                    {reward}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Encouragement */}
        <div className="text-center mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            ¡Sigue coleccionando premios! 🎉
          </h3>
          <p className="text-white/80 text-lg">
            Cada ejercicio que resuelves te acerca a obtener más recompensas increíbles.
          </p>
        </div>
      </div>
    </div>
  );
}