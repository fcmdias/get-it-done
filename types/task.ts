export interface Task {
  id: string;
  name: string;
  isCompleted: boolean;
  priority: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export interface TaskWithAnimation extends Task {
  hidden?: boolean;
  animation?: Animated.Value;
} 