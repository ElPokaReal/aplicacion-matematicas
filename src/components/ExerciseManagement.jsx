import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';

function ExerciseManagement() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([
    { id: 1, grade: 4, subject: 'matematicas', type: 'Suma', question: '25 + 17 = ?', answer: 42, difficulty: 'Fácil' },
    { id: 2, grade: 5, subject: 'matematicas', type: 'Multiplicación', question: '8 × 7 = ?', answer: 56, difficulty: 'Medio' },
    { id: 3, grade: 6, subject: 'matematicas', type: 'Fracciones', question: '1/2 + 1/4 = ?', answer: 0.75, difficulty: 'Difícil' },
    { id: 4, grade: 4, subject: 'geometria', type: 'Perímetro', question: 'Perímetro de un cuadrado de 5 cm de lado', answer: 20, difficulty: 'Fácil' },
    { id: 5, grade: 5, subject: 'geometria', type: 'Área', question: 'Área de un rectángulo de 6×4 cm', answer: 24, difficulty: 'Medio' },
    { id: 6, grade: 4, subject: 'problemas', type: 'Problema de Suma', question: 'Ana tiene 15 dulces y le dan 8 más. ¿Cuántos tiene?', answer: 23, difficulty: 'Fácil' }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [formData, setFormData] = useState({
    grade: 4,
    subject: 'matematicas',
    type: 'Suma',
    question: '',
    answer: '',
    difficulty: 'Fácil'
  });

  const subjectTypes = {
    matematicas: ['Suma', 'Resta', 'Multiplicación', 'División', 'Fracciones', 'Decimales', 'Porcentajes'],
    geometria: ['Perímetro', 'Área', 'Ángulos', 'Figuras'],
    problemas: ['Problema de Suma', 'Problema de Resta', 'Problema de Multiplicación', 'Problema de División', 'Problema de Fracciones', 'Problema de Porcentajes']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newExercise = {
      id: editingExercise ? editingExercise.id : Date.now(),
      ...formData,
      answer: parseFloat(formData.answer)
    };

    if (editingExercise) {
      setExercises(exercises.map(ex => ex.id === editingExercise.id ? newExercise : ex));
    } else {
      setExercises([...exercises, newExercise]);
    }

    setShowForm(false);
    setEditingExercise(null);
    setFormData({ grade: 4, subject: 'matematicas', type: 'Suma', question: '', answer: '', difficulty: 'Fácil' });
  };

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setFormData({
      grade: exercise.grade,
      subject: exercise.subject,
      type: exercise.type,
      question: exercise.question,
      answer: exercise.answer.toString(),
      difficulty: exercise.difficulty
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800';
      case 'Medio': return 'bg-yellow-100 text-yellow-800';
      case 'Difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'matematicas': return 'bg-blue-100 text-blue-800';
      case 'geometria': return 'bg-green-100 text-green-800';
      case 'problemas': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectIcon = (subject) => {
    switch (subject) {
      case 'matematicas': return '🔢';
      case 'geometria': return '📐';
      case 'problemas': return '🧩';
      default: return '📚';
    }
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
            <h1 className="text-4xl font-bold text-gray-800">Gestión de Ejercicios</h1>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Nuevo Ejercicio
          </button>
        </div>

        {/* Estadísticas por materia */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {['matematicas', 'geometria', 'problemas'].map((subject) => {
            const subjectExercises = exercises.filter(ex => ex.subject === subject);
            const subjectName = subject === 'matematicas' ? 'Matemáticas' : 
                              subject === 'geometria' ? 'Geometría' : 'Problemas';
            
            return (
              <div key={subject} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{getSubjectIcon(subject)}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{subjectName}</h3>
                    <p className="text-gray-600">{subjectExercises.length} ejercicios</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[4, 5, 6].map(grade => {
                    const gradeCount = subjectExercises.filter(ex => ex.grade === grade).length;
                    return (
                      <div key={grade} className="flex justify-between text-sm">
                        <span className="text-gray-600">{grade}° Grado:</span>
                        <span className="font-semibold">{gradeCount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

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
                    setFormData({ grade: 4, subject: 'matematicas', type: 'Suma', question: '', answer: '', difficulty: 'Fácil' });
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
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value={4}>Cuarto Grado</option>
                    <option value={5}>Quinto Grado</option>
                    <option value={6}>Sexto Grado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Materia</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => {
                      const newSubject = e.target.value;
                      setFormData({ 
                        ...formData, 
                        subject: newSubject,
                        type: subjectTypes[newSubject][0]
                      });
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value="matematicas">🔢 Matemáticas</option>
                    <option value="geometria">📐 Geometría</option>
                    <option value="problemas">🧩 Problemas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    {subjectTypes[formData.subject].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pregunta</label>
                  <textarea
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Ej: ¿Cuál es el perímetro de un cuadrado de 5 cm de lado?"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Respuesta</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dificultad</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Medio">Medio</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>

                <button
                  type="submit"
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
            <h2 className="text-2xl font-bold text-gray-800">Ejercicios Creados ({exercises.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Grado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Materia</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tipo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pregunta</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Respuesta</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Dificultad</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exercises.map((exercise) => (
                  <tr key={exercise.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{exercise.grade}°</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSubjectColor(exercise.subject)}`}>
                        {getSubjectIcon(exercise.subject)} {exercise.subject === 'matematicas' ? 'Matemáticas' : 
                         exercise.subject === 'geometria' ? 'Geometría' : 'Problemas'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">{exercise.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate">{exercise.question}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-bold">{exercise.answer}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(exercise.difficulty)}`}>
                        {exercise.difficulty}
                      </span>
                    </td>
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