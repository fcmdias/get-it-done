import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProjectsPage } from '../pages/projects/ProjectsPage';
import { ProjectPage } from '../pages/projects/ProjectPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { ChangePasswordPage } from '../pages/settings/ChangePasswordPage';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
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
    </Stack.Navigator>
  );
}; 