import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useMemo } from 'react';
import Slider from '@react-native-community/slider';
import { Project } from './types';

type FilterStatus = 'all' | 'active' | 'paused';

interface ProjectListProps {
  onSelectProject: (project: Project) => void;
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

export const ProjectList = ({ onSelectProject }: ProjectListProps) => {
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

  const renderLevelControl = (
    value: number,
    onUpdate: (newValue: number) => void,
    color: string
  ) => (
    <View style={styles.levelControl}>
      <Text style={styles.levelValue}>{value}</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={value}
        onValueChange={onUpdate}
        minimumTrackTintColor={color}
        maximumTrackTintColor="#D1D1D1"
        thumbTintColor={color}
      />
    </View>
  );

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
    <View style={styles.container}>
      <Text style={styles.title}>ALIV Projects</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newProject}
          onChangeText={setNewProject}
          placeholder="Enter project name"
        />
        <Button title="Add Project" onPress={addProject} />
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setFilterStatus('all')}
          >
            <Text style={[
              styles.filterButtonText,
              filterStatus === 'all' && styles.filterButtonTextActive
            ]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'active' && styles.filterButtonActive
            ]}
            onPress={() => setFilterStatus('active')}
          >
            <Text style={[
              styles.filterButtonText,
              filterStatus === 'active' && styles.filterButtonTextActive
            ]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'paused' && styles.filterButtonActive
            ]}
            onPress={() => setFilterStatus('paused')}
          >
            <Text style={[
              styles.filterButtonText,
              filterStatus === 'paused' && styles.filterButtonTextActive
            ]}>Paused</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[styles.sortButton, sortByPriority && styles.sortButtonActive]}
          onPress={() => setSortByPriority(!sortByPriority)}
        >
          <Text style={[
            styles.sortButtonText,
            sortByPriority && styles.sortButtonTextActive
          ]}>Sort by Priority</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.list}
        data={filteredAndSortedProjects}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelectProject(item)}>
            <View style={styles.projectItem}>
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{item.name}</Text>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleProjectStatus(item.id);
                  }}
                  style={[styles.statusButton, { backgroundColor: item.isActive ? '#4CAF50' : '#FF5722' }]}
                >
                  <Text style={styles.statusButtonText}>
                    {item.isActive ? '▶' : '⏸'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.metadataContainer}>
                <View style={styles.metadataItem}>
                  <Text style={styles.label}>Progress</Text>
                  {renderLevelControl(
                    item.progress,
                    (value) => updateLevel(item.id, 'progress', value),
                    '#2196F3'
                  )}
                </View>
                
                <View style={styles.metadataItem}>
                  <Text style={styles.label}>Motivation</Text>
                  {renderLevelControl(
                    item.motivation,
                    (value) => updateLevel(item.id, 'motivation', value),
                    '#4CAF50'
                  )}
                </View>
                
                <View style={styles.metadataItem}>
                  <Text style={styles.label}>Priority</Text>
                  {renderLevelControl(
                    item.priority,
                    (value) => updateLevel(item.id, 'priority', value),
                    '#FF9800'
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
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
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  filterButtonActive: {
    borderColor: '#2196F3',
  },
  filterButtonText: {
    fontSize: 16,
  },
  filterButtonTextActive: {
    fontWeight: 'bold',
  },
  sortButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  sortButtonActive: {
    borderColor: '#2196F3',
  },
  sortButtonText: {
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  projectItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  projectName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusButton: {
    padding: 5,
    borderRadius: 5,
  },
  statusButtonText: {
    fontSize: 16,
  },
  metadataContainer: {
    flexDirection: 'row',
  },
  metadataItem: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  levelControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelValue: {
    marginRight: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
}); 