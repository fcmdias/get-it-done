import { useState, useMemo } from 'react';
import { Project, FilterStatus } from '../types/project';
import { DEFAULT_PROJECTS } from '../constants/projects';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('active');
  const [sortByPriority, setSortByPriority] = useState(true);

  const addProject = (name: string) => {
    if (name.trim()) {
      const project: Project = {
        id: Date.now().toString(),
        name: name.trim(),
        progress: 1,
        motivation: 1,
        priority: 1,
        isActive: true
      };
      setProjects([...projects, project]);
    }
  };

  const toggleProjectStatus = (id: string) => {
    setProjects(projects.map(project => 
      project.id === id 
        ? { ...project, isActive: !project.isActive }
        : project
    ));
  };

  const updateLevel = (id: string, field: keyof Pick<Project, 'progress' | 'motivation' | 'priority'>, value: number) => {
    setProjects(projects.map(project =>
      project.id === id
        ? { ...project, [field]: Math.max(1, Math.min(5, value)) }
        : project
    ));
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...projects];
    
    if (filterStatus === 'active') {
      filtered = filtered.filter(project => project.isActive);
    } else if (filterStatus === 'paused') {
      filtered = filtered.filter(project => !project.isActive);
    }

    if (sortByPriority) {
      filtered.sort((a, b) => b.priority - a.priority);
    }

    return filtered;
  }, [projects, filterStatus, sortByPriority]);

  return {
    projects: filteredAndSortedProjects,
    filterStatus,
    sortByPriority,
    addProject,
    toggleProjectStatus,
    updateLevel,
    setFilterStatus,
    setSortByPriority,
  };
}; 