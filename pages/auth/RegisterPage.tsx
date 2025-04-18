import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';

interface RegisterPageProps {
  navigation: any;
}

interface PasswordRequirement {
  label: string;
  check: (password: string) => boolean;
  met: boolean;
}

export const RegisterPage = ({ navigation }: RegisterPageProps) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      met: req.check(password)
    })));
  }, [password]);

  const allRequirementsMet = requirements.every(req => req.met);
  const passwordsMatch = password === confirmPassword;

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!allRequirementsMet) {
      Alert.alert('Error', 'Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const networkState = await NetInfo.fetch();
      if (!networkState.isConnected) {
        throw new Error('No internet connection');
      }
      
      console.log('Starting registration with:', { email });
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({
        displayName: name
      });

      Alert.alert(
        'Success', 
        'Account created successfully! Please sign in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      switch (error.code) {
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        default:
          errorMessage = `Error: ${error.message}`;
          break;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.secondary }]}>
            Sign up to get started
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons 
                name="person" 
                size={20} 
                color={theme.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.inputBackground,
                  color: theme.text,
                  borderColor: theme.inputBorder,
                }]}
                placeholder="Full Name"
                placeholderTextColor={theme.secondary}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons 
                name="mail" 
                size={20} 
                color={theme.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.inputBackground,
                  color: theme.text,
                  borderColor: theme.inputBorder,
                }]}
                placeholder="Email"
                placeholderTextColor={theme.secondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons 
                name="lock-closed" 
                size={20} 
                color={theme.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.inputBackground,
                  color: theme.text,
                  borderColor: theme.inputBorder,
                }]}
                placeholder="Password"
                placeholderTextColor={theme.secondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={24} 
                  color={theme.secondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons 
                name="lock-closed" 
                size={20} 
                color={theme.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.inputBackground,
                  color: theme.text,
                  borderColor: theme.inputBorder,
                }]}
                placeholder="Confirm Password"
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
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: theme.secondary }]}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.loginLink, { color: theme.primary }]}>
                  {' Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 45,
    fontSize: 16,
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: 15,
    zIndex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 13,
    padding: 5,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
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
}); 