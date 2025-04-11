import { View, Text, StyleSheet, FlatList, TextInput, Button, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { useState, useMemo, useRef } from 'react';
import Slider from '@react-native-community/slider';

interface Task {
  id: string;
  name: string;
  completed: boolean;
  progress: number;
  priority: number;
  createdOn: Date;
  completedOn?: Date;
}

interface TaskListProps {
  projectId: string;
  projectName: string;
  onBack: () => void;
}

interface TaskWithAnimation extends Task {
  hidden?: boolean;
  animation?: Animated.Value;
}

const getDefaultTasks = (projectId: string): TaskWithAnimation[] => [
  {
    id: `${projectId}-1`,
    name: 'Research and Planning',
    completed: false,
    progress: 0.6,
    priority: 5,
    createdOn: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  {
    id: `${projectId}-2`,
    name: 'Initial Setup',
    completed: true,
    progress: 1,
    priority: 4,
    createdOn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    completedOn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: `${projectId}-3`,
    name: 'Implementation',
    completed: false,
    progress: 0.3,
    priority: 3,
    createdOn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: `${projectId}-4`,
    name: 'Testing',
    completed: false,
    progress: 0,
    priority: 2,
    createdOn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  }
];

export default function TaskList({ projectId, projectName, onBack }: TaskListProps) {
  const [tasks, setTasks] = useState<TaskWithAnimation[]>(() => getDefaultTasks(projectId));
  const [newTask, setNewTask] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const taskAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        name: newTask.trim(),
        completed: false,
        progress: 0,
        priority: 1,
        createdOn: new Date(),
      };
      setTasks([...tasks, task]);
      setNewTask('');
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const createPanResponder = (taskId: string) => {
    if (!taskAnimations[taskId]) {
      taskAnimations[taskId] = new Animated.Value(0);
    }
    const position = taskAnimations[taskId];
    
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const screenWidth = Dimensions.get('window').width;
        
        // If we've passed the 20% threshold, trigger the full swipe animation
        if (gesture.dx < -screenWidth * 0.2) {
          position.setValue(-screenWidth);
          // Trigger the hide action
          setTasks(prevTasks => 
            prevTasks.map(task => 
              task.id === taskId ? { ...task, hidden: true } : task
            )
          );
          
          setTimeout(() => {
            setTasks(prevTasks => 
              prevTasks.map(task => 
                task.id === taskId ? { ...task, hidden: false } : task
              )
            );
            position.setValue(0);
          }, 10000);
        } else {
          // Otherwise just follow the finger
          position.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        const screenWidth = Dimensions.get('window').width;
        
        // If we haven't passed the threshold on release, spring back
        if (gesture.dx >= -screenWidth * 0.2) {
          Animated.spring(position, {
            toValue: 0,
            useNativeDriver: true,
            friction: 6,
            tension: 80,
            velocity: 3,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(position, {
          toValue: 0,
          useNativeDriver: true,
          friction: 6,
          tension: 80,
          velocity: 3,
        }).start();
      },
    });
  };

  const renderTask = ({ item }: { item: TaskWithAnimation }) => {
    if (item.hidden) return null;

    const panResponder = createPanResponder(item.id);

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
            onPress={() => setSelectedTaskId(selectedTaskId === item.id ? null : item.id)}
          >
            <View style={styles.taskItem}>
              <View style={styles.taskHeader}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleTask(item.id);
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
                        onValueChange={(value) => updateTaskPriority(item.id, value)}
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
                      onValueChange={(value) => updateTaskProgress(item.id, value)}
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

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.swipeHandle,
            {
              transform: [{
                translateX: taskAnimations[item.id] || new Animated.Value(0)
              }]
            }
          ]}
        >
          <View style={styles.handleBar} />
          <View style={styles.handleBar} />
          <View style={styles.handleBar} />
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{projectName} Tasks</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTask}
          onChangeText={setNewTask}
          placeholder="Enter new task"
        />
        <Button title="Add Task" onPress={addTask} />
      </View>

      <FlatList
        style={styles.list}
        data={sortedTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: '#2196F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskWrapper: {
    marginBottom: 15,
    position: 'relative',
  },
  taskContent: {
    width: '100%',
  },
  taskItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskName: {
    fontSize: 16,
    flex: 1,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  checkbox: {
    fontSize: 24,
    color: '#4CAF50',
  },
  progressContainer: {
    marginTop: 5,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  progressSlider: {
    height: 40,
  },
  taskDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  checkboxContainer: {
    padding: 5,
    marginRight: 10,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priorityContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  prioritySlider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  priorityValue: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  label: {
    fontSize: 14,
    color: '#666',
    width: 60,
  },
  swipeHandle: {
    width: 80,
    height: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
  handleBar: {
    width: 4,
    height: 4,
    backgroundColor: '#666',
    marginVertical: 2,
    borderRadius: 2,
  },
}); 