import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ProgressContext = createContext(undefined);

const initialProgress = {
  grade4: { completed: 0, total: 20, stars: 0 },
  grade5: { completed: 0, total: 25, stars: 0 },
  grade6: { completed: 0, total: 30, stars: 0 },
  totalStars: 0,
  rewards: []
};

function progressReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_PROGRESS':
      const { grade, correct } = action.payload;
      const gradeKey = `grade${grade}`;
      const newGradeProgress = {
        ...state[gradeKey],
        completed: state[gradeKey].completed + 1,
        stars: correct ? state[gradeKey].stars + 1 : state[gradeKey].stars
      };
      
      const newTotalStars = state.totalStars + (correct ? 1 : 0);
      
      return {
        ...state,
        [gradeKey]: newGradeProgress,
        totalStars: newTotalStars
      };
    
    case 'ADD_REWARD':
      return {
        ...state,
        rewards: [...state.rewards, action.payload]
      };
    
    case 'LOAD_PROGRESS':
      return action.payload;
      
    default:
      return state;
  }
}

export function ProgressProvider({ children }) {
  const [progress, dispatch] = useReducer(progressReducer, initialProgress);

  useEffect(() => {
    const savedProgress = localStorage.getItem('mathAppProgress');
    if (savedProgress) {
      dispatch({ type: 'LOAD_PROGRESS', payload: JSON.parse(savedProgress) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mathAppProgress', JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (grade, correct) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: { grade, correct } });
  };

  const addReward = (reward) => {
    dispatch({ type: 'ADD_REWARD', payload: reward });
  };

  return (
    <ProgressContext.Provider value={{ progress, updateProgress, addReward }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}