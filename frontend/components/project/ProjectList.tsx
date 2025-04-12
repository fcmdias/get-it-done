import { View, Text, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useMemo } from 'react';
import { Project } from './types';
import { BottomMenu } from '../common/BottomMenu';
import { useTheme } from '../../theme/ThemeContext';
import { ProjectItem } from './ProjectItem';
import { CreateProject } from './CreateProject';
import { FilterButtons } from './FilterButtons';

type FilterStatus = 'all' | 'active' | 'paused';

interface ProjectListProps {
  onSelectProject: (project: Project) => void;
  onSettingsPress: () => void;
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Learn React Native',
    progress: 3,
    motivation: 4,
    priority: 5,
    isActive: true,
  },
  {
    id: '2',
    name: 'Build Portfolio Website',
    progress: 2,
    motivation: 5,
    priority: 4,
    isActive: true,
  },
  {
    id: '3',
    name: 'Write Blog Posts',
    progress: 1,
    motivation: 3,
    priority: 2,
    isActive: false,
  }
];

export const ProjectList = ({ onSelectProject, onSettingsPress }: ProjectListProps) => {
  const { theme } = useTheme();
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [newProject, setNewProject] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('active');
  const [sortByPriority, setSortByPriority] = useState(true);

  const addProject = () => {
    if (newProject.trim()) {
      const project: Project = {
        id: Date.now().toString(),
        name: newProject.trim(),
        progress: 1,
        motivation: 1,
        priority: 1,
        isActive: true
      };
      setProjects([...projects, project]);
      setNewProject('');
    }
  };

  const toggleProjectStatus = (id: string) => {
    setProjects(projects.map(project => 
      project.id === id 
        ? { ...project, isActive: !project.isActive }
        : project
    ));
  };

  const updateLevel = (id: string, field: 'progress' | 'motivation' | 'priority', value: number) => {
    setProjects(projects.map(project =>
      project.id === id
        ? { ...project, [field]: Math.max(1, Math.min(5, value)) }
        : project
    ));
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...projects];
    
    if (filterStatus === 'active') {
      filtered = filtered.filter(project => project.isActive);
    } else if (filterStatus === 'paused') {
      filtered = filtered.filter(project => !project.isActive);
    }

    if (sortByPriority) {
      filtered.sort((a, b) => b.priority - a.priority);
    }

    return filtered;
  }, [projects, filterStatus, sortByPriority]);

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
        data={filteredAndSortedProjects}
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
            onSubmit={addProject}
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