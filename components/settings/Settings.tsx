import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { BottomMenu } from '../common/BottomMenu';

interface SettingsProps {
  navigation: any;
  onBack: () => void;
  onHomePress: () => void;
}

export const Settings = ({ 
  navigation,
}: SettingsProps) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const handleChangePassword = () => {
    // Navigate to password change screen
    navigation.navigate('ChangePassword');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Appearance Section */}
          <View style={[styles.section, { borderBottomColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomColor: theme.border }]}
              onPress={toggleTheme}
            >
              <View style={styles.settingContent}>
                <Ionicons name={isDark ? "moon" : "sunny"} size={24} color={theme.primary} style={styles.settingIcon} />
                <Text style={[styles.settingText, { color: theme.text }]}>Theme</Text>
              </View>
              <Text style={[styles.settingValue, { color: theme.secondary }]}>{isDark ? 'Dark' : 'Light'}</Text>
            </TouchableOpacity>
          </View>

          {/* Account Section */}
          <View style={[styles.section, { borderBottomColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomColor: theme.border }]}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={styles.settingContent}>
                <Ionicons name="person" size={24} color={theme.primary} style={styles.settingIcon} />
                <Text style={[styles.settingText, { color: theme.text }]}>Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.secondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomColor: theme.border }]}
              onPress={() => navigation.navigate('EmailPreferences')}
            >
              <View style={styles.settingContent}>
                <Ionicons name="mail" size={24} color={theme.primary} style={styles.settingIcon} />
                <Text style={[styles.settingText, { color: theme.text }]}>Email Preferences</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.secondary} />
            </TouchableOpacity>
          </View>

          {/* Security Section */}
          <View style={[styles.section, { borderBottomColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Security</Text>
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomColor: theme.border }]}
              onPress={() => navigation.navigate('ChangePassword')}
            >
              <View style={styles.settingContent}>
                <Ionicons name="lock-closed" size={24} color={theme.primary} style={styles.settingIcon} />
                <Text style={[styles.settingText, { color: theme.text }]}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.secondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomColor: theme.border }]}
              onPress={() => navigation.navigate('TwoFactorAuth')}
            >
              <View style={styles.settingContent}>
                <Ionicons name="shield-checkmark" size={24} color={theme.primary} style={styles.settingIcon} />
                <Text style={[styles.settingText, { color: theme.text }]}>Two-Factor Authentication</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.secondary} />
            </TouchableOpacity>
          </View>

          {/* Notifications Section */}
          <View style={[styles.section, { borderBottomColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomColor: theme.border }]}
              onPress={() => navigation.navigate('NotificationPreferences')}
            >
              <View style={styles.settingContent}>
                <Ionicons name="notifications" size={24} color={theme.primary} style={styles.settingIcon} />
                <Text style={[styles.settingText, { color: theme.text }]}>Push Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.secondary} />
            </TouchableOpacity>
          </View>

          {/* Help & Support Section */}
          <View style={[styles.section, { borderBottomColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Help & Support</Text>
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomColor: theme.border }]}
              onPress={() => navigation.navigate('HelpCenter')}
            >
              <View style={styles.settingContent}>
                <Ionicons name="help-circle" size={24} color={theme.primary} style={styles.settingIcon} />
                <Text style={[styles.settingText, { color: theme.text }]}>Help Center</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.secondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomColor: theme.border }]}
              onPress={() => navigation.navigate('ContactSupport')}
            >
              <View style={styles.settingContent}>
                <Ionicons name="chatbox" size={24} color={theme.primary} style={styles.settingIcon} />
                <Text style={[styles.settingText, { color: theme.text }]}>Contact Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.secondary} />
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View style={[styles.section, { borderBottomColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomColor: theme.border }]}
              onPress={() => navigation.navigate('About')}
            >
              <View style={styles.settingContent}>
                <Ionicons name="information-circle" size={24} color={theme.primary} style={styles.settingIcon} />
                <Text style={[styles.settingText, { color: theme.text }]}>About App</Text>
              </View>
              <Text style={[styles.settingValue, { color: theme.secondary }]}>Version 1.0.0</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.settingItem, { borderBottomColor: theme.border }]}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              <View style={styles.settingContent}>
                <Ionicons name="document-text" size={24} color={theme.primary} style={styles.settingIcon} />
                <Text style={[styles.settingText, { color: theme.text }]}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.secondary} />
            </TouchableOpacity>
          </View>

          {/* Sign Out Option */}
          <TouchableOpacity 
            style={[styles.signOutButton, { borderColor: theme.danger }]}
            onPress={() => {/* Handle sign out */}}
          >
            <Text style={[styles.signOutText, { color: theme.danger }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomMenu showInput navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 50,
    paddingBottom: 30,
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
  signOutButton: {
    borderWidth: 1,
    borderColor: '#ff3b30',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff3b30',
  },
}); 