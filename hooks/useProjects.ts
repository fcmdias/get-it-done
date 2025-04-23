import { useState, useEffect } from 'react';
import { Project } from '../types/project';
import { firestoreService } from '../services/firestore';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused'>('all');
  const [sortByPriority, setSortByPriority] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestoreService.subscribeToProjects((fetchedProjects) => {
      setProjects(fetchedProjects);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addProject = async (name: string) => {
    const newProject: Omit<Project, 'id'> = {
      name,
      isActive: true,
      progress: 1,
      motivation: 1,
      priority: 1,
      createdAt: new Date().toISOString(),
    };

    try {
      await firestoreService.addProject(newProject);
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const toggleProjectStatus = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    try {
      await firestoreService.updateProject(projectId, {
        isActive: !project.isActive
      });
    } catch (error) {
      console.error('Error toggling project status:', error);
      throw error;
    }
  };

  const updateLevel = async (projectId: string, field: 'progress' | 'motivation' | 'priority', value: number) => {
    try {
      await firestoreService.updateProject(projectId, {
        [field]: value
      });
    } catch (error) {
      console.error('Error updating project level:', error);
      throw error;
    }
  };

  const filteredAndSortedProjects = projects
    .filter(project => 
      filterStatus === 'all' || 
      (filterStatus === 'active' && project.isActive) || 
      (filterStatus === 'paused' && !project.isActive)
    )
    .sort((a, b) => {
      if (sortByPriority) {
        return b.priority - a.priority;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return {
    projects: filteredAndSortedProjects,
    filterStatus,
    sortByPriority,
    isLoading,
    addProject,
    toggleProjectStatus,
    updateLevel,
    setFilterStatus,
    setSortByPriority,
  };
}; 