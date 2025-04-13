import { TaskWithAnimation } from '../types/task';

export const getDefaultTasks = (projectId: string): TaskWithAnimation[] => [
  {
    id: `${projectId}-1`,
    name: 'Research and Planning',
    completed: false,
    progress: 0.6,
    priority: 5,
    createdOn: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: `${projectId}-2`,
    name: 'Initial Setup',
    completed: true,
    progress: 1,
    priority: 4,
    createdOn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    completedOn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
]; 