import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface CreateTaskProps {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
}

export const CreateTask = ({ value, onChange, onSubmit }: CreateTaskProps) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { borderTopColor: theme.border }]}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.inputBorder,
          }
        ]}
        placeholder="Add a new task"
        placeholderTextColor={theme.secondary}
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        returnKeyType="done"
      />
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={onSubmit}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 8,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 