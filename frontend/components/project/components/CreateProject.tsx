import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';

interface CreateProjectProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export const CreateProject = ({ value, onChange, onSubmit }: CreateProjectProps) => {
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);

  const handleSubmitEditing = () => {
    onSubmit();
    inputRef.current?.blur();
  };

  return (
    <View style={[styles.inputContainer, {
      borderTopColor: theme.border,
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
        value={value}
        onChangeText={onChange}
        placeholder="Enter project name"
        placeholderTextColor={theme.placeholder}
        onSubmitEditing={handleSubmitEditing}
        returnKeyType="done"
      />
      <TouchableOpacity 
        onPress={onSubmit} 
        style={[styles.addButton, {
          backgroundColor: 'transparent'
        }]}
      >
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
    borderTopWidth: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});  