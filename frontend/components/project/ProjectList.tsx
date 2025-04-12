import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useMemo, useRef } from 'react';
import Slider from '@react-native-community/slider';
import { Project } from './types';
import { BottomMenu } from '../common/BottomMenu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';

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
  const inputRef = useRef<TextInput>(null);
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
      inputRef.current?.blur();
    }
  };

  const handleSubmitEditing = () => {
    addProject();
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
  ) => (
    <View style={styles.levelControl}>
      <Text style={[styles.levelValue, { color: theme.text }]}>{value}</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={value}
        onValueChange={onUpdate}
        minimumTrackTintColor={theme.primary}
        maximumTrackTintColor={theme.disabled}
        thumbTintColor={theme.primary}
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
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Text style={[styles.title, { color: theme.text }]}>ALIV Projects</Text>
      
      <View style={styles.filterContainer}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              { borderColor: theme.border },
              filterStatus === 'all' && { borderColor: theme.primary }
            ]}
            onPress={() => setFilterStatus('all')}
          >
            <Text style={[
              styles.filterButtonText,
              { color: theme.text },
              filterStatus === 'all' && { color: theme.primary }
            ]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              { borderColor: theme.border },
              filterStatus === 'active' && { borderColor: theme.primary }
            ]}
            onPress={() => setFilterStatus('active')}
          >
            <Text style={[
              styles.filterButtonText,
              { color: theme.text },
              filterStatus === 'active' && { color: theme.primary }
            ]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              { borderColor: theme.border },
              filterStatus === 'paused' && { borderColor: theme.primary }
            ]}
            onPress={() => setFilterStatus('paused')}
          >
            <Text style={[
              styles.filterButtonText,
              { color: theme.text },
              filterStatus === 'paused' && { color: theme.primary }
            ]}>Paused</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[
            styles.sortButton,
            { borderColor: theme.border },
            sortByPriority && { borderColor: theme.primary }
          ]}
          onPress={() => setSortByPriority(!sortByPriority)}
        >
          <Text style={[
            styles.sortButtonText,
            { color: theme.text },
            sortByPriority && { color: theme.primary }
          ]}>Sort by Priority</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.list}
        data={filteredAndSortedProjects}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelectProject(item)}>
            <View style={[styles.projectItem, { 
              backgroundColor: theme.card,
              borderBottomColor: theme.border,
              shadowColor: theme.text,
              elevation: 3,
              marginHorizontal: 10,
              marginVertical: 5,
              borderRadius: 8,
            }]}>
              <View style={styles.projectHeader}>
                <Text style={[styles.projectName, { color: theme.text }]}>{item.name}</Text>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleProjectStatus(item.id);
                  }}
                  style={[styles.statusButton, { 
                    backgroundColor: item.isActive ? theme.success : theme.danger 
                  }]}
                >
                  <Text style={[styles.statusButtonText, { color: theme.background }]}>
                    {item.isActive ? '▶' : '⏸'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.metadataContainer}>
                <View style={styles.metadataItem}>
                  <Text style={[styles.label, { color: theme.secondary }]}>Progress</Text>
                  {renderLevelControl(
                    item.progress,
                    (value) => updateLevel(item.id, 'progress', value)
                  )}
                </View>
                
                <View style={styles.metadataItem}>
                  <Text style={[styles.label, { color: theme.secondary }]}>Motivation</Text>
                  {renderLevelControl(
                    item.motivation,
                    (value) => updateLevel(item.id, 'motivation', value)
                  )}
                </View>
                
                <View style={styles.metadataItem}>
                  <Text style={[styles.label, { color: theme.secondary }]}>Priority</Text>
                  {renderLevelControl(
                    item.priority,
                    (value) => updateLevel(item.id, 'priority', value)
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />

      <BottomMenu
        showInput
        onSettingsPress={onSettingsPress}
        inputComponent={
          <View style={[styles.inputContainer, {
            borderTopColor: theme.border,
            borderBottomColor: theme.border,
            backgroundColor: theme.background
          }]}>
            <TextInput
              ref={inputRef}
              style={[styles.input, {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                color: theme.text,
                fontSize: 16,
              }]}
              value={newProject}
              onChangeText={setNewProject}
              placeholder="Enter project name"
              placeholderTextColor={theme.placeholder}
              onSubmitEditing={handleSubmitEditing}
              returnKeyType="done"
            />
            <TouchableOpacity 
              onPress={addProject} 
              style={[styles.addButton, {
                backgroundColor: 'transparent'
              }]}
            >
              <Ionicons name="add-circle-outline" size={28} color={theme.primary} />
            </TouchableOpacity>
          </View>
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  filterButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 5,
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
    padding: 15,
    borderBottomWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 