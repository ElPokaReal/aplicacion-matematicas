import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, BookOpen, BarChart3, Settings, MessageCircle, Award, TrendingUp, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function TeacherDashboard() {
  const navigate = useNavigate();
  const { teacherData, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      title: 'Registro de Estudiantes',
      description: 'Registrar y gestionar estudiantes',
      icon: UserPlus,
      color: 'from-emerald-500 to-emerald-600',
      action: () => navigate('/maestro/registro')
    },
    {
      title: 'Gestión de Ejercicios',
      description: 'Crear y editar contenido educativo',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/maestro/ejercicios')
    },
    {
      title: 'Seguimiento de Estudiantes',
      description: 'Monitorear progreso y desempeño',
      icon: Users,
      color: 'from-green-500 to-green-600',
      action: () => navigate('/maestro/estudiantes')
    },
    {
      title: 'Estadísticas y Reportes',
      description: 'Análisis detallado de resultados',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/maestro/estadisticas')
    }
  ];

  const quickStats = [
    { label: 'Estudiantes Registrados', value: '24', icon: UserPlus, color: 'bg-emerald-500' },
    { label: 'Estudiantes Activos', value: '21', icon: Users, color: 'bg-blue-500' },
    { label: 'Ejercicios Creados', value: '156', icon: BookOpen, color: 'bg-green-500' },
    { label: 'Promedio General', value: '87%', icon: TrendingUp, color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Panel del Maestro 👩‍🏫
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Bienvenido/a, {teacherData?.name}
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-all shadow-lg"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Menú principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={item.action}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className={`bg-gradient-to-r ${item.color} p-6 text-white`}>
                <item.icon className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/90">{item.description}</p>
              </div>
              <div className="p-6">
                <button className={`w-full bg-gradient-to-r ${item.color} text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all`}>
                  Acceder
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Actividad reciente */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Actividad Reciente</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Nuevo estudiante registrado: Diego Ruiz</p>
                <p className="text-sm text-gray-600">Hace 1 hora</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Ana García completó 5 ejercicios de multiplicación</p>
                <p className="text-sm text-gray-600">Hace 2 horas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Carlos Mendoza obtuvo una medalla de oro</p>
                <p className="text-sm text-gray-600">Hace 4 horas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Nuevo ejercicio de geometría creado</p>
                <p className="text-sm text-gray-600">Ayer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;