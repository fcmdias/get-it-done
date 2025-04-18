export interface Project {
  id: string;
  name: string;
  progress: number;
  motivation: number;
  priority: number;
  isActive: boolean;
}

export type FilterStatus = 'all' | 'active' | 'paused'; 