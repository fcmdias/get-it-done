import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform, Modal } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../../types/task';
import { useTasks } from '../../hooks/useTasks';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TaskDetailsPageProps {
  route: {
    params: {
      task: Task;
      projectId: string;
    };
  };
  navigation: any;
}

export const TaskDetailsPage = ({ route, navigation }: TaskDetailsPageProps) => {
  const { task: initialTask, projectId } = route.params;
  const { theme } = useTheme();
  const { updateTask, deleteTask } = useTasks(projectId);
  const [task, setTask] = useState(initialTask);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [selectedDate, setSelectedDate] = useState(task.dueDate || new Date());

  const handleUpdateTask = async (field: keyof Task, value: any) => {
    try {
      const updatedTask = { ...task, [field]: value };
      await updateTask(updatedTask);
      setTask(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(task.id);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Failed to delete task. Please try again.');
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      handleUpdateTask('dueDate', date);
    }
  };

  const handleTitleChange = (text: string) => {
    setTask(prev => ({ ...prev, name: text }));
  };

  const handleTitleSubmit = () => {
    handleUpdateTask('name', task.name);
    setIsEditingTitle(false);
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={styles.datePicker}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.primary }]}
                  onPress={() => {
                    setShowDatePicker(false);
                    handleUpdateTask('dueDate', selectedDate);
                  }}
                >
                  <Text style={[styles.modalButtonText, { color: theme.background }]}>
                    Done
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.card }]}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={[styles.modalButtonText, { color: theme.text }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    }

    return showDatePicker ? (
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="default"
        onChange={handleDateChange}
      />
    ) : null;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Task Details</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.section, { borderBottomColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.text }]}>Title</Text>
          <TextInput
            style={[styles.input, { 
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.card
            }]}
            value={task.name}
            onChangeText={handleTitleChange}
            onFocus={() => setIsEditingTitle(true)}
            onBlur={handleTitleSubmit}
            onSubmitEditing={handleTitleSubmit}
            returnKeyType="done"
          />
        </View>

        <View style={[styles.section, { borderBottomColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.text }]}>Priority</Text>
          <View style={styles.priorityContainer}>
            {[1, 2, 3].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.priorityButton,
                  {
                    backgroundColor: task.priority === level ? theme.primary : theme.card,
                    borderColor: theme.border
                  }
                ]}
                onPress={() => handleUpdateTask('priority', level)}
              >
                <Text style={[
                  styles.priorityText,
                  { color: task.priority === level ? theme.background : theme.text }
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.text }]}>Due Date</Text>
          <TouchableOpacity
            style={[styles.dateButton, { 
              backgroundColor: theme.card,
              borderColor: theme.border
            }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText, { color: theme.text }]}>
              {task.dueDate ? task.dueDate.toLocaleDateString() : 'Set due date'}
            </Text>
          </TouchableOpacity>
          {renderDatePicker()}
        </View>

        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: theme.danger }]}
          onPress={handleDeleteTask}
        >
          <Ionicons name="trash-outline" size={24} color={theme.background} />
          <Text style={[styles.deleteText, { color: theme.background }]}>Delete Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  datePicker: {
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 