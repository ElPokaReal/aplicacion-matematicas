const API_URL = 'http://localhost:3000/api';

const StudentService = {
    registerStudent: async (studentData, token) => {
        try {
            const response = await fetch(`${API_URL}/estudiantes/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(studentData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to register student');
            }
            return data;
        } catch (error) {
            console.error('Error registering student:', error);
            throw error;
        }
    },

    getAllStudents: async (token) => {
        try {
            const response = await fetch(`${API_URL}/estudiantes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch students');
            }
            return data;
        } catch (error) {
            console.error('Error fetching students:', error);
            throw error;
        }
    },

    getStudentById: async (id, token) => {
        try {
            const response = await fetch(`${API_URL}/estudiantes/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch student');
            }
            return data;
        } catch (error) {
            console.error(`Error fetching student with ID ${id}:`, error);
            throw error;
        }
    },

    updateStudent: async (id, studentData, token) => {
        try {
            const response = await fetch(`${API_URL}/estudiantes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(studentData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update student');
            }
            return data;
        } catch (error) {
            console.error(`Error updating student with ID ${id}:`, error);
            throw error;
        }
    },

    deleteStudent: async (id, token) => {
        try {
            const response = await fetch(`${API_URL}/estudiantes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete student');
            }
            return data;
        } catch (error) {
            console.error(`Error deleting student with ID ${id}:`, error);
            throw error;
        }
    },

    getStudentProgress: async (studentId, token) => {
        try {
            const response = await fetch(`${API_URL}/progreso-estudiantes/estudiante/${studentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch student progress');
            }
            return data;
        } catch (error) {
            console.error(`Error fetching student progress for ID ${studentId}:`, error);
            throw error;
        }
    },

    recordProgress: async (progressData, token) => {
        try {
            const response = await fetch(`${API_URL}/progreso-estudiantes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(progressData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to record progress');
            }
            return data.estudiante;
        } catch (error) {
            console.error('Error recording progress:', error);
            throw error;
        }
    },

    toggleStudentStatus: async (id, currentStatus, token) => {
        try {
            const response = await fetch(`${API_URL}/estudiantes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ esta_activo: !currentStatus }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to toggle student status');
            }
            return data;
        } catch (error) {
            console.error(`Error toggling student status for ID ${id}:`, error);
            throw error;
        }
    },

    getAggregatedProgressByStudentAndGrade: async (studentId, token) => {
        try {
            const response = await fetch(`${API_URL}/progreso-estudiantes/estudiante/${studentId}/aggregated-by-grade`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch aggregated student progress');
            }
            return data;
        } catch (error) {
            console.error(`Error fetching aggregated student progress for ID ${studentId}:`, error);
            throw error;
        }
    },

    getCompletedExercisesByStudentAndGrade: async (studentId, grade, token) => {
        try {
            const response = await fetch(`${API_URL}/progreso-estudiantes/estudiante/${studentId}/grado/${grade}/completed-exercises`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch completed exercises');
            }
            return data;
        } catch (error) {
            console.error(`Error fetching completed exercises for student ${studentId} and grade ${grade}:`, error);
            throw error;
        }
    },
};

export default StudentService;
