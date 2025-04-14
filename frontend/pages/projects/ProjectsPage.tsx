import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProjectList } from '../../components/project/ProjectList';
import { useTheme } from '../../theme/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { Project } from '../../types/project';

interface ProjectsPageProps {
  navigation: any;
}

export const ProjectsPage = ({ navigation }: ProjectsPageProps) => {
  const { theme, isDark } = useTheme();

  const handleUpdateProject = (project: Project) => {
    // Your update logic here
  };

  const handleToggleStatus = (id: string) => {
    // Your toggle status logic here
  };

  const handleUpdateLevel = (id: string, field: string, value: any) => {
    // Your update level logic here
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ProjectList
        navigation={navigation}
        onUpdateProject={handleUpdateProject}
        onToggleStatus={handleToggleStatus}
        onUpdateLevel={handleUpdateLevel}
      />
      <StatusBar style={isDark ? "light" : "dark"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 60,
  },
}); 