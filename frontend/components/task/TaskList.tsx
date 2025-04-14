import { View, Text, StyleSheet, FlatList, Animated, PanResponder, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { BottomMenu } from '../common/BottomMenu';
import { useTheme } from '../../theme/ThemeContext';
import { useTasks } from '../../hooks/useTasks';
import { TaskItem } from './components/TaskItem';
import { CreateTask } from './components/CreateTask';
import { TaskWithAnimation } from '../../types/task';

interface TaskListProps {
  projectId: string;
  projectName: string;
  onBack: () => void;
  navigation: any;
}

export default function TaskList({ projectId, projectName, onBack, onSettingsPress, onHomePress, navigation }: TaskListProps) {
  const { theme } = useTheme();
  const { tasks, selectedTaskId, taskAnimations, setSelectedTaskId, addTask, toggleTask, updateTaskProgress, updateTaskPriority } = useTasks(projectId);

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
          setSelectedTaskId(null);
          
          setTimeout(() => {
            setSelectedTaskId(taskId);
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
    const panResponder = createPanResponder(item.id);

    return (
      <TaskItem
        task={item}
        panResponder={panResponder}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        toggleTask={toggleTask}
        updateTaskProgress={updateTaskProgress}
        updateTaskPriority={updateTaskPriority}
        formatDate={formatDate}
      />
    );
  };

  const handleSubmitEditing = (name: string) => {
    addTask(name);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Tasks</Text>
      </View>

      <FlatList
        style={styles.list}
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />

      <BottomMenu
        showInput
        inputComponent={
          <CreateTask
            onSubmit={handleSubmitEditing}
          />
        }
        navigation={navigation}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    fontSize: 16,
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
    marginVertical: 2,
    borderRadius: 2,
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
  },
  addButton: {
    padding: 10,
  },
}); 