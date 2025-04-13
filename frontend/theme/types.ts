export type ThemeMode = 'light' | 'dark';

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  success: string;
  danger: string;
  disabled: string;
  placeholder: string;
  inputBackground: string;
}

export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
} 