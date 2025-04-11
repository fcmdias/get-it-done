import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { ProjectList } from './components/project/ProjectList';
import TaskList from './components/task/TaskList';
import { Project } from './components/project/types';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (selectedProject) {
    return (
      <TaskList
        projectId={selectedProject.id}
        projectName={selectedProject.name}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ProjectList onSelectProject={setSelectedProject} />
      <StatusBar style="auto" />
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