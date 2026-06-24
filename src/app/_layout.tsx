import { useEffect, useState } from "react";
import { DarkTheme, Slot, ThemeProvider } from 'expo-router';
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppSplashScreen from "../components/AppSplashScreen";
import LoginScreen from "../components/LoginScreen";
import { requestNotificationPermission, sendTestNotification } from "../utils/notifications";

type AuthUser = {
  email: string;
  role: "admin" | "viewer";
};

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("auth_user");
        if (raw) setUser(JSON.parse(raw));
      } catch {}
      setAuthChecked(true);
    })();
  }, []);

  // Setup notifications after login
  useEffect(() => {
    if (!user || Platform.OS === "web") return;
    (async () => {
      const granted = await requestNotificationPermission();
      if (granted) await sendTestNotification();
    })();
  }, [user]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("auth_user");
    setUser(null);
  };

  if (showSplash) {
    return <AppSplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!authChecked) return null;

  if (!user) {
    return (
      <ThemeProvider value={DarkTheme}>
        <LoginScreen onLogin={setUser} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Slot />
    </ThemeProvider>
  );
}
