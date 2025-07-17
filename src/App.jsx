import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import HomePage from './components/HomePage';
import StudentDashboard from './components/StudentDashboard';
import GradeSelection from './components/GradeSelection';
import ExerciseArea from './components/ExerciseArea';
import ProgressPage from './components/ProgressPage';
import RewardsPage from './components/RewardsPage';
import TeacherLogin from './components/TeacherLogin';
import TeacherDashboard from './components/TeacherDashboard';
import ExerciseManagement from './components/ExerciseManagement';
import StudentTracking from './components/StudentTracking';
import StatisticsReports from './components/StatisticsReports';
import StudentRegistration from './components/StudentRegistration';
import { useAuth } from './context/AuthContext';

function App() {
  const { authError, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 via-mint-200 to-yellow-100">
        <p className="text-xl text-gray-700">Cargando autenticación...</p>
      </div>
    );
  }

  return (
    <>
      <Router>
        {authError && (
          <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-3 text-center z-50 shadow-lg">
            {authError}
          </div>
        )}
        <div className="min-h-screen bg-gradient-to-br from-sky-200 via-mint-200 to-yellow-100" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/estudiante" element={<StudentDashboard />} />
            <Route path="/grados" element={<GradeSelection />} />
            <Route path="/ejercicios/:grado" element={<ExerciseArea />} />
            <Route path="/progreso" element={<ProgressPage />} />
            <Route path="/recompensas" element={<RewardsPage />} />
            <Route path="/maestro/login" element={<TeacherLogin />} />
            <Route path="/maestro/dashboard" element={<TeacherDashboard />} />
            <Route path="/maestro/ejercicios" element={<ExerciseManagement />} />
            <Route path="/maestro/estudiantes" element={<StudentTracking />} />
            <Route path="/maestro/estadisticas" element={<StatisticsReports />} />
            <Route path="/maestro/registro" element={<StudentRegistration />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;