import { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { firestoreService } from '../services/firestore';

export const useTasks = (projectId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestoreService.subscribeToTasks(projectId, (fetchedTasks) => {
      setTasks(fetchedTasks);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  const addTask = async (name: string) => {
    const newTask: Omit<Task, 'id'> = {
      name,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await firestoreService.addTask(projectId, newTask);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const toggleTaskStatus = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      await firestoreService.updateTask(projectId, taskId, {
        isCompleted: !task.isCompleted
      });
    } catch (error) {
      console.error('Error toggling task status:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await firestoreService.deleteTask(projectId, taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const sortedTasks = tasks.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    tasks: sortedTasks,
    isLoading,
    addTask,
    toggleTaskStatus,
    deleteTask,
  };
}; 