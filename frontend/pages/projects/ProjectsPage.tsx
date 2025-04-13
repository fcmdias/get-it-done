import { View, StyleSheet } from 'react-native';
import { ProjectList } from '../../components/project/ProjectList';
import { useTheme } from '../../theme/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { Project } from '../../types/project';

interface ProjectsPageProps {
  onSelectProject: (project: Project) => void;
  onSettingsPress: () => void;
}

export const ProjectsPage = ({ onSelectProject, onSettingsPress }: ProjectsPageProps) => {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ProjectList 
        onSelectProject={onSelectProject}
        onSettingsPress={onSettingsPress}
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