import React, { createContext, useContext } from 'react';

export const StudentContext = createContext(null);

export const useStudentContext = () => {
  const ctx = useContext(StudentContext);
  if (!ctx) {
    // Safe fallback when used outside Provider (e.g., dashboard renders directly)
    return {
      currentModule: 'dashboard',
      setCurrentModule: () => {},
    };
  }
  return ctx;
};


