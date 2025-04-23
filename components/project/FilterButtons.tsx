import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface FilterButtonsProps {
  filterStatus: 'all' | 'active' | 'paused';
  onFilterChange: (status: 'all' | 'active' | 'paused') => void;
  sortByPriority: boolean;
  onSortChange: (sortByPriority: boolean) => void;
}

export const FilterButtons = ({ 
  filterStatus, 
  onFilterChange, 
  sortByPriority, 
  onSortChange 
}: FilterButtonsProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { 
              backgroundColor: filterStatus === 'all' ? theme.primary : theme.card,
              borderColor: theme.border
            }
          ]}
          onPress={() => onFilterChange('all')}
        >
          <Ionicons 
            name="list" 
            size={20} 
            color={filterStatus === 'all' ? 'white' : theme.text} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { 
              backgroundColor: filterStatus === 'active' ? theme.primary : theme.card,
              borderColor: theme.border
            }
          ]}
          onPress={() => onFilterChange('active')}
        >
          <Ionicons 
            name="play" 
            size={20} 
            color={filterStatus === 'active' ? 'white' : theme.text} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { 
              backgroundColor: filterStatus === 'paused' ? theme.primary : theme.card,
              borderColor: theme.border
            }
          ]}
          onPress={() => onFilterChange('paused')}
        >
          <Ionicons 
            name="pause" 
            size={20} 
            color={filterStatus === 'paused' ? 'white' : theme.text} 
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.sortButton,
          { 
            backgroundColor: sortByPriority ? theme.primary : theme.card,
            borderColor: theme.border
          }
        ]}
        onPress={() => onSortChange(!sortByPriority)}
      >
        <Ionicons 
          name="star" 
          size={20} 
          color={sortByPriority ? 'white' : theme.text} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
}); 