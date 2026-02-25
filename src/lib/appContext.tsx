import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AppState, Task, CompletedTask } from './types';

interface AppContextType {
  state: AppState;
  setUserName: (name: string) => void;
  setActiveTask: (task: Task | null) => void;
  updateActiveTask: (updater: (task: Task) => Task) => void;
  addToHistory: (task: CompletedTask) => void;
  clearState: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const initialState: AppState = {
  userName: null,
  activeTask: null,
  history: [],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<AppState>('tea-task-app', initialState);

  const setUserName = (name: string) => {
    setState(prev => ({ ...prev, userName: name }));
  };

  const setActiveTask = (task: Task | null) => {
    setState(prev => ({ ...prev, activeTask: task }));
  };

  const updateActiveTask = (updater: (task: Task) => Task) => {
    setState(prev => {
      if (!prev.activeTask) return prev;
      return { ...prev, activeTask: updater(prev.activeTask) };
    });
  };

  const addToHistory = (task: CompletedTask) => {
    setState(prev => ({
      ...prev,
      history: [task, ...prev.history].slice(0, 5),
      activeTask: null,
    }));
  };

  const clearState = () => setState(initialState);

  return (
    <AppContext.Provider value={{ state, setUserName, setActiveTask, updateActiveTask, addToHistory, clearState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
