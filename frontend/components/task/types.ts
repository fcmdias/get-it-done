export interface Task {
  id: string;
  name: string;
  completed: boolean;
  progress: number;
  priority: number;
  createdOn: Date;
  completedOn?: Date;
}

export interface TaskWithAnimation extends Task {
  hidden?: boolean;
  animation?: Animated.Value;
} 