import { DarkTheme, DefaultTheme, ThemeProvider, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function RootLayoutNav() {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  
  const { initializeAuthListener, isAuthenticated, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Initialize auth state listener
  useEffect(() => {
    const unsub = initializeAuthListener();
    return () => unsub();
  }, [initializeAuthListener]);

  // Protect routes and redirect based on auth state
  useEffect(() => {
    if (isLoading) return;

    // Check if the user is in the auth group or index screen
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // If not authenticated, redirect to sign in
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // If authenticated, redirect to home page
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: themeColors.background,
          },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="new-task" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="focus-mode" options={{ presentation: 'fullScreenModal', headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

// Temporary Color mappings for layout fallback
const Colors = {
  light: {
    background: '#ffffff',
  },
  dark: {
    background: '#000000',
  },
} as const;

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}
