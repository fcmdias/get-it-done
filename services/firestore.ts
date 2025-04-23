import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Project } from '../types/project';
import { Task } from '../types/task';

const getCurrentUserId = () => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');
  return user.uid;
};

export const firestoreService = {
  // Projects
  getProjects: async (): Promise<Project[]> => {
    const userId = getCurrentUserId();
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('projects')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
  },

  addProject: async (project: Omit<Project, 'id'>): Promise<string> => {
    const userId = getCurrentUserId();
    const docRef = await firestore()
      .collection('users')
      .doc(userId)
      .collection('projects')
      .add(project);
    
    return docRef.id;
  },

  updateProject: async (projectId: string, updates: Partial<Project>): Promise<void> => {
    const userId = getCurrentUserId();
    await firestore()
      .collection('users')
      .doc(userId)
      .collection('projects')
      .doc(projectId)
      .update(updates);
  },

  deleteProject: async (projectId: string): Promise<void> => {
    const userId = getCurrentUserId();
    await firestore()
      .collection('users')
      .doc(userId)
      .collection('projects')
      .doc(projectId)
      .delete();
  },

  // Tasks
  getTasks: async (projectId: string): Promise<Task[]> => {
    const userId = getCurrentUserId();
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('projects')
      .doc(projectId)
      .collection('tasks')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
  },

  addTask: async (projectId: string, task: Omit<Task, 'id'>): Promise<string> => {
    const userId = getCurrentUserId();
    const docRef = await firestore()
      .collection('users')
      .doc(userId)
      .collection('projects')
      .doc(projectId)
      .collection('tasks')
      .add(task);
    
    return docRef.id;
  },

  updateTask: async (projectId: string, taskId: string, updates: Partial<Task>): Promise<void> => {
    const userId = getCurrentUserId();
    await firestore()
      .collection('users')
      .doc(userId)
      .collection('projects')
      .doc(projectId)
      .collection('tasks')
      .doc(taskId)
      .update(updates);
  },

  deleteTask: async (projectId: string, taskId: string): Promise<void> => {
    const userId = getCurrentUserId();
    await firestore()
      .collection('users')
      .doc(userId)
      .collection('projects')
      .doc(projectId)
      .collection('tasks')
      .doc(taskId)
      .delete();
  },

  // Real-time listeners
  subscribeToProjects: (callback: (projects: Project[]) => void) => {
    const userId = getCurrentUserId();
    return firestore()
      .collection('users')
      .doc(userId)
      .collection('projects')
      .onSnapshot(
        snapshot => {
          if (!snapshot) {
            console.warn('No snapshot received from Firestore');
            callback([]);
            return;
          }
          const projects = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Project[];
          callback(projects);
        },
        error => {
          console.error('Error in projects subscription:', error);
          callback([]);
        }
      );
  },

  subscribeToTasks: (projectId: string, callback: (tasks: Task[]) => void) => {
    const userId = getCurrentUserId();
    return firestore()
      .collection('users')
      .doc(userId)
      .collection('projects')
      .doc(projectId)
      .collection('tasks')
      .onSnapshot(
        snapshot => {
          if (!snapshot) {
            console.warn('No snapshot received from Firestore');
            callback([]);
            return;
          }
          const tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Task[];
          callback(tasks);
        },
        error => {
          console.error('Error in tasks subscription:', error);
          callback([]);
        }
      );
  }
}; 