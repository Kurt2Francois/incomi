import { router } from 'expo-router';

export const navigate = {
  replace: {
    tabs: () => setTimeout(() => router.replace('/tabs'), 0),
    login: () => setTimeout(() => router.replace('/(auth)/login'), 0),
    register: () => setTimeout(() => router.replace('/(auth)/register'), 0),
  },
  push: {
    login: () => setTimeout(() => router.push('/(auth)/login'), 0),
    register: () => setTimeout(() => router.push('/(auth)/register'), 0),
    logs: () => setTimeout(() => router.push('/tabs/Logs'), 0),
  },
};