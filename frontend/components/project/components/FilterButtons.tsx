import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

interface FilterButtonsProps {
  filterStatus: 'all' | 'active' | 'paused';
  onFilterChange: (status: 'all' | 'active' | 'paused') => void;
  sortByPriority: boolean;
  onSortChange: (sort: boolean) => void;
}

export const FilterButtons = ({ 
  filterStatus, 
  onFilterChange, 
  sortByPriority, 
  onSortChange 
}: FilterButtonsProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles.filterContainer}>
      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { borderColor: theme.border },
            filterStatus === 'all' && { borderColor: theme.primary }
          ]}
          onPress={() => onFilterChange('all')}
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
          onPress={() => onFilterChange('active')}
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
          onPress={() => onFilterChange('paused')}
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
        onPress={() => onSortChange(!sortByPriority)}
      >
        <Text style={[
          styles.sortButtonText,
          { color: theme.text },
          sortByPriority && { color: theme.primary }
        ]}>Sort by Priority</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  filterButtonText: {
    fontSize: 16,
  },
  sortButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  sortButtonText: {
    fontSize: 16,
  },
}); 