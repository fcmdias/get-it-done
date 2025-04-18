import { Project } from '../types/project';

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Learn React Native',
    progress: 3,
    motivation: 4,
    priority: 5,
    isActive: true,
  },
  {
    id: '2',
    name: 'Build Portfolio Website',
    progress: 2,
    motivation: 5,
    priority: 4,
    isActive: true,
  },
  {
    id: '3',
    name: 'Write Blog Posts',
    progress: 1,
    motivation: 3,
    priority: 2,
    isActive: false,
  }
]; 