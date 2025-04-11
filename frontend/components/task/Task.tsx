import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { TaskWithAnimation } from './types';
import { SwipeHandle } from './SwipeHandle';

interface TaskProps {
  item: TaskWithAnimation;
  selectedTaskId: string | null;
  taskAnimations: { [key: string]: Animated.Value };
  onSelect: (id: string | null) => void;
  onToggle: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onUpdatePriority: (id: string, priority: number) => void;
  createPanResponder: (taskId: string) => any;
}

export const Task = ({
  item,
  selectedTaskId,
  taskAnimations,
  onSelect,
  onToggle,
  onUpdateProgress,
  onUpdatePriority,
  createPanResponder
}: TaskProps) => {
  if (item.hidden) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <View style={styles.taskWrapper}>
      <Animated.View 
        style={[
          styles.taskContent,
          {
            transform: [{
              translateX: taskAnimations[item.id] || new Animated.Value(0)
            }]
          }
        ]}
      >
        <TouchableOpacity 
          onPress={() => onSelect(selectedTaskId === item.id ? null : item.id)}
        >
          <View style={styles.taskItem}>
            <View style={styles.taskHeader}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={(e) => {
                  e.stopPropagation();
                  onToggle(item.id);
                }}
              >
                <Text style={styles.checkbox}>{item.completed ? '✓' : '○'}</Text>
              </TouchableOpacity>
              <Text style={[
                styles.taskName,
                item.completed && styles.taskCompleted
              ]}>{item.name}</Text>
              {!item.completed && (
                <Text style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                  P{item.priority}
                </Text>
              )}
            </View>
            
            {selectedTaskId === item.id && (
              <View style={styles.taskDetails}>
                <Text style={styles.dateLabel}>Created: {formatDate(item.createdOn)}</Text>
                {item.completed && item.completedOn && (
                  <Text style={styles.dateLabel}>Completed: {formatDate(item.completedOn)}</Text>
                )}
                
                {!item.completed && (
                  <View style={styles.priorityContainer}>
                    <Text style={styles.label}>Priority:</Text>
                    <Slider
                      style={styles.prioritySlider}
                      minimumValue={1}
                      maximumValue={5}
                      step={1}
                      value={item.priority}
                      onValueChange={(value) => onUpdatePriority(item.id, value)}
                      minimumTrackTintColor="#FF9800"
                      maximumTrackTintColor="#D1D1D1"
                      thumbTintColor="#FF9800"
                    />
                    <Text style={styles.priorityValue}>{item.priority}</Text>
                  </View>
                )}

                <View style={styles.progressContainer}>
                  <Text style={styles.progressLabel}>
                    Progress: {Math.round(item.progress * 100)}%
                  </Text>
                  <Slider
                    style={styles.progressSlider}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.1}
                    value={item.progress}
                    onValueChange={(value) => onUpdateProgress(item.id, value)}
                    minimumTrackTintColor="#4CAF50"
                    maximumTrackTintColor="#D1D1D1"
                    thumbTintColor="#4CAF50"
                    disabled={item.completed}
                  />
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>

      <SwipeHandle
        taskId={item.id}
        taskAnimations={taskAnimations}
        createPanResponder={createPanResponder}
      />
    </View>
  );
};

// Move styles and getPriorityColor here... 