import { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';

export const useTasks = (projectId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setIsLoading(false);
      return;
    }

    const tasksRef = collection(db, 'users', user.uid, 'projects', projectId, 'tasks');
    const q = query(tasksRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, {
      next: (snapshot) => {
        const tasksData = snapshot.docs.map(doc => {
          const data = doc.data();
          const now = new Date();
          return {
            id: doc.id,
            name: data.name || '',
            isCompleted: data.isCompleted || false,
            priority: data.priority || 1,
            createdAt: data.createdAt ? (data.createdAt instanceof Date ? data.createdAt : data.createdAt.toDate()) : now,
            updatedAt: data.updatedAt ? (data.updatedAt instanceof Date ? data.updatedAt : data.updatedAt.toDate()) : now,
            dueDate: data.dueDate ? (data.dueDate instanceof Date ? data.dueDate : data.dueDate.toDate()) : null,
            ownerId: data.ownerId || user.uid,
          } as Task;
        });
        setTasks(tasksData);
        setIsLoading(false);
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [projectId]);

  const addTask = async (name: string) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const now = new Date();
    const task: Omit<Task, 'id'> = {
      name,
      isCompleted: false,
      priority: 1,
      createdAt: now,
      updatedAt: now,
      ownerId: user.uid,
    };

    const tasksRef = collection(db, 'users', user.uid, 'projects', projectId, 'tasks');
    await addDoc(tasksRef, task);
  };

  const updateTask = async (task: Task) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const taskRef = doc(db, 'users', user.uid, 'projects', projectId, 'tasks', task.id);

    const now = new Date();
    const updateData = {
      name: task.name,
      isCompleted: task.isCompleted,
      priority: task.priority,
      updatedAt: now,
      ownerId: user.uid,
      // Only include dueDate if it exists
      ...(task.dueDate && { dueDate: task.dueDate }),
    };

    await updateDoc(taskRef, updateData);
  };

  const toggleTaskStatus = async (taskId: string) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const taskRef = doc(db, 'users', user.uid, 'projects', projectId, 'tasks', taskId);

      const now = new Date();
      await updateDoc(taskRef, {
        isCompleted: !task.isCompleted,
        updatedAt: now,
        ownerId: user.uid,
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const taskRef = doc(db, 'users', user.uid, 'projects', projectId, 'tasks', taskId);
    await deleteDoc(taskRef);
  };

  const sortedTasks = tasks.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    tasks: sortedTasks,
    isLoading,
    addTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
  };
}; 