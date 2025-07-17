import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Award, Crown, Zap, Trophy, Medal, Gift, Gem, Smile, ThumbsUp } from 'lucide-react';
import { FaTrophy, FaGift, FaStar, FaCheck, FaLock, FaMedal } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import RewardService from '../services/RewardService';
import StudentService from '../services/StudentService';

export default function RewardsPage() {
  const navigate = useNavigate();
  const { token, teacherData, studentData } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [unlockedRewards, setUnlockedRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [activeTab, setActiveTab] = useState('rewards'); // 'rewards' o 'achievements'

  const currentUserId = studentData?.id || teacherData?.id;
  const isStudent = !!studentData;

  const iconMap = {
    Star,
    Award,
    Crown,
    Zap,
    Trophy,
    Medal,
    Gift,
    Gem,
    Smile,
    ThumbsUp
  };

  useEffect(() => {
    const fetchRewards = async () => {
      if (!token || !currentUserId) {
        setLoading(false);
        setError('No authentication token or user ID found.');
        return;
      }
      try {
        setLoading(true);
        const allRewards = await RewardService.getAllRewards(token);
        setRewards(allRewards);

        if (isStudent) {
          const studentUnlockedRewards = await RewardService.getUnlockedRewardsByStudent(currentUserId, token);
          setUnlockedRewards(studentUnlockedRewards.map(ur => ur.recompensa.id));
          // Obtener logros
          const studentAchievements = await StudentService.getAchievementsByStudent(currentUserId, token);
          setAchievements(studentAchievements.map(a => a.logro));
        }

      } catch (err) {
        setError(err.message || 'Failed to load rewards.');
        console.error('Error fetching rewards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [token, currentUserId, isStudent]);

  const handleBackNavigation = () => {
    if (isStudent) {
      navigate('/estudiante'); // Assuming student dashboard route
    } else if (teacherData) {
      navigate('/maestro/dashboard'); // Assuming teacher dashboard route
    } else {
      navigate('/');
    }
  };

  const handleUnlockReward = async (rewardId) => {
    if (!token || !isStudent) {
      setError('Authentication required to unlock rewards.');
      return;
    }
    try {
      setLoading(true);
      const result = await RewardService.unlockReward(rewardId, token);
      alert(`Recompensa desbloqueada! Nuevos puntos: ${result.nuevos_puntos}`);
      // Refresh unlocked rewards and student data (points)
      const studentUnlockedRewards = await RewardService.getUnlockedRewardsByStudent(currentUserId, token);
      setUnlockedRewards(studentUnlockedRewards.map(ur => ur.recompensa.id));
      // Optionally, update studentData in AuthContext if points are returned
    } catch (err) {
      setError(err.message || 'Error al desbloquear recompensa.');
      console.error('Error unlocking reward:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando premios...</div>;
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
            {isStudent ? 'Mi Dashboard' : 'Panel Principal'}
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 text-center flex-1">
            <FaTrophy className="inline mr-2" /> Mis Premios
          </h1>
          
          <div className="w-20"></div>
        </div>

        {/* Current Student Points (if student is logged in) */}
        {isStudent && (
          <div className="bg-white rounded-2xl p-6 mb-8 text-center shadow-xl">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{studentData?.puntos_recompensa || 0}</div>
                <div className="text-gray-600">Puntos de Recompensa</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        {isStudent && (
          <div className="flex justify-center mb-8">
            <button
              className={`px-6 py-2 rounded-t-lg font-bold text-lg transition-all border-b-4 ${activeTab === 'rewards' ? 'border-blue-500 text-blue-700 bg-white' : 'border-transparent text-gray-500 bg-gray-100'}`}
              onClick={() => setActiveTab('rewards')}
            >
              Recompensas
            </button>
            <button
              className={`px-6 py-2 rounded-t-lg font-bold text-lg transition-all border-b-4 ${activeTab === 'achievements' ? 'border-yellow-500 text-yellow-700 bg-white' : 'border-transparent text-gray-500 bg-gray-100'}`}
              onClick={() => setActiveTab('achievements')}
            >
              Logros
            </button>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'rewards' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              <FaGift className="inline mr-2" /> Recompensas Disponibles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const isUnlocked = unlockedRewards.includes(reward.id);
                const Icon = iconMap[reward.icono_nombre] || Star;
                return (
                  <div
                    key={reward.id}
                    className={`bg-white rounded-2xl p-6 shadow-xl transition-all ${
                      isUnlocked ? 'ring-4 ring-green-400' : 'opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="w-12 h-12 text-blue-500" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{reward.nombre}</h3>
                        <p className="text-gray-600 text-sm">{reward.descripcion}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      {isUnlocked ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                          <FaCheck className="inline mr-1" /> DESBLOQUEADO
                        </span>
                      ) : (
                        <button
                          onClick={() => handleUnlockReward(reward.id)}
                          disabled={!isStudent || (studentData?.puntos_recompensa || 0) < reward.costo_puntos}
                          className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaLock className="inline mr-1" /> {reward.costo_puntos} Puntos
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {activeTab === 'achievements' && isStudent && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              <FaMedal className="inline mr-2" /> Mis Logros
            </h2>
            {achievements.length === 0 ? (
              <div className="text-center text-gray-500">Aún no has obtenido logros. ¡Sigue participando!</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((ach) => {
                  const Icon = iconMap[ach.icono_nombre] || Award;
                  return (
                    <div key={ach.id} className="bg-white rounded-2xl p-6 shadow-xl flex items-center gap-4">
                      <Icon className="w-12 h-12 text-yellow-500" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{ach.nombre}</h3>
                        <p className="text-gray-600 text-sm">{ach.descripcion}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Encouragement */}
        <div className="text-center mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Sigue coleccionando premios! <FaTrophy className="inline ml-2" />
          </h3>
          <p className="text-gray-600 text-lg">
            Cada ejercicio que resuelves te acerca a obtener más recompensas increíbles.
          </p>
        </div>
      </div>
    </div>
  );
}