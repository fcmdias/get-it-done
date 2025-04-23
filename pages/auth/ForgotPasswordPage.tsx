import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

type ForgotPasswordNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

interface ForgotPasswordProps {
  navigation: ForgotPasswordNavigationProp;
}

export const ForgotPasswordPage = ({ navigation }: ForgotPasswordProps) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert(
        'Success',
        'Password reset email sent. Please check your inbox.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      const firebaseError = error as FirebaseAuthTypes.NativeFirebaseAuthError;
      let errorMessage = 'Failed to send reset email';
      
      switch (firebaseError.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          console.error('Password reset error:', firebaseError);
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
          <Text style={[styles.title, { color: theme.text }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: theme.secondary }]}>
            Enter your email to receive a password reset link
          </Text>

          <View style={styles.form}>
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
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button, 
                { 
                  backgroundColor: theme.primary,
                  opacity: isLoading ? 0.7 : 1
                }
              ]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Ionicons name="arrow-back" size={20} color={theme.primary} />
              <Text style={[styles.backButtonText, { color: theme.primary }]}>
                Back to Login
              </Text>
            </TouchableOpacity>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 