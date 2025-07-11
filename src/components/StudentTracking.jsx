import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Download, Eye, Star, TrendingUp, Award } from 'lucide-react';

function StudentTracking() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');

  const students = [
    {
      id: 1,
      name: 'Ana García',
      grade: 4,
      avatar: '👧',
      exercisesCompleted: 45,
      stars: 38,
      averageScore: 85,
      lastActivity: '2 horas',
      status: 'active',
      progress: {
        suma: 90,
        resta: 85,
        multiplicacion: 80,
        division: 75
      }
    },
    {
      id: 2,
      name: 'Carlos Mendoza',
      grade: 5,
      avatar: '👦',
      exercisesCompleted: 62,
      stars: 55,
      averageScore: 92,
      lastActivity: '1 hora',
      status: 'active',
      progress: {
        suma: 95,
        resta: 90,
        multiplicacion: 88,
        division: 85
      }
    },
    {
      id: 3,
      name: 'María López',
      grade: 6,
      avatar: '👧',
      exercisesCompleted: 78,
      stars: 71,
      averageScore: 88,
      lastActivity: '30 min',
      status: 'active',
      progress: {
        suma: 92,
        resta: 88,
        multiplicacion: 85,
        division: 82
      }
    },
    {
      id: 4,
      name: 'Diego Ruiz',
      grade: 4,
      avatar: '👦',
      exercisesCompleted: 23,
      stars: 18,
      averageScore: 72,
      lastActivity: '1 día',
      status: 'inactive',
      progress: {
        suma: 75,
        resta: 70,
        multiplicacion: 65,
        division: 60
      }
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || student.grade.toString() === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
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
            <h1 className="text-4xl font-bold text-gray-800">Seguimiento de Estudiantes</h1>
          </div>
          
          <button className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all">
            <Download className="w-5 h-5" />
            Exportar Reporte
          </button>
        </div>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Estudiantes</p>
                <p className="text-3xl font-bold text-gray-800">{students.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Promedio General</p>
                <p className="text-3xl font-bold text-gray-800">
                  {Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Estudiantes Activos</p>
                <p className="text-3xl font-bold text-gray-800">
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Estrellas</p>
                <p className="text-3xl font-bold text-gray-800">
                  {students.reduce((sum, s) => sum + s.stars, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="md:w-48">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Todos los grados</option>
                <option value="4">Cuarto Grado</option>
                <option value="5">Quinto Grado</option>
                <option value="6">Sexto Grado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de estudiantes */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Estudiantes ({filteredStudents.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-6 hover:bg-gray-50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-3xl">
                      {student.avatar}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-gray-600">{student.grade}° Grado</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                          {student.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                        <span className="text-gray-500 text-sm">Última actividad: {student.lastActivity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{student.exercisesCompleted}</div>
                      <div className="text-sm text-gray-600">Ejercicios</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{student.stars}</div>
                      <div className="text-sm text-gray-600">Estrellas</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(student.averageScore)}`}>
                        {student.averageScore}%
                      </div>
                      <div className="text-sm text-gray-600">Promedio</div>
                    </div>
                  </div>
                </div>

                {/* Progreso por materia */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(student.progress).map(([subject, score]) => (
                    <div key={subject} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700 capitalize">
                          {subject === 'multiplicacion' ? 'Multiplicación' : 
                           subject === 'division' ? 'División' : subject}
                        </span>
                        <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                          {score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            score >= 90 ? 'bg-green-500' :
                            score >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentTracking;