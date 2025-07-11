import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Filter, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Star,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';

function StatisticsReports() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedGrade, setSelectedGrade] = useState('all');

  // Datos simulados para las estadísticas
  const overallStats = {
    totalStudents: 24,
    activeStudents: 21,
    averageScore: 87,
    totalExercises: 1248,
    completionRate: 78,
    averageTime: 12 // minutos
  };

  const gradeStats = [
    { grade: 4, students: 8, avgScore: 85, exercises: 420, color: 'from-green-400 to-green-600' },
    { grade: 5, students: 9, avgScore: 88, exercises: 468, color: 'from-blue-400 to-blue-600' },
    { grade: 6, students: 7, avgScore: 89, exercises: 360, color: 'from-purple-400 to-purple-600' }
  ];

  const topicPerformance = [
    { topic: 'Suma', score: 92, exercises: 312, difficulty: 'Fácil' },
    { topic: 'Resta', score: 89, exercises: 298, difficulty: 'Fácil' },
    { topic: 'Multiplicación', score: 85, exercises: 276, difficulty: 'Medio' },
    { topic: 'División', score: 82, exercises: 234, difficulty: 'Medio' },
    { topic: 'Fracciones', score: 78, exercises: 189, difficulty: 'Difícil' },
    { topic: 'Decimales', score: 75, exercises: 156, difficulty: 'Difícil' }
  ];

  const weeklyProgress = [
    { day: 'Lun', exercises: 45, score: 88 },
    { day: 'Mar', exercises: 52, score: 85 },
    { day: 'Mié', exercises: 38, score: 91 },
    { day: 'Jue', exercises: 48, score: 87 },
    { day: 'Vie', exercises: 41, score: 89 },
    { day: 'Sáb', exercises: 23, score: 92 },
    { day: 'Dom', exercises: 18, score: 86 }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800';
      case 'Medio': return 'bg-yellow-100 text-yellow-800';
      case 'Difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const exportReport = () => {
    // Simulación de exportación
    alert('Reporte exportado exitosamente');
  };

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
            Exportar Reporte
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="quarter">Este trimestre</option>
                <option value="year">Este año</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Todos los grados</option>
                <option value="4">Cuarto Grado</option>
                <option value="5">Quinto Grado</option>
                <option value="6">Sexto Grado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{overallStats.totalStudents}</div>
            <div className="text-sm text-gray-600">Total Estudiantes</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{overallStats.activeStudents}</div>
            <div className="text-sm text-gray-600">Estudiantes Activos</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{overallStats.averageScore}%</div>
            <div className="text-sm text-gray-600">Promedio General</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{overallStats.totalExercises}</div>
            <div className="text-sm text-gray-600">Ejercicios Resueltos</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{overallStats.completionRate}%</div>
            <div className="text-sm text-gray-600">Tasa de Finalización</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{overallStats.averageTime}m</div>
            <div className="text-sm text-gray-600">Tiempo Promedio</div>
          </div>
        </div>

        {/* Gráficos y Análisis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Progreso Semanal */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Progreso Semanal</h2>
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
            
            <div className="space-y-4">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-semibold text-gray-600">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{day.exercises} ejercicios</span>
                      <span className={`font-bold ${getScoreColor(day.score)}`}>{day.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(day.exercises / 60) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rendimiento por Grado */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Rendimiento por Grado</h2>
              <PieChart className="w-6 h-6 text-purple-500" />
            </div>
            
            <div className="space-y-4">
              {gradeStats.map((grade, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800">{grade.grade}° Grado</h3>
                    <span className={`text-lg font-bold ${getScoreColor(grade.avgScore)}`}>
                      {grade.avgScore}%
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Estudiantes: </span>
                      <span className="font-semibold">{grade.students}</span>
                    </div>
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
              ))}
            </div>
          </div>
        </div>

        {/* Rendimiento por Tema */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Rendimiento por Tema</h2>
            <Award className="w-6 h-6 text-yellow-500" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tema</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Promedio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ejercicios</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Dificultad</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Progreso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topicPerformance.map((topic, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{topic.topic}</td>
                    <td className="px-6 py-4">
                      <span className={`text-lg font-bold ${getScoreColor(topic.score)}`}>
                        {topic.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{topic.exercises}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(topic.difficulty)}`}>
                        {topic.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            topic.score >= 90 ? 'bg-green-500' :
                            topic.score >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${topic.score}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">📊 Recomendaciones Basadas en Datos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <h3 className="font-bold">Fortalezas Identificadas</h3>
              </div>
              <ul className="text-sm space-y-1 text-white/90">
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
              <ul className="text-sm space-y-1 text-white/90">
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