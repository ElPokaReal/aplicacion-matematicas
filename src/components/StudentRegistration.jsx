import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Users, UserPlus, Search } from 'lucide-react';

function StudentRegistration() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([
    {
      id: 1,
      firstName: 'Ana',
      lastName: 'García',
      studentCode: 'ANA2024',
      age: 9,
      grade: 4,
      guardian: 'María García',
      registrationDate: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      firstName: 'Carlos',
      lastName: 'Mendoza',
      studentCode: 'CARLOS2024',
      age: 10,
      grade: 5,
      guardian: 'Roberto Mendoza',
      registrationDate: '2024-01-20',
      status: 'active'
    },
    {
      id: 3,
      firstName: 'María',
      lastName: 'López',
      studentCode: 'MARIA2024',
      age: 11,
      grade: 6,
      guardian: 'Carmen López',
      registrationDate: '2024-02-01',
      status: 'active'
    },
    {
      id: 4,
      firstName: 'Diego',
      lastName: 'Ruiz',
      studentCode: 'DIEGO2024',
      age: 9,
      grade: 4,
      guardian: 'Luis Ruiz',
      registrationDate: '2024-02-10',
      status: 'inactive'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: 9,
    grade: 4,
    guardian: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newStudent = {
      id: editingStudent ? editingStudent.id : Date.now(),
      ...formData,
      registrationDate: editingStudent ? editingStudent.registrationDate : new Date().toISOString().split('T')[0],
      status: editingStudent ? editingStudent.status : 'active'
    };

    if (editingStudent) {
      setStudents(students.map(student => 
        student.id === editingStudent.id ? newStudent : student
      ));
    } else {
      setStudents([...students, newStudent]);
    }

    setShowForm(false);
    setEditingStudent(null);
    setFormData({ firstName: '', lastName: '', age: 9, grade: 4, guardian: '' });
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      age: student.age,
      grade: student.grade,
      guardian: student.guardian
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setStudents(students.map(student => 
      student.id === id 
        ? { ...student, status: student.status === 'active' ? 'inactive' : 'active' }
        : student
    ));
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.guardian.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || student.grade.toString() === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 4: return 'bg-green-100 text-green-800';
      case 5: return 'bg-blue-100 text-blue-800';
      case 6: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvatarEmoji = (firstName) => {
    const emojis = ['👧', '👦', '🧒', '👶'];
    const index = firstName.charCodeAt(0) % emojis.length;
    return emojis[index];
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
            <h1 className="text-4xl font-bold text-gray-800">Registro de Estudiantes</h1>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
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
                  {students.filter(s => s.status === 'active').length}
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
                    {students.filter(s => s.grade === grade).length}
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
                  placeholder="Buscar por nombre del estudiante o representante..."
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
                    setFormData({ firstName: '', lastName: '', age: 9, grade: 4, guardian: '' });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                      placeholder="Ana"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                      placeholder="García"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Edad *
                    </label>
                    <select
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    >
                      {[8, 9, 10, 11, 12, 13].map(age => (
                        <option key={age} value={age}>{age} años</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Grado *
                    </label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    >
                      <option value={4}>Cuarto Grado</option>
                      <option value={5}>Quinto Grado</option>
                      <option value={6}>Sexto Grado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Representante *
                  </label>
                  <input
                    type="text"
                    value={formData.guardian}
                    onChange={(e) => setFormData({ ...formData, guardian: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="María García (madre, padre, tutor, etc.)"
                    required
                  />
                </div>

                <button
                  type="submit"
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
                      {getAvatarEmoji(student.firstName)}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {student.firstName} {student.lastName}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-gray-600">{student.age} años</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getGradeColor(student.grade)}`}>
                          {student.grade}° Grado
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                          {student.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Representante:</span> {student.guardian}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Registrado: {new Date(student.registrationDate).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(student.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        student.status === 'active' 
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {student.status === 'active' ? 'Desactivar' : 'Activar'}
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