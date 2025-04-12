import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { ProjectList } from './components/project/ProjectList';
import TaskList from './components/task/TaskList';
import { Project } from './components/project/types';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { Settings } from './components/settings/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const goToHome = () => {
    setSelectedProject(null);
    setShowSettings(false);
  };

  if (showSettings) {
    return (
      <Settings 
        onBack={() => setShowSettings(false)}
        onHomePress={goToHome}
      />
    );
  }

  if (selectedProject) {
    return (
      <TaskList
        projectId={selectedProject.id}
        projectName={selectedProject.name}
        onBack={() => setSelectedProject(null)}
        onSettingsPress={() => setShowSettings(true)}
        onHomePress={goToHome}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ProjectList 
        onSelectProject={setSelectedProject}
        onSettingsPress={() => setShowSettings(true)}
      />
      <StatusBar style={theme.isDark ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
});