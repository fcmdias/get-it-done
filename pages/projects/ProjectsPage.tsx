import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProjectList } from '../../components/project/ProjectList';
import { useTheme } from '../../theme/ThemeContext';
import { StatusBar } from 'expo-status-bar';

interface ProjectsPageProps {
  navigation: any;
}

export const ProjectsPage = ({ navigation }: ProjectsPageProps) => {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ProjectList
        navigation={navigation}
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