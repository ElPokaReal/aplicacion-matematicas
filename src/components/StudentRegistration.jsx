import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Users, UserPlus, Search, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StudentService from '../services/StudentService';

function StudentRegistration() {
  const navigate = useNavigate();
  const { token, teacherData } = useAuth();
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    codigo_alumno: '',
    grado: 4,
    maestro_id: teacherData?.id,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (editingStudent) {
        await StudentService.updateStudent(editingStudent.id, {
          nombre: formData.nombre,
          usuario: formData.usuario,
          codigo_alumno: formData.codigo_alumno,
          grado: formData.grado,
          maestro_id: teacherData.id,
        }, token);
      } else {
        await StudentService.registerStudent(formData, token);
      }
      setShowForm(false);
      setEditingStudent(null);
      setFormData({
        nombre: '',
        usuario: '',
        codigo_alumno: '',
        grado: 4,
        maestro_id: teacherData?.id,
      });
      fetchStudents(); // Refresh student list
    } catch (err) {
      setError(err.message || 'Error al guardar estudiante.');
      console.error('Error saving student:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      nombre: student.nombre,
      usuario: student.usuario,
      password: '', // Password should not be pre-filled for security
      grado: student.grado,
      maestro_id: student.maestro.id,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      setError(null);
      setLoading(true);
      try {
        await StudentService.deleteStudent(id, token);
        fetchStudents(); // Refresh student list
      } catch (err) {
        setError(err.message || 'Error al eliminar estudiante.');
        console.error('Error deleting student:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleStatus = async (student) => {
    setError(null);
    setLoading(true);
    try {
      await StudentService.updateStudent(student.id, {
        ...student,
        esta_activo: !student.esta_activo,
        maestro_id: student.maestro.id, // Ensure maestro_id is sent back
      }, token);
      fetchStudents(); // Refresh student list
    } catch (err) {
      setError(err.message || 'Error al cambiar estado del estudiante.');
      console.error('Error toggling student status:', err);
    } finally {
      setLoading(false);
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

  const getStatusColor = (status) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 4: return 'bg-green-100 text-green-800';
      case 5: return 'bg-blue-100 text-blue-800';
      case 6: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvatarEmoji = (name) => {
    const emojis = ['👧', '👦', '🧒', '👶'];
    const index = name.charCodeAt(0) % emojis.length;
    return emojis[index];
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
            <h1 className="text-4xl font-bold text-gray-800">Registro de Estudiantes</h1>
          </div>
          
          <button
            onClick={() => {
              setShowForm(true);
              setEditingStudent(null);
              setFormData({
                nombre: '',
                usuario: '',
                password: '',
                grado: 4,
                maestro_id: teacherData?.id,
              });
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            <UserPlus className="w-5 h-5" />
            Registrar Estudiante
          </button>
        </div>

        {/* Estadísticas rápidas */}
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
                <p className="text-3xl font-bold text-green-600">
                  {students.filter(s => s.esta_activo).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {[4, 5, 6].map(grade => (
            <div key={grade} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{grade}° Grado</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {students.filter(s => s.grado === grade).length}
                  </p>
                </div>
                <div className={`w-12 h-12 ${
                  grade === 4 ? 'bg-green-500' :
                  grade === 5 ? 'bg-blue-500' : 'bg-purple-500'
                } rounded-xl flex items-center justify-center text-white text-xl font-bold`}>
                  {grade}°
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre de estudiante o usuario..."
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

        {/* Formulario de registro */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingStudent ? 'Editar Estudiante' : 'Registrar Nuevo Estudiante'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingStudent(null);
                    setFormData({
                      nombre: '',
                      usuario: '',
                      password: '',
                      grado: 4,
                      maestro_id: teacherData?.id,
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Ana García"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de Usuario *
                  </label>
                  <input
                    type="text"
                    value={formData.usuario}
                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="anagarcia"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Código de Alumno *
                  </label>
                  <input
                    type="text"
                    value={formData.codigo_alumno}
                    onChange={(e) => setFormData({ ...formData, codigo_alumno: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="CODIGO123"
                    maxLength={10}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Grado *
                  </label>
                  <select
                    value={formData.grado}
                    onChange={(e) => setFormData({ ...formData, grado: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value={4}>Cuarto Grado</option>
                    <option value={5}>Quinto Grado</option>
                    <option value={6}>Sexto Grado</option>
                  </select>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingStudent ? 'Actualizar' : 'Registrar'} Estudiante
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Lista de estudiantes */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Estudiantes Registrados ({filteredStudents.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-6 hover:bg-gray-50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-3xl">
                      {getAvatarEmoji(student.nombre)}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {student.nombre}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-gray-600">Usuario: {student.usuario}</span>
                        <span className="text-gray-600">Código: {student.codigo_alumno}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getGradeColor(student.grado)}`}>
                          {student.grado}° Grado
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.esta_activo)}`}>
                          {student.esta_activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Registrado: {new Date(student.fecha_creacion).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(student)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        student.esta_activo
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {student.esta_activo ? 'Desactivar' : 'Activar'}
                    </button>
                    
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-lg transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No se encontraron estudiantes
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedGrade !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza registrando tu primer estudiante'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentRegistration;