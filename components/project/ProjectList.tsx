import React, { useState, useEffect } from 'react';
import { Text, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Project } from '../../types/project';
import { BottomMenu } from '../common/BottomMenu';
import { useTheme } from '../../theme/ThemeContext';
import { ProjectItem } from './ProjectItem';
import { CreateProject } from './CreateProject';
import { FilterButtons } from './FilterButtons';
import { useProjects } from '../../hooks/useProjects';

interface ProjectListProps {
  navigation: any;
}

export const ProjectList = ({ navigation }: ProjectListProps) => {
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
  const [showAddProject, setShowAddProject] = useState(false);

  // Set default filter to active and sort by priority
  useEffect(() => {
    setFilterStatus('active');
    setSortByPriority(true);
  }, []);

  const handleAddProject = () => {
    if (newProject.trim()) {
      addProject(newProject.trim());
      setNewProject('');
    }
  };

  const handleProjectPress = (project: Project) => {
    navigation.navigate('ProjectPage', {
      project,
      onUpdateProject: (updatedProject: Project) => {
        // Handle project update
        console.log('Project updated:', updatedProject);
      },
      onToggleStatus: (id: string) => {
        toggleProjectStatus(id);
      },
      onUpdateLevel: (id: string, field: 'progress' | 'motivation' | 'priority', value: number) => {
        updateLevel(id, field, value);
      }
    });
  };

  const renderItem = ({ item }: { item: Project }) => (
    <ProjectItem
      project={item}
      onSelect={() => handleProjectPress(item)}
      onToggleStatus={toggleProjectStatus}
      onUpdateLevel={updateLevel}
      navigation={navigation}
    />
  );

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
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <BottomMenu
        showInput
        navigation={navigation}
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
  listContent: {
    padding: 16,
  },
}); 