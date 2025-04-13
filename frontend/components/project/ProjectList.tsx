import { Text, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { Project } from '../../types/project';
import { BottomMenu } from '../common/BottomMenu';
import { useTheme } from '../../theme/ThemeContext';
import { useProjects } from '../../hooks/useProjects';
import { ProjectItem,  CreateProject , FilterButtons } from './';

interface ProjectListProps {
  onSelectProject: (project: Project) => void;
  onSettingsPress: () => void;
}

export const ProjectList = ({ onSelectProject, onSettingsPress }: ProjectListProps) => {
  const { theme } = useTheme();
  const {
    projects,
    filterStatus,
    sortByPriority,
    addProject,
    toggleProjectStatus,
    updateLevel,
    setFilterStatus,
    setSortByPriority,
  } = useProjects();
  const [newProject, setNewProject] = useState('');

  const handleAddProject = () => {
    addProject(newProject);
    setNewProject('');
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Text style={[styles.title, { color: theme.text }]}>ALIV Projects</Text>
      
      <FilterButtons
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        sortByPriority={sortByPriority}
        onSortChange={setSortByPriority}
      />

      <FlatList
        style={styles.list}
        data={projects}
        renderItem={({ item }) => (
          <ProjectItem
            project={item}
            onSelect={onSelectProject}
            onToggleStatus={toggleProjectStatus}
            onUpdateLevel={updateLevel}
          />
        )}
        keyExtractor={(item) => item.id}
      />

      <BottomMenu
        showInput
        onSettingsPress={onSettingsPress}
        inputComponent={
          <CreateProject
            value={newProject}
            onChange={setNewProject}
            onSubmit={handleAddProject}
          />
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  list: {
    flex: 1,
  },
}); 