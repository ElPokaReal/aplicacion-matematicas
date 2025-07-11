import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, GraduationCap } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

function GradeSelection() {
  const navigate = useNavigate();
  const { progress } = useProgress();

  // Verificar si hay un estudiante logueado
  const currentStudent = JSON.parse(localStorage.getItem('currentStudent') || 'null');
  
  const handleBackNavigation = () => {
    // Si hay un estudiante logueado, ir a su dashboard
    // Si no, ir al menú principal
    if (currentStudent) {
      navigate('/estudiante');
    } else {
      navigate('/');
    }
  };
  const grades = [
    {
      id: '4',
      title: 'Cuarto Grado',
      description: 'Operaciones básicas y geometría simple',
      icon: BookOpen,
      color: 'from-green-400 to-green-600',
      topics: ['Suma y resta', 'Multiplicación básica', 'Figuras geométricas', 'Problemas simples']
    },
    {
      id: '5',
      title: 'Quinto Grado',
      description: 'Fracciones, decimales y áreas',
      icon: Users,
      color: 'from-blue-400 to-blue-600',
      topics: ['Fracciones', 'Números decimales', 'Perímetros y áreas', 'Problemas de lógica']
    },
    {
      id: '6',
      title: 'Sexto Grado',
      description: 'Álgebra básica, porcentajes y ángulos',
      icon: GraduationCap,
      color: 'from-purple-400 to-purple-600',
      topics: ['Álgebra básica', 'Porcentajes', 'Ángulos y figuras', 'Problemas complejos']
    }
  ];

  const getGradeProgress = (gradeId) => {
    const gradeKey = `grade${gradeId}`;
    const gradeProgress = progress[gradeKey];
    if (typeof gradeProgress === 'object' && 'completed' in gradeProgress) {
      return gradeProgress;
    }
    return { completed: 0, total: 0, stars: 0 };
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackNavigation}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {currentStudent ? 'Mi Dashboard' : 'Inicio'}
          </button>
          
          <h1 className="text-4xl font-bold text-white text-center flex-1">
            Selecciona tu Grado
          </h1>
          
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Grade Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {grades.map((grade) => {
            const gradeProgress = getGradeProgress(grade.id);
            const progressPercentage = gradeProgress.total > 0 ? 
              (gradeProgress.completed / gradeProgress.total) * 100 : 0;
            
            return (
              <div
                key={grade.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/ejercicios/${grade.id}`)}
              >
                <div className={`bg-gradient-to-r ${grade.color} p-6 text-white`}>
                  <grade.icon className="w-12 h-12 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">{grade.title}</h2>
                  <p className="text-white/90">{grade.description}</p>
                </div>
                
                <div className="p-6">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>{gradeProgress.completed}/{gradeProgress.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${grade.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-bold text-gray-700">{gradeProgress.stars} estrellas</span>
                  </div>

                  {/* Topics */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 text-sm">Temas incluidos:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {grade.topics.map((topic, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-white/80 text-lg">
            💡 ¡Elige tu grado y comienza a resolver ejercicios divertidos!
          </p>
        </div>
      </div>
    </div>
  );
}

export default GradeSelection;