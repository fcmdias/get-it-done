import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProjectsPage } from '../pages/projects/ProjectsPage';
import { ProjectPage } from '../pages/projects/ProjectPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { ChangePasswordPage } from '../pages/settings/ChangePasswordPage';
import { AuthNavigator } from './AuthNavigator';
import auth from '@react-native-firebase/auth';
import { Project } from '../types/project';

type RootStackParamList = {
  Auth: undefined;
  Projects: undefined;
  ProjectPage: { 
    project: Project;
    onUpdateProject: (project: Project) => void;
    onToggleStatus: (id: string) => void;
    onUpdateLevel: (id: string, field: 'progress' | 'motivation' | 'priority', value: number) => void;
  };
  Settings: undefined;
  ChangePassword: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, [initializing]);

  if (initializing) {
    return null; // Or a loading spinner
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Projects" component={ProjectsPage} />
          <Stack.Screen name="ProjectPage" component={ProjectPage} />
          <Stack.Screen name="Settings" component={SettingsPage} />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordPage}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}; 