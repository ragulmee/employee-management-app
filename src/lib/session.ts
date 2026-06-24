import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppUser, UserRole } from './types';

const SESSION_KEY = 'session_user';
const THEME_KEY = 'theme_mode';

const DEFAULT_USERS: Array<AppUser & { password: string }> = [
  {
    email: 'admin@example.com',
    password: 'Admin123',
    name: 'System Admin',
    role: 'admin',
    token: 'admin-token',
  },
  {
    email: 'viewer@example.com',
    password: 'Viewer123',
    name: 'Read Only User',
    role: 'viewer',
    token: 'viewer-token',
  },
];

export async function loginWithEmail(email: string, password: string) {
  const user = DEFAULT_USERS.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
  if (!user) return null;

  const sessionUser: AppUser = {
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
    token: user.token,
  };

  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

export async function getStoredSession(): Promise<AppUser | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
}

export async function clearStoredSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getStoredTheme(): Promise<'light' | 'dark' | null> {
  try {
    const raw = await AsyncStorage.getItem(THEME_KEY);
    return raw === 'dark' || raw === 'light' ? raw : null;
  } catch {
    return null;
  }
}

export async function saveThemePreference(theme: 'light' | 'dark') {
  await AsyncStorage.setItem(THEME_KEY, theme);
}
