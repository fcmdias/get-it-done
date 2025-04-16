import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { BottomMenu } from '../../components/common/BottomMenu';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface PasswordRequirement {
  label: string;
  check: (password: string) => boolean;
  met: boolean;
}

interface ChangePasswordPageProps {
  navigation: any;
}

export const ChangePasswordPage = ({ navigation }: ChangePasswordPageProps) => {
  const { theme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    {
      label: 'At least 8 characters long',
      check: (password) => password.length >= 8,
      met: false
    },
    {
      label: 'Contains at least one number',
      check: (password) => /\d/.test(password),
      met: false
    },
    {
      label: 'Contains at least one special character',
      check: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
      met: false
    },
    {
      label: 'Contains uppercase and lowercase letters',
      check: (password) => /[a-z]/.test(password) && /[A-Z]/.test(password),
      met: false
    }
  ]);

  useEffect(() => {
    setRequirements(prev => prev.map(req => ({
      ...req,
      met: req.check(newPassword)
    })));
  }, [newPassword]);

  const allRequirementsMet = requirements.every(req => req.met);
  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit = currentPassword && allRequirementsMet && passwordsMatch && !isLoading;

  const handleChangePassword = async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      Alert.alert('Success', 'Password changed successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
        <Text style={[styles.title, { color: theme.text }]}>Change Password</Text>
      </View>

      
      <ScrollView style={styles.content}>
        <View style={[styles.form, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.inputBackground,
                color: theme.text,
                borderColor: theme.inputBorder,
              }]}
              placeholder="Current Password"
              placeholderTextColor={theme.secondary}
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <Ionicons 
                name={showCurrentPassword ? "eye-off" : "eye"} 
                size={24} 
                color={theme.secondary}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.inputBackground,
                color: theme.text,
                borderColor: theme.inputBorder,
              }]}
              placeholder="New Password"
              placeholderTextColor={theme.secondary}
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Ionicons 
                name={showNewPassword ? "eye-off" : "eye"} 
                size={24} 
                color={theme.secondary}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.inputBackground,
                color: theme.text,
                borderColor: theme.inputBorder,
              }]}
              placeholder="Confirm New Password"
              placeholderTextColor={theme.secondary}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-off" : "eye"} 
                size={24} 
                color={theme.secondary}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.requirementsContainer, { borderTopColor: theme.border }]}>
            <Text style={[styles.requirementsTitle, { color: theme.text }]}>
              Password Requirements:
            </Text>
            {requirements.map((req, index) => (
              <View key={index} style={styles.requirement}>
                <Ionicons 
                  name={req.met ? "checkmark-circle" : "close-circle"} 
                  size={20} 
                  color={req.met ? theme.success : theme.error}
                  style={styles.requirementIcon}
                />
                <Text style={[styles.requirementText, { 
                  color: req.met ? theme.success : theme.error 
                }]}>
                  {req.label}
                </Text>
              </View>
            ))}
            {confirmPassword && (
              <View style={styles.requirement}>
                <Ionicons 
                  name={passwordsMatch ? "checkmark-circle" : "close-circle"} 
                  size={20} 
                  color={passwordsMatch ? theme.success : theme.error}
                  style={styles.requirementIcon}
                />
                <Text style={[styles.requirementText, { 
                  color: passwordsMatch ? theme.success : theme.error 
                }]}>
                  Passwords match
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.button, 
              { 
                backgroundColor: canSubmit ? theme.primary : theme.inputBackground,
                borderColor: canSubmit ? 'transparent' : theme.inputBorder,
                borderWidth: 1,
              }
            ]}
            onPress={handleChangePassword}
            disabled={!canSubmit}
          >
            <Text style={[
              styles.buttonText,
              { color: canSubmit ? '#FFFFFF' : theme.secondary }
            ]}>
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomMenu
        showInput={false}
        navigation={navigation}
      />
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
  backText: {
    fontSize: 16,
    marginLeft: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  form: {
    gap: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingRight: 50,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 13,
    padding: 5,
  },
  requirementsContainer: {
    marginTop: 20,
    marginBottom: 10,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  requirementIcon: {
    marginRight: 12,
  },
  requirementText: {
    fontSize: 15,
    fontWeight: '500',
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 