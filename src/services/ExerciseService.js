const API_URL = 'http://localhost:3000/api';

const ExerciseService = {
    createExercise: async (exerciseData, token) => {
        try {
            const response = await fetch(`${API_URL}/ejercicios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(exerciseData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create exercise');
            }
            return data;
        } catch (error) {
            console.error('Error creating exercise:', error);
            throw error;
        }
    },

    getAllExercises: async (token, grade = null) => {
        try {
            const url = grade ? `${API_URL}/ejercicios?grado=${grade}` : `${API_URL}/ejercicios`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch exercises');
            }
            return data;
        } catch (error) {
            console.error('Error fetching exercises:', error);
            throw error;
        }
    },

    getExerciseById: async (id, token) => {
        try {
            const response = await fetch(`${API_URL}/ejercicios/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch exercise');
            }
            return data;
        } catch (error) {
            console.error(`Error fetching exercise with ID ${id}:`, error);
            throw error;
        }
    },

    updateExercise: async (id, exerciseData, token) => {
        try {
            const response = await fetch(`${API_URL}/ejercicios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(exerciseData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update exercise');
            }
            return data;
        } catch (error) {
            console.error(`Error updating exercise with ID ${id}:`, error);
            throw error;
        }
    },

    deleteExercise: async (id, token) => {
        try {
            const response = await fetch(`${API_URL}/ejercicios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete exercise');
            }
            return data;
        } catch (error) {
            console.error(`Error deleting exercise with ID ${id}:`, error);
            throw error;
        }
    },

    getTotalExercisesCountByGrade: async (grade, token) => {
        try {
            const response = await fetch(`${API_URL}/ejercicios/count/grado/${grade}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch total exercises count');
            }
            return data.count;
        } catch (error) {
            console.error(`Error fetching total exercises count for grade ${grade}:`, error);
            throw error;
        }
    },
};

export default ExerciseService;
