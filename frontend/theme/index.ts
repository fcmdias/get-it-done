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
}

export const lightTheme: Theme = {
  background: '#FFFFFF',
  text: '#000000',
  border: '#CCCCCC',
  primary: '#2196F3',
  secondary: '#666666',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#FF5722',
  card: '#F8F8F8',
  inputBackground: '#FFFFFF',
  placeholder: '#999999',
  disabled: '#E0E0E0',
};

export const darkTheme: Theme = {
  background: '#121212',
  text: '#FFFFFF',
  border: '#333333',
  primary: '#64B5F6',
  secondary: '#999999',
  success: '#81C784',
  warning: '#FFB74D',
  danger: '#FF8A65',
  card: '#1E1E1E',
  inputBackground: '#2C2C2C',
  placeholder: '#666666',
  disabled: '#424242',
}; 