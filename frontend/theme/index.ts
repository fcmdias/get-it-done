export interface Theme {
  background: string;
  text: string;
  border: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  card: string;
  inputBackground: string;
  placeholder: string;
  disabled: string;
  error: string;
  inputBorder: string;
  cardBackground: string;
}

export const lightTheme: Theme = {
  background: '#FFFFFF',
  text: '#1A1A1A',
  border: '#E5E5EA',
  primary: '#007AFF',
  secondary: '#8E8E93',
  success: '#34C759',
  warning: '#FF9800',
  danger: '#FF5722',
  card: '#FFFFFF',
  inputBackground: '#F2F2F7',
  placeholder: '#999999',
  disabled: '#E0E0E0',
  error: '#FF3B30',
  inputBorder: '#C7C7CC',
  cardBackground: '#FFFFFF',
};

export const darkTheme: Theme = {
  background: '#1C1C1E',
  text: '#FFFFFF',
  border: '#38383A',
  primary: '#0A84FF',
  secondary: '#98989D',
  success: '#32D74B',
  warning: '#FFB74D',
  danger: '#FF8A65',
  card: '#2C2C2E',
  inputBackground: '#2C2C2E',
  placeholder: '#666666',
  disabled: '#424242',
  error: '#FF453A',
  inputBorder: '#48484A',
  cardBackground: '#2C2C2E',
}; 