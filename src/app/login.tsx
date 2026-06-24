import { getStoredSession, loginWithEmail } from '@/lib/session';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await getStoredSession();
      if (session) {
        router.replace('/home');
      }
    })();
  }, [router]);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const user = await loginWithEmail(email.trim(), password.trim());
    setLoading(false);

    if (!user) {
      setError('Invalid credentials. Use admin@example.com / Admin123 or viewer@example.com / Viewer123');
      return;
    }

    router.replace('/home');
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Employee Management</Text>
        <Text style={styles.subtitle}>Sign in to manage staff, sync with Supabase, and access analytics.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="admin@example.com"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.85} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in</Text>}
        </TouchableOpacity>

        <Text style={styles.hint}>Use admin@example.com / Admin123 or viewer@example.com / Viewer123</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#f8fafc',
    marginBottom: 10,
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: 28,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#cbd5e1',
    marginBottom: 8,
    fontWeight: '700',
    fontSize: 13,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    color: '#f8fafc',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  error: {
    color: '#f87171',
    marginBottom: 12,
    fontWeight: '700',
  },
  hint: {
    marginTop: 20,
    color: '#94a3b8',
    fontSize: 13,
  },
});
