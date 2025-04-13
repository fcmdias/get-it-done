import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { Project } from './types/project';
import { ThemeProvider } from './theme/ThemeContext';
import { ProjectsPage, TasksPage, SettingsPage } from './pages';

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) {
    return (
      <SettingsPage
        onBack={() => setShowSettings(false)}
        onHomePress={() => setShowSettings(false)}
      />
    );
  }

  if (selectedProject) {
    return (
      <TasksPage
        projectId={selectedProject.id}
        projectName={selectedProject.name}
        onBack={() => setSelectedProject(null)}
        onSettingsPress={() => setShowSettings(true)}
        onHomePress={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <ProjectsPage 
      onSelectProject={setSelectedProject}
      onSettingsPress={() => setShowSettings(true)}
    />
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