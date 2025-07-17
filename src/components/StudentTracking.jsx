import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Download, Users, Star, TrendingUp, Award, ToggleRight, ToggleLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StudentService from '../services/StudentService';
import { FaUserCircle } from 'react-icons/fa';

function StudentTracking() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [token]);

  const fetchStudents = async () => {
    if (!token) {
      setLoading(false);
      setError('No authentication token found.');
      return;
    }
    try {
      setLoading(true);
      const data = await StudentService.getAllStudents(token);
      setStudents(data);
    } catch (err) {
      setError('Failed to load students.');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (studentId, currentStatus) => {
    try {
      await StudentService.toggleStudentStatus(studentId, currentStatus, token);
      // Actualizar el estado local del estudiante
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.id === studentId ? { ...student, esta_activo: !currentStatus } : student
        )
      );
    } catch (err) {
      setError('Failed to toggle student status.');
      console.error('Error toggling student status:', err);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.codigo_alumno.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || student.grado.toString() === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const getStatusColor = (esta_activo) => {
    return esta_activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando estudiantes...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

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
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Estudiantes Activos</p>
                <p className="text-3xl font-bold text-gray-800">
                  {students.filter(s => s.esta_activo).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Puntos Recompensa</p>
                <p className="text-3xl font-bold text-gray-800">
                  {students.reduce((sum, s) => sum + s.puntos_recompensa, 0)}
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
                <p className="text-sm text-gray-600 mb-1">Promedio de Puntos</p>
                <p className="text-3xl font-bold text-gray-800">
                  {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.puntos_recompensa, 0) / students.length) : 0}
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
                  placeholder="Buscar estudiante por nombre o usuario..."
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
                      <FaUserCircle size={48} />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{student.nombre}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-gray-600">Usuario: {student.usuario}</span>
                        <span className="text-gray-600">Código: {student.codigo_alumno}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800`}>
                          {student.grado}° Grado
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.esta_activo)}`}>
                          {student.esta_activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Puntos de Recompensa: {student.puntos_recompensa}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(student.id, student.esta_activo)}
                    className={`px-4 py-2 rounded-xl text-white font-semibold flex items-center gap-2
                      ${student.esta_activo ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
                      transition-all`}
                  >
                    {student.esta_activo ? <><ToggleLeft className="w-5 h-5" /> Desactivar</> : <><ToggleRight className="w-5 h-5" /> Activar</>}
                  </button>
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
