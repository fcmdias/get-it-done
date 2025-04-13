import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import TaskList from '../../components/task/TaskList';

interface TasksPageProps {
  projectId: string;
  projectName: string;
  onBack: () => void;
  onSettingsPress: () => void;
  onHomePress: () => void;
}

export const TasksPage = ({ 
  projectId, 
  projectName, 
  onBack, 
  onSettingsPress,
  onHomePress 
}: TasksPageProps) => {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TaskList 
        projectId={projectId}
        projectName={projectName}
        onBack={onBack}
        onSettingsPress={onSettingsPress}
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