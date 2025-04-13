import { useState, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import { Task, TaskWithAnimation } from '../types/task';
import { getDefaultTasks } from '../constants/tasks';

export const useTasks = (projectId: string) => {
  const [tasks, setTasks] = useState<TaskWithAnimation[]>(() => getDefaultTasks(projectId));
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const taskAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  const addTask = (name: string) => {
    if (name.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        name: name.trim(),
        completed: false,
        progress: 0,
        priority: 1,
        createdOn: new Date(),
      };
      setTasks([...tasks, task]);
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            completed: !task.completed,
            completedOn: !task.completed ? new Date() : undefined,
            progress: !task.completed ? 1 : task.progress
          }
        : task
    ));
  };

  const updateTaskProgress = (taskId: string, progress: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, progress }
        : task
    ));
  };

  const updateTaskPriority = (taskId: string, priority: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, priority }
        : task
    ));
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      if (!a.completed && !b.completed) {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return b.createdOn.getTime() - a.createdOn.getTime();
      } else {
        return (b.completedOn?.getTime() || 0) - (a.completedOn?.getTime() || 0);
      }
    });
  }, [tasks]);

  return {
    tasks: sortedTasks,
    selectedTaskId,
    taskAnimations,
    setSelectedTaskId,
    addTask,
    toggleTask,
    updateTaskProgress,
    updateTaskPriority,
    setTasks,
  };
}; 