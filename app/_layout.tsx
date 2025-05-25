import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { auth } from './config/firebase';
import { router } from 'expo-router';

export default function RootLayout() {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Wrap navigation in setTimeout to ensure root layout is mounted
      setTimeout(() => {
        if (user) {
          router.replace('/tabs');
        } else {
          router.replace('/(auth)/login');
        }
      }, 0);
    });

    return unsubscribe;
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="tabs" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}