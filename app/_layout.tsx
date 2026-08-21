import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { initDatabase } from '../services/storage';
import { useAppStore } from '../store/useAppStore';
import { useChatStore } from '../store/useChatStore';
import { useThemeColors } from '../store/useThemeColors';

function AppInitializer({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const hydrate = useAppStore((s) => s.hydrate);
  const loadChats = useChatStore((s) => s.loadChats);
  const colors = useThemeColors();

  useEffect(() => {
    initDatabase();
    hydrate();
    loadChats();
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <StatusBar style="light" />
        <AppInitializer>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="settings" options={{ presentation: 'card' }} />
            <Stack.Screen name="models" options={{ presentation: 'card' }} />
          </Stack>
        </AppInitializer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
