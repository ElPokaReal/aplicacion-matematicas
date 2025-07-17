import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [isTeacher, setIsTeacher] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [isStudent, setIsStudent] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state
  const [authError, setAuthError] = useState(null); // New error state for auth issues

  const logout = useCallback(() => {
    setIsTeacher(false);
    setTeacherData(null);
    setIsStudent(false);
    setStudentData(null);
    setToken(null);
    setAuthError(null); // Clear any auth errors on logout
    localStorage.removeItem('teacherAuth');
    localStorage.removeItem('studentAuth');
    localStorage.removeItem('token');
    // Optionally, redirect to login page here
  }, []);

  const checkTokenExpiration = useCallback((currentToken) => {
    if (!currentToken) return;

    try {
      const payload = JSON.parse(atob(currentToken.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      if (currentTime >= expirationTime) {
        console.warn('Token has expired. Logging out...');
        setAuthError('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
        logout();
      } else {
        setAuthError(null);
      }
    } catch (error) {
      console.error('Error decoding token or checking expiration:', error);
      setAuthError('Error de autenticación. Por favor, inicie sesión nuevamente.');
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const savedTeacherAuth = localStorage.getItem('teacherAuth');
    const savedStudentAuth = localStorage.getItem('studentAuth');
    const savedToken = localStorage.getItem('token');

    if (savedToken) {
      checkTokenExpiration(savedToken);

      if (savedTeacherAuth) {
        const auth = JSON.parse(savedTeacherAuth);
        setIsTeacher(auth.isTeacher);
        setTeacherData(auth.teacherData);
        setToken(savedToken);
      } else if (savedStudentAuth) {
        const auth = JSON.parse(savedStudentAuth);
        setIsStudent(auth.isStudent);
        setStudentData(auth.studentData);
        setToken(savedToken);
      }
    }
    setLoading(false);

    // Set up interval to check token expiration periodically (e.g., every minute)
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        checkTokenExpiration(currentToken);
      } else {
        clearInterval(interval);
      }
    }, 60 * 1000); // Every 1 minute

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [checkTokenExpiration, logout]);

  const login = async (credentials, userType) => {
    try {
      let response;
      let data;
      let user;

      if (userType === 'teacher') {
        response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });
        data = await response.json();

        if (response.ok) {
          user = {
            id: data.id,
            name: data.nombre,
            email: data.email,
            role: data.role
          };
          setIsTeacher(true);
          setTeacherData(user);
          setIsStudent(false);
          setStudentData(null);
          setToken(data.token);
          localStorage.setItem('teacherAuth', JSON.stringify({ isTeacher: true, teacherData: user }));
          localStorage.removeItem('studentAuth');
          localStorage.setItem('token', data.token);
          setAuthError(null); // Clear any previous errors on successful login
          checkTokenExpiration(data.token); // Check expiration immediately after login
          return true;
        } else {
          console.error('Teacher login failed:', data.message);
          setAuthError(data.message || 'Error de inicio de sesión para maestro.');
          return false;
        }
      } else if (userType === 'student') {
        response = await fetch('http://localhost:3000/api/estudiantes/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ codigo_alumno: credentials.codigo_alumno }),
        });
        data = await response.json();

        if (response.ok) {
          user = {
            id: data.id,
            nombre: data.nombre,
            usuario: data.usuario,
            puntos_recompensa: data.puntos_recompensa,
            grado: data.grado,
            codigo_alumno: data.codigo_alumno,
            role: data.role
          };
          setIsStudent(true);
          setStudentData(user);
          setIsTeacher(false);
          setTeacherData(null);
          setToken(data.token);
          localStorage.setItem('studentAuth', JSON.stringify({ isStudent: true, studentData: user }));
          localStorage.removeItem('teacherAuth');
          localStorage.setItem('token', data.token);
          setAuthError(null); // Clear any previous errors on successful login
          checkTokenExpiration(data.token); // Check expiration immediately after login
          return true;
        } else {
          console.error('Student login failed:', data.message);
          setAuthError(data.message || 'Error de inicio de sesión para estudiante.');
          return false;
        }
      } else {
        console.error('Invalid user type for login.');
        setAuthError('Tipo de usuario inválido.');
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      setAuthError('Error de red o servidor. Intente de nuevo.');
      return false;
    }
  };

  const updateStudentPoints = useCallback((updatedStudent) => {
    setStudentData(updatedStudent);
    // Also update localStorage to persist the points
    const savedStudentAuth = localStorage.getItem('studentAuth');
    if (savedStudentAuth) {
      const auth = JSON.parse(savedStudentAuth);
      auth.studentData = updatedStudent;
      localStorage.setItem('studentAuth', JSON.stringify(auth));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isTeacher, teacherData, isStudent, studentData, token, loading, authError, login, logout, updateStudentPoints }}>
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