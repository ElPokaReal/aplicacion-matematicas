import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, BookOpen, BarChart3, TrendingUp, UserPlus, Award, Gift, CheckCircle, Zap, XCircle, ArrowUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TeacherService from '../services/TeacherService';

function TeacherDashboard() {
  const navigate = useNavigate();
  const { teacherData, token, logout } = useAuth();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState(null);
  const [activityPage, setActivityPage] = useState(1);
  const [activityTotal, setActivityTotal] = useState(0);
  const [activityLoadingMore, setActivityLoadingMore] = useState(false);
  const ACTIVITY_LIMIT = 5;
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setLoading(false);
        setError('No authentication token found.');
        return;
      }
      try {
        const stats = await TeacherService.getDashboardStats(token);
        setDashboardStats(stats);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  useEffect(() => {
    const fetchRecentActivity = async (reset = false) => {
      if (!token) return;
      try {
        if (reset) setActivityPage(1);
        if (reset) setRecentActivity([]);
        setActivityLoading(true);
        const res = await fetch(`http://localhost:3000/api/dashboard/recent-activity?page=1&limit=${ACTIVITY_LIMIT}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar actividad reciente');
        const data = await res.json();
        setRecentActivity(data.eventos);
        setActivityTotal(data.total);
      } catch (err) {
        setActivityError('No se pudo cargar la actividad reciente.');
      } finally {
        setActivityLoading(false);
      }
    };
    fetchRecentActivity(true);
    // eslint-disable-next-line
  }, [token]);

  const handleLoadMoreActivity = async () => {
    const nextPage = activityPage + 1;
    setActivityLoadingMore(true);
    try {
      const res = await fetch(`http://localhost:3000/api/dashboard/recent-activity?page=${nextPage}&limit=${ACTIVITY_LIMIT}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al cargar más actividad');
      const data = await res.json();
      setRecentActivity(prev => [...prev, ...data.eventos]);
      setActivityPage(nextPage);
      setActivityTotal(data.total);
    } catch {
      setActivityError('No se pudo cargar más actividad.');
    } finally {
      setActivityLoadingMore(false);
    }
  };

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
    },
    {
      title: 'Gestión de Recompensas',
      description: 'Crear y editar recompensas',
      icon: Gift,
      color: 'from-yellow-400 to-orange-500',
      action: () => navigate('/maestro/recompensas')
    },
    {
      title: 'Gestión de Logros',
      description: 'Crear y editar logros',
      icon: Award,
      color: 'from-yellow-500 to-green-500',
      action: () => navigate('/maestro/logros')
    },
  ];

  const quickStats = [
    { label: 'Estudiantes Registrados', value: dashboardStats?.totalEstudiantes || '...', icon: UserPlus, color: 'bg-emerald-500' },
    { label: 'Ejercicios Creados', value: dashboardStats?.totalEjercicios || '...', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Logros Otorgados', value: dashboardStats?.totalLogrosOtorgados || '...', icon: Award, color: 'bg-green-500' },
    { label: 'Recompensas Desbloqueadas', value: dashboardStats?.totalRecompensasDesbloqueadas || '...', icon: TrendingUp, color: 'bg-purple-500' }
  ];

  // Mapeo de tipo de evento a icono y color
  const eventTypeMap = {
    nuevo_estudiante: { icon: UserPlus, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
    logro_obtenido: { icon: Award, color: 'bg-green-500', bg: 'bg-green-50' },
    recompensa_canjeada: { icon: Gift, color: 'bg-yellow-500', bg: 'bg-yellow-50' },
    nuevo_ejercicio: { icon: BookOpen, color: 'bg-purple-500', bg: 'bg-purple-50' },
    estudiante_activado: { icon: CheckCircle, color: 'bg-blue-500', bg: 'bg-blue-50' },
    estudiante_desactivado: { icon: XCircle, color: 'bg-red-500', bg: 'bg-red-50' },
    completo_grado: { icon: Zap, color: 'bg-indigo-500', bg: 'bg-indigo-50' }
  };

  function timeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Hace unos segundos';
    if (diff < 3600) return `Hace ${Math.floor(diff/60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff/3600)} h`;
    return date.toLocaleDateString();
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando panel...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

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

        {/* Actividad reciente (Dinámica + paginación) */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Actividad Reciente</h2>
          {activityLoading ? (
            <div className="text-gray-500">Cargando actividad...</div>
          ) : activityError ? (
            <div className="text-red-500">{activityError}</div>
          ) : recentActivity.length === 0 ? (
            <div className="text-gray-500">No hay actividad reciente.</div>
          ) : (
            <>
              <div className="space-y-4">
                {recentActivity.map((ev, idx) => {
                  const meta = eventTypeMap[ev.tipo] || { icon: Users, color: 'bg-gray-400', bg: 'bg-gray-50' };
                  const Icon = meta.icon;
                  return (
                    <div key={idx} className={`flex items-center gap-4 p-4 rounded-xl ${meta.bg}`}>
                      <div className={`w-10 h-10 ${meta.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{ev.descripcion}</p>
                        <p className="text-sm text-gray-600">{timeAgo(ev.fecha)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {recentActivity.length < activityTotal && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleLoadMoreActivity}
                    className="px-6 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all disabled:opacity-60"
                    disabled={activityLoadingMore}
                  >
                    {activityLoadingMore ? 'Cargando...' : 'Cargar más'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Botón flotante para subir al tope */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all flex items-center justify-center"
          aria-label="Subir al tope"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

export default TeacherDashboard;