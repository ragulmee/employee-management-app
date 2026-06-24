import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  onLogin: (user: { email: string; role: "admin" | "viewer" }) => void;
};

const USERS = [
  { email: "admin@company.com", password: "admin123", role: "admin" as const },
  { email: "viewer@company.com", password: "viewer123", role: "viewer" as const },
];

export default function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    const user = USERS.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );

    if (!user) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    try {
      await AsyncStorage.setItem("auth_user", JSON.stringify({ email: user.email, role: user.role }));
      onLogin({ email: user.email, role: user.role });
    } catch {
      setError("Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        {/* Logo */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>👥</Text>
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to manage your team</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="admin@company.com"
          placeholderTextColor="#475569"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#475569"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Signing in..." : "Sign In"}</Text>
        </TouchableOpacity>

        {/* Demo credentials hint */}
        <View style={styles.hint}>
          <Text style={styles.hintTitle}>Demo Credentials</Text>
          <Text style={styles.hintText}>Admin: admin@company.com / admin123</Text>
          <Text style={styles.hintText}>Viewer: viewer@company.com / viewer123</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: "#334155",
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1e3a8a",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#f1f5f9",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
  },
  error: {
    color: "#f87171",
    backgroundColor: "#7f1d1d33",
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    textAlign: "center",
    fontSize: 13,
  },
  label: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  hint: {
    marginTop: 24,
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1e3a8a",
  },
  hintTitle: {
    color: "#60a5fa",
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 6,
  },
  hintText: {
    color: "#475569",
    fontSize: 11,
    marginBottom: 2,
  },
});
