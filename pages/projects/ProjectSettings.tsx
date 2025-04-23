import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import { Project } from '@/types/project';
import { firestoreService } from '@/services/firestore';

interface ProjectSettingsProps {
  route: {
    params: {
      project: Project;
      onUpdateProject: (project: Project) => void;
      onToggleStatus: (id: string) => void;
      onUpdateLevel: (id: string, field: 'progress' | 'motivation' | 'priority', value: number) => void;
    };
  };
  navigation: any;
}

export const ProjectSettings = ({ route, navigation }: ProjectSettingsProps) => {
  const { project, onUpdateProject, onToggleStatus, onUpdateLevel } = route.params;
  const { theme } = useTheme();
  const [editedName, setEditedName] = useState(project.name);
  const [currentProject, setCurrentProject] = useState(project);

  const handleNameEdit = async () => {
    if (editedName.trim() && editedName !== project.name) {
      try {
        const updatedProject = {
          ...project,
          name: editedName.trim()
        };
        await firestoreService.updateProject(project.id, {
          name: editedName.trim()
        });
        setCurrentProject(updatedProject);
        onUpdateProject(updatedProject);
      } catch (error) {
        console.error('Error updating project name:', error);
      }
    }
  };

  const handleStatusToggle = async () => {
    try {
      await firestoreService.updateProject(project.id, {
        isActive: !currentProject.isActive
      });
      setCurrentProject(prev => ({
        ...prev,
        isActive: !prev.isActive
      }));
      onToggleStatus(project.id);
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const handleDeleteProject = async () => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestoreService.deleteProject(project.id);
              navigation.navigate('Projects');
            } catch (error) {
              console.error('Error deleting project:', error);
              Alert.alert('Error', 'Failed to delete project. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderLevelControl = (
    label: string,
    value: number,
    field: 'progress' | 'motivation' | 'priority'
  ) => (
    <View style={styles.levelControl}>
      <Text style={[styles.label, { color: theme.secondary }]}>{label}</Text>
      <View style={styles.sliderContainer}>
        <Text style={[styles.levelValue, { color: theme.text }]}>{value}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={value}
          onValueChange={(newValue) => {
            setCurrentProject(prev => ({
              ...prev,
              [field]: newValue
            }));
            onUpdateLevel(project.id, field, newValue);
          }}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.disabled}
          thumbTintColor={theme.primary}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Project Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.settingsContainer, { backgroundColor: theme.card }]}>
          <View style={styles.nameSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Project Name</Text>
            <View style={styles.nameContainer}>
              <TextInput
                style={[styles.nameInput, { color: theme.text }]}
                value={editedName}
                onChangeText={setEditedName}
                onBlur={handleNameEdit}
                onSubmitEditing={handleNameEdit}
                placeholder="Enter project name"
                placeholderTextColor={theme.disabled}
              />
            </View>
          </View>

          <View style={styles.statusSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Status</Text>
            <TouchableOpacity
              onPress={handleStatusToggle}
              style={[styles.statusButton, { 
                backgroundColor: currentProject.isActive ? theme.success : theme.danger 
              }]}
            >
              <Text style={[styles.statusButtonText, { color: theme.background }]}>
                {currentProject.isActive ? 'Active' : 'Paused'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.levelsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Project Metrics</Text>
            {renderLevelControl('Progress', currentProject.progress, 'progress')}
            {renderLevelControl('Motivation', currentProject.motivation, 'motivation')}
            {renderLevelControl('Priority', currentProject.priority, 'priority')}
          </View>

          <View style={styles.deleteSection}>
            <Text style={[styles.sectionTitle, { color: theme.danger }]}>Danger Zone</Text>
            <TouchableOpacity
              onPress={handleDeleteProject}
              style={[styles.deleteButton, { backgroundColor: theme.danger }]}
            >
              <MaterialCommunityIcons name="delete" size={20} color={theme.background} />
              <Text style={[styles.deleteButtonText, { color: theme.background }]}>
                Delete Project
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  settingsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  nameSection: {
    marginBottom: 24,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  statusSection: {
    marginBottom: 24,
  },
  levelsSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusButton: {
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 16,
  },
  levelControl: {
    marginBottom: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  levelValue: {
    width: 30,
    marginRight: 8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  deleteSection: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 24,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
}); 