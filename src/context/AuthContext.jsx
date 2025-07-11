import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [isTeacher, setIsTeacher] = useState(false);
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('teacherAuth');
    if (savedAuth) {
      const auth = JSON.parse(savedAuth);
      setIsTeacher(auth.isTeacher);
      setTeacherData(auth.teacherData);
    }
  }, []);

  const login = (email, password) => {
    // Simulación de login - en producción conectar con backend
    if (email === 'maestro@escuela.com' && password === 'maestro123') {
      const teacher = {
        id: 1,
        name: 'Prof. María González',
        email: email,
        school: 'Escuela Primaria Benito Juárez'
      };
      
      setIsTeacher(true);
      setTeacherData(teacher);
      
      localStorage.setItem('teacherAuth', JSON.stringify({
        isTeacher: true,
        teacherData: teacher
      }));
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsTeacher(false);
    setTeacherData(null);
    localStorage.removeItem('teacherAuth');
  };

  return (
    <AuthContext.Provider value={{ isTeacher, teacherData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}