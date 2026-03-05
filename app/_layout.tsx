import '@/lib/firebase';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider } from '@/contexts/app-context';


export const unstable_settings = {
  anchor: '(tabs)',
};

const ZimDriveLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0E8A3E',
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#1A1A2E',
    border: '#E5E7EB',
  },
};

const ZimDriveDark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#34D669',
    background: '#111827',
    card: '#1F2937',
    text: '#F3F4F6',
    border: '#374151',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? ZimDriveDark : ZimDriveLight}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="practice/[category]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="mock-test"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="mock-results"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="review"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="notes/highway-code"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="notes/road-rules"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="notes/section-detail"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="notes/road-signs"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="notes/sign-class/[classCode]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="paywall"
            options={{ headerShown: false, presentation: 'modal' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProvider>
  );
}
