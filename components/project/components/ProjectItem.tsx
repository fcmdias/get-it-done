import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Project } from '../../../types/project';
import { useTheme } from '../../../theme/ThemeContext';
import { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProjectItemProps {
  project: Project;
  onSelect: (project: Project) => void;
  onToggleStatus: (id: string) => void;
  onUpdateLevel: (id: string, field: 'progress' | 'motivation' | 'priority', value: number) => void;
  navigation: any; // You might want to properly type this based on your navigation setup
}

export const ProjectItem = ({ project, onSelect, onToggleStatus, onUpdateLevel, navigation }: ProjectItemProps) => {
  const { theme } = useTheme();

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

  return (
    <TouchableOpacity 
      onPress={() => {
        navigation.navigate('ProjectPage', {
          project: project,
          onUpdateProject: onSelect,
          onToggleStatus: onToggleStatus,
          onUpdateLevel: onUpdateLevel
        });
      }}
    >
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
          <Text style={[styles.projectName, { color: theme.text }]}>{project.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  metadataContainer: {
    flexDirection: 'column',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  metadataItem: {
    marginBottom: 10,
    width: '100%',
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
    flex: 1,
    height: 40,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  statusButton: {
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  statusButtonText: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
});  