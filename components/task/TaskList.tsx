import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../../hooks/useTasks';
import { CreateTask } from './CreateTask';
import { Task } from '../../types/task';

interface TaskListProps {
  projectId: string;
  projectName: string;
  onBack: () => void;
  navigation: any;
}

export const TaskList = ({ projectId, projectName, onBack, navigation }: TaskListProps) => {
  const { theme } = useTheme();
  const { tasks, isLoading, addTask, toggleTaskStatus } = useTasks(projectId);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = async () => {
    if (newTask.trim()) {
      try {
        await addTask(newTask.trim());
        setNewTask('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={[
        styles.taskItem,
        { 
          backgroundColor: theme.card,
          borderColor: theme.border
        }
      ]}
      onPress={() => toggleTaskStatus(item.id)}
    >
      <View style={styles.taskContent}>
        <Ionicons
          name={item.isCompleted ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={item.isCompleted ? theme.success : theme.secondary}
        />
        <Text
          style={[
            styles.taskText,
            { 
              color: theme.text,
              textDecorationLine: item.isCompleted ? 'line-through' : 'none',
              opacity: item.isCompleted ? 0.5 : 1
            }
          ]}
        >
          {item.name}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('TaskDetails', { task: item, projectId })}
        style={styles.infoButton}
      >
        <Ionicons name="information-circle-outline" size={24} color={theme.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Tasks</Text>
      
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />

      <CreateTask
        value={newTask}
        onChange={setNewTask}
        onSubmit={handleAddTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  infoButton: {
    padding: 8,
  },
}); 