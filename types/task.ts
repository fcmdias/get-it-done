export interface Task {
  id: string;
  name: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface TaskWithAnimation extends Task {
  hidden?: boolean;
  animation?: Animated.Value;
} 