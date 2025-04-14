import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

interface BottomMenuProps {
  showInput?: boolean;
  inputComponent?: React.ReactNode;
  navigation: any;
}

export const BottomMenu = ({ 
  showInput, 
  inputComponent, 
  navigation,
}: BottomMenuProps) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.bottomContainer, { 
      borderTopColor: theme.border,
      backgroundColor: theme.background 
    }]}>
      {showInput && (
        <View style={[styles.inputWrapper, { borderBottomColor: theme.border }]}>
          {inputComponent}
        </View>
      )}
      
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Projects')}
        >
          <Ionicons name="home-outline" size={24} color={theme.primary} />
          <Text style={[styles.menuText, { color: theme.primary }]}>Projects</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color={theme.primary} />
          <Text style={[styles.menuText, { color: theme.primary }]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  inputWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  menuItem: {
    alignItems: 'center',
    padding: 10,
  },
  menuText: {
    marginTop: 5,
    fontSize: 12,
    color: '#2196F3',
  },
}); 