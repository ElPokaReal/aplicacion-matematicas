import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, BookOpen, Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ExerciseService from '../services/ExerciseService';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';

function ExerciseManagement() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    tipo_operacion: '',
    nivel_dificultad: 'Fácil',
    texto_problema: '',
    solucion: '',
  });

  useEffect(() => {
    fetchExercises();
  }, [token]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const data = await ExerciseService.getAllExercises(token);
      setExercises(data);
    } catch (err) {
      showErrorToast('No se pudieron cargar los ejercicios.');
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingExercise) {
        await ExerciseService.updateExercise(editingExercise.id, formData, token);
        showSuccessToast('¡Ejercicio actualizado con éxito!');
      } else {
        await ExerciseService.createExercise(formData, token);
        showSuccessToast('¡Ejercicio creado con éxito!');
      }
      setShowForm(false);
      setEditingExercise(null);
      setFormData({
        tipo_operacion: '',
        nivel_dificultad: 'Fácil',
        texto_problema: '',
        solucion: '',
      });
      fetchExercises(); // Refresh exercise list
    } catch (err) {
      showErrorToast(err.message || 'Error al guardar el ejercicio.');
      console.error('Error saving exercise:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setFormData({
      tipo_operacion: exercise.tipo_operacion,
      nivel_dificultad: exercise.nivel_dificultad,
      texto_problema: exercise.texto_problema,
      solucion: exercise.solucion,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ejercicio?')) {
      try {
        await ExerciseService.deleteExercise(id, token);
        showSuccessToast('Ejercicio eliminado correctamente.');
        fetchExercises(); // Refresh exercise list
      } catch (err) {
        showErrorToast(err.message || 'Error al eliminar el ejercicio.');
        console.error('Error deleting exercise:', err);
      }
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch =
      exercise.texto_problema.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || exercise.tipo_operacion === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || exercise.nivel_dificultad === selectedDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800';
      case 'Medio': return 'bg-yellow-100 text-yellow-800';
      case 'Difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando ejercicios...</div>;
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
                tipo_operacion: '',
                nivel_dificultad: 'Fácil',
                texto_problema: '',
                solucion: '',
              });
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Crear Ejercicio
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por problema..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="md:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="">Selecciona una operación</option>
                <option value="all">Todas las Operaciones</option>
                <option value="Suma">Suma</option>
                <option value="Resta">Resta</option>
                <option value="Multiplicación">Multiplicación</option>
                <option value="División">División</option>
                <option value="Fracciones">Fracciones</option>
                <option value="Decimales">Decimales</option>
              </select>
            </div>

            <div className="md:w-48">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Todas las Dificultades</option>
                <option value="Fácil">Fácil</option>
                <option value="Medio">Medio</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
          </div>
        </div>

        {/* Formulario de ejercicio */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingExercise ? 'Editar Ejercicio' : 'Crear Nuevo Ejercicio'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingExercise(null);
                    setFormData({
                      tipo_operacion: '',
                      nivel_dificultad: 'Fácil',
                      texto_problema: '',
                      solucion: '',
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
                    Tipo de Operación *
                  </label>
                  <select
                    value={formData.tipo_operacion}
                    onChange={(e) => setFormData({ ...formData, tipo_operacion: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    required
                  >
                    <option value="">Selecciona una operación</option>
                    <option value="Suma">Suma</option>
                    <option value="Resta">Resta</option>
                    <option value="Multiplicación">Multiplicación</option>
                    <option value="División">División</option>
                    <option value="Fracciones">Fracciones</option>
                    <option value="Decimales">Decimales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nivel de Dificultad *
                  </label>
                  <select
                    value={formData.nivel_dificultad}
                    onChange={(e) => setFormData({ ...formData, nivel_dificultad: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    required
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Medio">Medio</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Texto del Problema *
                  </label>
                  <textarea
                    value={formData.texto_problema}
                    onChange={(e) => setFormData({ ...formData, texto_problema: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none h-24 resize-none"
                    placeholder="Ej: ¿Cuánto es 5 + 3?"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Solución *
                  </label>
                  <input
                    type="text"
                    value={formData.solucion}
                    onChange={(e) => setFormData({ ...formData, solucion: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Ej: 8"
                    required
                  />
                </div>

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

        {/* Lista de ejercicios */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Ejercicios Creados ({filteredExercises.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredExercises.map((exercise) => (
              <div key={exercise.id} className="p-6 hover:bg-gray-50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-3xl">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {exercise.tipo_operacion} - {exercise.nivel_dificultad}
                      </h3>
                      <p className="text-gray-600 mt-1">{exercise.texto_problema}</p>
                      <p className="text-sm text-gray-500">Solución: {exercise.solucion}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(exercise.nivel_dificultad)}`}>
                          {exercise.nivel_dificultad}
                        </span>
                      </div>
                    </div>
                  </div>

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
                </div>
              </div>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No se encontraron ejercicios
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedType !== 'all' || selectedDifficulty !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda' 
                  : 'Comienza creando tu primer ejercicio'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExerciseManagement;