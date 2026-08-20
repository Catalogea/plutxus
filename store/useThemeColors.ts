import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../constants/theme';
import { useAppStore } from './useAppStore';

export function useThemeColors() {
  const appearance = useAppStore((s) => s.appearance);
  const systemScheme = useColorScheme();

  const resolved =
    appearance === 'auto' ? (systemScheme === 'light' ? 'light' : 'dark') : appearance;

  return resolved === 'light' ? lightTheme : darkTheme;
}
