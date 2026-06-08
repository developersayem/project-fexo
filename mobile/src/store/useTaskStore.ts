import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  priorityColor: string;
  category: string;
  estimatedTime: string; // e.g. "4h"
  loggedTime: number; // in hours
  status: 'In Progress' | 'Pending' | 'Completed';
  isTracking: boolean;
  dueDate?: string;
}

interface TaskState {
  tasks: Task[];
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'loggedTime' | 'isTracking' | 'priorityColor'>) => void;
  togglePlayPause: (id: string) => void;
  toggleComplete: (id: string) => void;
  incrementLoggedTime: (id: string, amount: number) => void;
  deleteTask: (id: string) => void;
  resetTasks: () => void;
}

const PRIORITY_COLORS = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#10b981',
};

const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Fix payment gateway timeout',
    description: 'Investigate payment gateway timeout errors occurring under high load.',
    priority: 'Critical',
    priorityColor: PRIORITY_COLORS.Critical,
    category: 'Backend',
    estimatedTime: '4h',
    loggedTime: 2.5,
    status: 'In Progress',
    isTracking: true,
    dueDate: 'Today',
  },
  {
    id: '2',
    title: 'Redesign onboarding flow screens',
    description: 'Apply high-fidelity UI layout designs to the signup and login screens.',
    priority: 'High',
    priorityColor: PRIORITY_COLORS.High,
    category: 'Frontend',
    estimatedTime: '6h',
    loggedTime: 1.0,
    status: 'Pending',
    isTracking: false,
    dueDate: 'Tomorrow',
  },
  {
    id: '3',
    title: 'Configure CI/CD pipeline cache',
    description: 'Set up GitHub Actions dependency caching to speed up build jobs.',
    priority: 'Medium',
    priorityColor: PRIORITY_COLORS.Medium,
    category: 'DevOps',
    estimatedTime: '3h',
    loggedTime: 3.2,
    status: 'In Progress',
    isTracking: false,
    dueDate: 'Jun 12',
  },
  {
    id: '4',
    title: 'Update API reference for v2 endpoints',
    description: 'Document the new parameters and responses for the rest api v2.',
    priority: 'Low',
    priorityColor: PRIORITY_COLORS.Low,
    category: 'Docs',
    estimatedTime: '2h',
    loggedTime: 0,
    status: 'Pending',
    isTracking: false,
    dueDate: 'Jun 15',
  },
  {
    id: '5',
    title: 'Add rate limiting middleware',
    description: 'Protect public APIs from rate abuse using token-bucket algorithm.',
    priority: 'Low',
    priorityColor: PRIORITY_COLORS.Low,
    category: 'Backend',
    estimatedTime: '2h',
    loggedTime: 1.8,
    status: 'Completed',
    isTracking: false,
    dueDate: 'Yesterday',
  },
];

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: DEFAULT_TASKS,

      addTask: (task) =>
        set((state) => {
          const id = String(Date.now());
          const newTask: Task = {
            ...task,
            id,
            loggedTime: 0,
            isTracking: false,
            priorityColor: PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium,
          };
          return { tasks: [newTask, ...state.tasks] };
        }),

      togglePlayPause: (id) =>
        set((state) => {
          const target = state.tasks.find((t) => t.id === id);
          if (!target) return {};

          const wasTracking = target.isTracking;

          return {
            tasks: state.tasks.map((t) => {
              if (t.id === id) {
                return {
                  ...t,
                  status: wasTracking ? 'Pending' : 'In Progress',
                  isTracking: !wasTracking,
                };
              }
              // Pause other tasks if starting this one
              if (!wasTracking && t.isTracking) {
                return { ...t, isTracking: false, status: 'Pending' };
              }
              return t;
            }),
          };
        }),

      toggleComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id === id) {
              const isCompleted = t.status === 'Completed';
              return {
                ...t,
                status: isCompleted ? 'Pending' : 'Completed',
                isTracking: false, // Stop tracking if completed
              };
            }
            return t;
          }),
        })),

      incrementLoggedTime: (id, amount) =>
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id === id && t.isTracking) {
              const updatedTime = Number((t.loggedTime + amount).toFixed(2));
              return { ...t, loggedTime: updatedTime };
            }
            return t;
          }),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      resetTasks: () =>
        set({
          tasks: DEFAULT_TASKS,
        }),
    }),
    {
      name: 'fexo-task-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
