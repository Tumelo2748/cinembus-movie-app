import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from 'react-native/Libraries/NewAppScreen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="moviedetail/[id]" options={{
          title: 'Movie Detail',
          headerBackTitle: 'Back',
          headerTitleStyle: {
            fontFamily: 'SpaceMono',
          },
          headerTintColor: Colors[colorScheme?? 'light'].tint,
          headerStyle: {
            backgroundColor: Colors[colorScheme?? 'light'].background,
          },
          headerTitleAlign: 'center',
          headerBackTitleStyle: {
            fontFamily: 'SpaceMono',
          },
          headerBackTitleVisible: true,
         
        }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
