import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import TaskList from '../../components/task/TaskList';
import { useTheme } from '../../theme/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import { Project } from '../../types/project';

interface ProjectPageProps {
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

export const ProjectPage = ({ route, navigation }: ProjectPageProps) => {
  const { project, onUpdateProject, onToggleStatus, onUpdateLevel } = route.params;
  const { theme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

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
          onValueChange={(newValue) => onUpdateLevel(project.id, field, newValue)}
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
        <Text style={[styles.title, { color: theme.text }]}>{project.name}</Text>
        <TouchableOpacity 
          onPress={() => setShowSettings(!showSettings)}
          style={[styles.settingsButton, { 
            backgroundColor: showSettings ? theme.secondary : 'transparent' 
          }]}
        >
          <MaterialCommunityIcons 
            name="cog" 
            size={24} 
            color={showSettings ? theme.background : theme.secondary} 
          />
        </TouchableOpacity>
      </View>

      {showSettings ? (
        <ScrollView style={styles.content}>
          <View style={[styles.settingsContainer, { backgroundColor: theme.card }]}>
            <View style={styles.statusSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Status</Text>
              <TouchableOpacity
                onPress={() => onToggleStatus(project.id)}
                style={[styles.statusButton, { 
                  backgroundColor: project.isActive ? theme.success : theme.danger 
                }]}
              >
                <Text style={[styles.statusButtonText, { color: theme.background }]}>
                  {project.isActive ? 'Active' : 'Paused'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.levelsSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Project Metrics</Text>
              {renderLevelControl('Progress', project.progress, 'progress')}
              {renderLevelControl('Motivation', project.motivation, 'motivation')}
              {renderLevelControl('Priority', project.priority, 'priority')}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.content}>
          <TaskList 
            projectId={project.id}
            projectName={project.name}
            onBack={() => navigation.navigate('Projects')}
            navigation={navigation}
          />
        </View>
        )}
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
  settingsButton: {
    padding: 8,
    borderRadius: 5,
  },
  content: {
    flex: 1,
  },
  settingsContainer: {
    margin: 16,
    padding: 16,
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
}); 