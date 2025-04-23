import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TaskList } from '@/components/task/TaskList';
import { useTheme } from '@/theme/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Project } from '@/types/project';

interface ProjectPageProps {
  route: {
    params: {
      project: Project;
      onUpdateProject: (project: Project) => void;
      onToggleStatus: (id: string) => void;
      onUpdateLevel: (id: string, field: 'progress' | 'motivation' | 'priority', value: number) => void;
    };
  };
  navigation: any;
}

export const ProjectPage = ({ route, navigation }: ProjectPageProps) => {
  const { project: initialProject, onUpdateProject, onToggleStatus, onUpdateLevel } = route.params;
  const { theme } = useTheme();
  const [project, setProject] = useState(initialProject);

  const handleProjectUpdate = (updatedProject: Project) => {
    setProject(updatedProject);
    onUpdateProject(updatedProject);
  };

  const handleSettingsPress = () => {
    navigation.navigate('ProjectSettings', {
      project,
      onUpdateProject: handleProjectUpdate,
      onToggleStatus,
      onUpdateLevel
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>{project.name}</Text>
        <TouchableOpacity 
          onPress={handleSettingsPress}
          style={styles.settingsButton}
        >
          <MaterialCommunityIcons 
            name="cog" 
            size={24} 
            color={theme.secondary} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TaskList 
          projectId={project.id}
          projectName={project.name}
          onBack={() => navigation.navigate('Projects')}
          navigation={navigation}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 5,
  },
  content: {
    flex: 1,
  },
}); 