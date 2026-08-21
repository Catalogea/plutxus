// Tema de colores de Plutxus (oscuro por defecto)

export const darkTheme = {
  background: '#090A11',
  surface: '#11131D',
  surfaceElevated: '#191B28',
  border: '#292B3A',
  text: '#F1EFEA',
  textSecondary: '#A3A4B2',
  textMuted: '#686B7B',
  primary: '#B7A5FF',
  primaryText: '#FFFFFF',
  bubbleUser: '#282443',
  bubbleAssistant: '#141621',
  danger: '#EF4444',
  success: '#22C55E',
};

export const lightTheme = {
  background: '#F3F1F7',
  surface: '#FBFAFD',
  surfaceElevated: '#EAE7F1',
  border: '#D9D5E2',
  text: '#191821',
  textSecondary: '#656172',
  textMuted: '#92909C',
  primary: '#7764C5',
  primaryText: '#FFFFFF',
  bubbleUser: '#E6E0FA',
  bubbleAssistant: '#ECEAF1',
  danger: '#DC2626',
  success: '#16A34A',
};

export type AppTheme = typeof darkTheme;
