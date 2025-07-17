import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ExerciseService from '../services/ExerciseService';

function ExerciseManagement() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('all'); // New state for grade filter

  const [formData, setFormData] = useState({
    grado: 4,
    tipo_operacion: 'Suma',
    pregunta: '',
    respuesta_correcta: '',
  });

  const operationTypes = {
    'Suma': 'Suma',
    'Resta': 'Resta',
    'Multiplicación': 'Multiplicación',
    'División': 'División',
    'Fracciones': 'Fracciones',
    'Decimales': 'Decimales',
    'Porcentajes': 'Porcentajes',
    'Perímetro': 'Perímetro',
    'Área': 'Área',
    'Ángulos': 'Ángulos',
    'Figuras': 'Figuras',
    'Problema de Suma': 'Problema de Suma',
    'Problema de Resta': 'Problema de Resta',
    'Problema de Multiplicación': 'Problema de Multiplicación',
    'Problema de División': 'Problema de División',
    'Problema de Fracciones': 'Problema de Fracciones',
    'Problema de Porcentajes': 'Problema de Porcentajes'
  };

  useEffect(() => {
    fetchExercises();
  }, [token, selectedGradeFilter]);

  const fetchExercises = async () => {
    if (!token) {
      setLoading(false);
      setError('No authentication token found.');
      return;
    }
    try {
      setLoading(true);
      const data = await ExerciseService.getAllExercises(token, selectedGradeFilter === 'all' ? null : selectedGradeFilter);
      setExercises(data);
    } catch (err) {
      setError('Failed to load exercises.');
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const exerciseData = {
        grado: formData.grado,
        tipo_operacion: formData.tipo_operacion,
        pregunta: formData.pregunta,
        respuesta_correcta: formData.respuesta_correcta.toString(),
      };

      if (editingExercise) {
        await ExerciseService.updateExercise(editingExercise.id, exerciseData, token);
      } else {
        await ExerciseService.createExercise(exerciseData, token);
      }
      setShowForm(false);
      setEditingExercise(null);
      setFormData({
        grado: 4,
        tipo_operacion: 'Suma',
        pregunta: '',
        respuesta_correcta: '',
      });
      fetchExercises(); // Refresh exercise list
    } catch (err) {
      setError(err.message || 'Error al guardar ejercicio.');
      console.error('Error saving exercise:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setFormData({
      grado: [4, 5, 6].includes(exercise.grado) ? exercise.grado : 4,
      tipo_operacion: exercise.tipo_operacion,
      pregunta: exercise.pregunta,
      respuesta_correcta: exercise.respuesta_correcta.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este ejercicio?')) {
      setError(null);
      setLoading(true);
      try {
        await ExerciseService.deleteExercise(id, token);
        fetchExercises(); // Refresh exercise list
      } catch (err) {
        setError(err.message || 'Error al eliminar ejercicio.');
        console.error('Error deleting exercise:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const getOperationColor = (type) => {
    if (type.includes('Suma')) return 'bg-green-100 text-green-800';
    if (type.includes('Resta')) return 'bg-red-100 text-red-800';
    if (type.includes('Multiplicación')) return 'bg-blue-100 text-blue-800';
    if (type.includes('División')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando ejercicios...</div>;
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
            <h1 className="text-4xl font-bold text-gray-800">Gestión de Ejercicios</h1>
          </div>
          
          <button
            onClick={() => {
              setShowForm(true);
              setEditingExercise(null);
              setFormData({
                grado: 4,
                tipo_operacion: 'Suma',
                pregunta: '',
                respuesta_correcta: '',
              });
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Nuevo Ejercicio
          </button>
        </div>

        {/* Header */}

        {/* Formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingExercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingExercise(null);
                    setFormData({
                      grado: 4,
                      tipo_operacion: 'Suma',
                      pregunta: '',
                      respuesta_correcta: '',
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Grado</label>
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Operación</label>
                  <select
                    value={formData.tipo_operacion}
                    onChange={(e) => setFormData({ ...formData, tipo_operacion: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    {Object.keys(operationTypes).map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pregunta</label>
                  <textarea
                    value={formData.pregunta}
                    onChange={(e) => setFormData({ ...formData, pregunta: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Ej: ¿Cuál es el perímetro de un cuadrado de 5 cm de lado?"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Respuesta Correcta</label>
                  <input
                    type="text" // Changed to text to allow non-numeric answers if needed
                    value={formData.respuesta_correcta}
                    onChange={(e) => setFormData({ ...formData, respuesta_correcta: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="20"
                    required
                  />
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
                  {editingExercise ? 'Actualizar' : 'Crear'} Ejercicio
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Filtro de Grado */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-end">
            <div className="md:w-48">
              <select
                value={selectedGradeFilter}
                onChange={(e) => setSelectedGradeFilter(e.target.value)}
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

        {/* Lista de ejercicios */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Ejercicios Creados ({exercises.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Grado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tipo de Operación</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pregunta</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Respuesta Correcta</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exercises.map((exercise) => (
                  <tr key={exercise.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{`${exercise.grado}°`}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getOperationColor(exercise.tipo_operacion)}`}>
                        {exercise.tipo_operacion}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate">{exercise.pregunta}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-bold">{exercise.respuesta_correcta}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(exercise)}
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exercise.id)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExerciseManagement;
