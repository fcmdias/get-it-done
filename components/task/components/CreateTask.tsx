import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';

interface CreateTaskProps {
  onSubmit: (name: string) => void;
}

export const CreateTask = ({ onSubmit }: CreateTaskProps) => {
  const { theme } = useTheme();
  const [newTask, setNewTask] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    if (newTask.trim()) {
      onSubmit(newTask);
      setNewTask('');
      inputRef.current?.blur();
    }
  };

  return (
    <View style={[styles.inputContainer, {
      borderBottomColor: theme.border,
      backgroundColor: theme.background
    }]}>
      <TextInput
        ref={inputRef}
        style={[styles.input, {
          backgroundColor: theme.inputBackground,
          borderColor: theme.border,
          color: theme.text,
          fontSize: 16,
        }]}
        value={newTask}
        onChangeText={setNewTask}
        placeholder="Enter new task"
        placeholderTextColor={theme.placeholder}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={28} color={theme.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  addButton: {
    padding: 10,
  },
}); 