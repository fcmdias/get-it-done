import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { TaskWithAnimation } from '../../../types/task';
import { useTheme } from '../../../theme/ThemeContext';
import { SwipeHandle } from './SwipeHandle';

interface TaskItemProps {
  task: TaskWithAnimation;
  panResponder: any;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  toggleTask: (id: string) => void;
  updateTaskProgress: (id: string, progress: number) => void;
  updateTaskPriority: (id: string, priority: number) => void;
  formatDate: (date: Date) => string;
}

export const TaskItem = ({
  task,
  panResponder,
  selectedTaskId,
  setSelectedTaskId,
  toggleTask,
  updateTaskProgress,
  updateTaskPriority,
  formatDate,
}: TaskItemProps) => {
  const { theme } = useTheme();

  const getPriorityColor = (priority: number): string => {
    const colors = {
      1: '#90CAF9',
      2: '#4CAF50',
      3: '#FFA726',
      4: '#F57C00',
      5: '#D32F2F',
    };
    return colors[priority as keyof typeof colors] || colors[1];
  };

  return (
    <View style={styles.taskWrapper}>
      <Animated.View 
        style={[
          styles.taskContent,
          {
            transform: [{
              translateX: task.animation || new Animated.Value(0)
            }]
          }
        ]}
      >
        <TouchableOpacity 
          onPress={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}
        >
          <View style={[styles.taskItem, { 
            backgroundColor: theme.card,
            borderColor: theme.border
          }]}>
            <View style={styles.taskHeader}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => toggleTask(task.id)}
              >
                <Text style={[styles.checkbox, { color: theme.success }]}>
                  {task.completed ? '✓' : '○'}
                </Text>
              </TouchableOpacity>
              <Text style={[
                styles.taskName,
                { color: theme.text },
                task.completed && { color: theme.secondary }
              ]}>{task.name}</Text>
              {!task.completed && (
                <Text style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                  P{task.priority}
                </Text>
              )}
            </View>
            
            {selectedTaskId === task.id && (
              <View style={styles.taskDetails}>
                <Text style={[styles.dateLabel, { color: theme.secondary }]}>
                  Created: {formatDate(task.createdOn)}
                </Text>
                {task.completed && task.completedOn && (
                  <Text style={[styles.dateLabel, { color: theme.secondary }]}>
                    Completed: {formatDate(task.completedOn)}
                  </Text>
                )}
                
                {!task.completed && (
                  <View style={styles.priorityContainer}>
                    <Text style={[styles.label, { color: theme.secondary }]}>Priority:</Text>
                    <Slider
                      style={styles.prioritySlider}
                      minimumValue={1}
                      maximumValue={5}
                      step={1}
                      value={task.priority}
                      onValueChange={(value) => updateTaskPriority(task.id, value)}
                      minimumTrackTintColor={theme.primary}
                      maximumTrackTintColor={theme.disabled}
                      thumbTintColor={theme.primary}
                    />
                    <Text style={[styles.priorityValue, { color: theme.secondary }]}>
                      {task.priority}
                    </Text>
                  </View>
                )}

                <View style={styles.progressContainer}>
                  <Text style={[styles.progressLabel, { color: theme.secondary }]}>
                    Progress: {Math.round(task.progress * 100)}%
                  </Text>
                  <Slider
                    style={styles.progressSlider}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.1}
                    value={task.progress}
                    onValueChange={(value) => updateTaskProgress(task.id, value)}
                    minimumTrackTintColor={theme.success}
                    maximumTrackTintColor={theme.disabled}
                    thumbTintColor={theme.success}
                    disabled={task.completed}
                  />
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>

      <SwipeHandle
        taskId={task.id}
        taskAnimations={{ [task.id]: task.animation }}
        panResponder={panResponder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  taskWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1',
  },
  taskContent: {
    flex: 1,
  },
  taskItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 5,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    padding: 5,
  },
  checkbox: {
    fontSize: 20,
  },
  taskName: {
    fontSize: 16,
    marginLeft: 10,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
  },
  priorityBadge: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#D1D1D1',
    marginLeft: 10,
  },
  taskDetails: {
    marginTop: 10,
  },
  dateLabel: {
    fontSize: 14,
  },
  priorityContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
  },
  prioritySlider: {
    width: '100%',
    height: 40,
  },
  priorityValue: {
    fontSize: 14,
    marginLeft: 10,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressSlider: {
    width: '100%',
    height: 40,
  },
});