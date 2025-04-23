export interface Project {
  id: string;
  name: string;
  progress: number;
  motivation: number;
  priority: number;
  isActive: boolean;
  createdAt: string;
}

export type FilterStatus = 'all' | 'active' | 'paused'; 