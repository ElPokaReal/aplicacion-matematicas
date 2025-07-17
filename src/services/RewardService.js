const API_URL = 'http://localhost:3000/api';

const RewardService = {
    createReward: async (rewardData, token) => {
        try {
            const response = await fetch(`${API_URL}/recompensas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(rewardData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create reward');
            }
            return data;
        } catch (error) {
            console.error('Error creating reward:', error);
            throw error;
        }
    },

    getAllRewards: async (token) => {
        try {
            const response = await fetch(`${API_URL}/recompensas`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch rewards');
            }
            return data;
        } catch (error) {
            console.error('Error fetching rewards:', error);
            throw error;
        }
    },

    getRewardById: async (id, token) => {
        try {
            const response = await fetch(`${API_URL}/recompensas/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch reward');
            }
            return data;
        } catch (error) {
            console.error(`Error fetching reward with ID ${id}:`, error);
            throw error;
        }
    },

    updateReward: async (id, rewardData, token) => {
        try {
            const response = await fetch(`${API_URL}/recompensas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(rewardData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update reward');
            }
            return data;
        } catch (error) {
            console.error(`Error updating reward with ID ${id}:`, error);
            throw error;
        }
    },

    deleteReward: async (id, token) => {
        try {
            const response = await fetch(`${API_URL}/recompensas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete reward');
            }
            return data;
        } catch (error) {
            console.error(`Error deleting reward with ID ${id}:`, error);
            throw error;
        }
    },

    unlockReward: async (rewardId, token) => {
        try {
            const response = await fetch(`${API_URL}/recompensas/unlock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ recompensa_id: rewardId }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to unlock reward');
            }
            return data;
        } catch (error) {
            console.error('Error unlocking reward:', error);
            throw error;
        }
    },

    getUnlockedRewardsByStudent: async (studentId, token) => {
        try {
            const response = await fetch(`${API_URL}/recompensas/estudiante/${studentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch unlocked rewards');
            }
            return data;
        } catch (error) {
            console.error(`Error fetching unlocked rewards for student ${studentId}:`, error);
            throw error;
        }
    },
};

export default RewardService;
