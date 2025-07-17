import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Users,
  BookOpen,
  Star,
  Award,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TeacherService from '../services/TeacherService';
import { descargarReporteGeneral } from '../services/ReportService';
import { showInfoToast } from '../utils/toastHelper';

function StatisticsReports() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallStats, setOverallStats] = useState({});
  const [exercisePerformance, setExercisePerformance] = useState([]);
  const [studentPerformance, setStudentPerformance] = useState({});
  const [achievementRewardDistribution, setAchievementRewardDistribution] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setLoading(false);
        setError('No authentication token found.');
        return;
      }
      try {
        setLoading(true);
        const [
          overall,
          exercisePerf,
          studentPerf,
          achievementsRewards
        ] = await Promise.all([
          TeacherService.getDashboardStats(token),
          TeacherService.getExercisePerformanceStats(token),
          TeacherService.getStudentPerformanceStats(token),
          TeacherService.getAchievementRewardDistribution(token)
        ]);

        setOverallStats(overall);
        setExercisePerformance(exercisePerf);
        setStudentPerformance(studentPerf);
        setAchievementRewardDistribution(achievementsRewards);

      } catch (err) {
        setError(err.message || 'Failed to load statistics data.');
        console.error('Error fetching statistics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const getScoreColor = (score) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const exportReport = () => {
    showInfoToast('Generando el reporte... La descarga comenzará en breve.');
    descargarReporteGeneral();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando reportes...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  // Group exercise performance by grade
  const gradeStats = exercisePerformance.reduce((acc, curr) => {
    const grade = curr.grado;
    // Normalizar average_correctness: si es null, undefined o string no numérica, poner 0
    let avg = Number(curr.average_correctness);
    if (isNaN(avg)) avg = 0;
    if (!acc[grade]) {
      acc[grade] = { totalCorrectness: 0, count: 0, exercises: 0 };
    }
    acc[grade].totalCorrectness += avg;
    acc[grade].count++;
    acc[grade].exercises++; // Assuming each entry is one exercise type
    return acc;
  }, {});

  const formattedGradeStats = Object.keys(gradeStats).map(grade => {
    const count = gradeStats[grade].count;
    const avgScore = count > 0
      ? Math.round((gradeStats[grade].totalCorrectness / count) * 100)
      : 0;
    return {
      grade: parseInt(grade),
      avgScore,
      exercises: gradeStats[grade].exercises,
      color: grade === '4' ? 'from-green-400 to-green-600' : grade === '5' ? 'from-blue-400 to-blue-600' : 'from-purple-400 to-purple-600',
      count
    };
  }).sort((a, b) => a.grade - b.grade);

  // Group exercise performance by topic (tipo_operacion)
  const topicPerformance = exercisePerformance.map(item => {
    let avg = Number(item.average_correctness);
    if (isNaN(avg)) avg = 0;
    return {
      topic: item.tipo_operacion,
      score: Math.round(avg * 100),
      grade: item.grado, // Keep grade for potential filtering/display
    };
  });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/maestro/dashboard')}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Panel Principal
            </button>
            <h1 className="text-4xl font-bold text-gray-800">Estadísticas y Reportes</h1>
          </div>
          
          <button
            onClick={exportReport}
            className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all"
          >
            <Download className="w-5 h-5" />
            Exportar Reporte General
          </button>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{overallStats.totalEstudiantes || 0}</div>
            <div className="text-sm text-gray-600">Total Estudiantes</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{overallStats.totalEjercicios || 0}</div>
            <div className="text-sm text-gray-600">Ejercicios Creados</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{overallStats.totalLogrosOtorgados || 0}</div>
            <div className="text-sm text-gray-600">Logros Otorgados</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{overallStats.totalRecompensasDesbloqueadas || 0}</div>
            <div className="text-sm text-gray-600">Recompensas Desbloqueadas</div>
          </div>
        </div>

        {/* Gráficos y Análisis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Rendimiento por Grado */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Rendimiento por Grado</h2>
              <PieChart className="w-6 h-6 text-purple-500" />
            </div>
            
            <div className="space-y-4">
              {formattedGradeStats.length > 0 ? formattedGradeStats.map((grade, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800">{grade.grade}° Grado</h3>
                    <span className={`text-lg font-bold ${getScoreColor(grade.avgScore / 100)}`}>
                      {grade.count === 0 ? '—' : `${grade.avgScore}%`}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Ejercicios: </span>
                      <span className="font-semibold">{grade.exercises}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${grade.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${grade.avgScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )) : <p className="text-gray-500">No hay datos de rendimiento por grado.</p>}
            </div>
          </div>

          {/* Rendimiento por Tema */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Rendimiento por Tipo de Operación</h2>
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tipo de Operación</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Grado</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Promedio de Aciertos</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Progreso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topicPerformance.length > 0 ? topicPerformance.map((topic, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{topic.topic}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{topic.grade}°</td>
                      <td className="px-6 py-4">
                        <span className={`text-lg font-bold ${getScoreColor(topic.score / 100)}`}>
                          {topic.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              topic.score >= 90 ? 'bg-green-500' :
                              topic.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${topic.score}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No hay datos de rendimiento por tipo de operación.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Estudiantes por Puntos */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Top Estudiantes por Puntos</h2>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Puntos de Recompensa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {studentPerformance.topStudents && studentPerformance.topStudents.length > 0 ? studentPerformance.topStudents.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{student.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.puntos_recompensa}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-center text-gray-500">No hay datos de top estudiantes.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Distribución de Logros y Recompensas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Distribución de Logros</h2>
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="space-y-3">
              {achievementRewardDistribution.achievementDistribution && achievementRewardDistribution.achievementDistribution.length > 0 ? achievementRewardDistribution.achievementDistribution.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{item.logro_nombre}</span>
                  <span className="font-bold text-gray-800">{item.count}</span>
                </div>
              )) : <p className="text-gray-500">No hay datos de distribución de logros.</p>}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Distribución de Recompensas</h2>
              <Star className="w-6 h-6 text-orange-500" />
            </div>
            <div className="space-y-3">
              {achievementRewardDistribution.rewardDistribution && achievementRewardDistribution.rewardDistribution.length > 0 ? achievementRewardDistribution.rewardDistribution.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{item.recompensa_nombre}</span>
                  <span className="font-bold text-gray-800">{item.count}</span>
                </div>
              )) : <p className="text-gray-500">No hay datos de distribución de recompensas.</p>}
            </div>
          </div>
        </div>

        {/* Recomendaciones (Static for now) */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white drop-shadow-lg">
          <h2 className="text-2xl font-bold mb-4 drop-shadow">📊 Recomendaciones Basadas en Datos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <h3 className="font-bold">Fortalezas Identificadas</h3>
              </div>
              <ul className="text-sm space-y-1 text-white/90 drop-shadow">
                <li>• Excelente rendimiento en operaciones básicas</li>
                <li>• Alta participación en ejercicios de suma y resta</li>
                <li>• Buen promedio general del 87%</li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-yellow-300" />
                <h3 className="font-bold">Áreas de Mejora</h3>
              </div>
              <ul className="text-sm space-y-1 text-white/90 drop-shadow">
                <li>• Reforzar conceptos de fracciones y decimales</li>
                <li>• Aumentar práctica en temas de dificultad alta</li>
                <li>• Motivar a estudiantes menos activos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsReports;
