// Tema de colores de Plutxus (oscuro por defecto)

export const darkTheme = {
  background: '#0B0B0D',
  surface: '#161618',
  surfaceElevated: '#1F1F22',
  border: '#2A2A2E',
  text: '#F5F5F7',
  textSecondary: '#A1A1AA',
  textMuted: '#6B6B70',
  primary: '#7C5CFC',
  primaryText: '#FFFFFF',
  bubbleUser: '#2B2140',
  bubbleAssistant: '#18181B',
  danger: '#EF4444',
  success: '#22C55E',
};

export const lightTheme = {
  background: '#F5F5F7',
  surface: '#FFFFFF',
  surfaceElevated: '#F0F0F2',
  border: '#E1E1E4',
  text: '#111114',
  textSecondary: '#52525B',
  textMuted: '#8A8A90',
  primary: '#7C5CFC',
  primaryText: '#FFFFFF',
  bubbleUser: '#EDE7FF',
  bubbleAssistant: '#F0F0F2',
  danger: '#DC2626',
  success: '#16A34A',
};

export type AppTheme = typeof darkTheme;
