const API_URL = 'http://localhost:3000/api';

const TeacherService = {
    getDashboardStats: async (token) => {
        try {
            const response = await fetch(`${API_URL}/dashboard/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard stats');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },

    getExercisePerformanceStats: async (token) => {
        try {
            const response = await fetch(`${API_URL}/dashboard/exercise-performance`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch exercise performance stats');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching exercise performance stats:', error);
            throw error;
        }
    },

    getStudentPerformanceStats: async (token) => {
        try {
            const response = await fetch(`${API_URL}/dashboard/student-performance`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch student performance stats');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching student performance stats:', error);
            throw error;
        }
    },

    getAchievementRewardDistribution: async (token) => {
        try {
            const response = await fetch(`${API_URL}/dashboard/achievement-reward-distribution`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch achievement and reward distribution');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching achievement and reward distribution:', error);
            throw error;
        }
    },
};

export default TeacherService;