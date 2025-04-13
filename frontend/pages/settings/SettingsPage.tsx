import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { Settings } from '../../components/settings/Settings';

interface SettingsPageProps {
  onBack: () => void;
  onHomePress: () => void;
}

export const SettingsPage = ({ onBack, onHomePress }: SettingsPageProps) => {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Settings 
        onBack={onBack}
        onHomePress={onHomePress}
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
}); 