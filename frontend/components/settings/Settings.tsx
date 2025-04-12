import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { BottomMenu } from '../common/BottomMenu';

interface SettingsProps {
  onBack: () => void;
  onHomePress: () => void;
}

export const Settings = ({ onBack, onHomePress }: SettingsProps) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

        <View style={[styles.section, { borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
            onPress={toggleTheme}
          >
            <View style={styles.settingContent}>
              <Ionicons 
                name={isDark ? "moon" : "sunny"} 
                size={24} 
                color={theme.primary}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: theme.text }]}>
                Theme
              </Text>
            </View>
            <Text style={[styles.settingValue, { color: theme.secondary }]}>
              {isDark ? 'Dark' : 'Light'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomMenu
        onHomePress={onHomePress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  section: {
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
  },
}); 