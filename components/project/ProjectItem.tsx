import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Project } from '@/types/project';

interface ProjectItemProps {
  project: Project;
  onSelect: () => void;
  onUpdateLevel: (id: string, field: 'progress' | 'motivation' | 'priority', value: number) => void;
  navigation: any;
}

export const ProjectItem = ({ project, onSelect, onUpdateLevel, navigation }: ProjectItemProps) => {
  const { theme } = useTheme();

  const handleLevelChange = (field: 'progress' | 'motivation' | 'priority', value: number) => {
    onUpdateLevel(project.id, field, value);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.card }]}
      onPress={onSelect}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>{project.name}</Text>
        </View>

        <View style={styles.levels}>
          <View style={styles.level}>
            <MaterialCommunityIcons name="chart-line" size={16} color={theme.secondary} />
            <Text style={[styles.levelText, { color: theme.text }]}>{project.progress}</Text>
          </View>
          <View style={styles.level}>
            <MaterialCommunityIcons name="lightning-bolt" size={16} color={theme.secondary} />
            <Text style={[styles.levelText, { color: theme.text }]}>{project.motivation}</Text>
          </View>
          <View style={styles.level}>
            <MaterialCommunityIcons name="star" size={16} color={theme.secondary} />
            <Text style={[styles.levelText, { color: theme.text }]}>{project.priority}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  levels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  level: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    marginLeft: 4,
    fontSize: 14,
  },
}); 