import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { Settings } from '../../components/settings/Settings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface SettingsPageProps {
  navigation: any;
}

export const SettingsPage = ({ navigation }: SettingsPageProps) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color={theme.text} 
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      </View>
      
      <Settings 
        navigation={navigation}
        onBack={() => navigation.goBack()}
        onHomePress={() => navigation.navigate('Projects')}
      />
      <StatusBar style={isDark ? "light" : "dark"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
}); 