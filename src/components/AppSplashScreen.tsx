import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

type Props = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade in + scale up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Wait 1.5s then fade out
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }).start(() => onFinish());
      }, 1500);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Logo Circle */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>👥</Text>
        </View>

        {/* App Name */}
        <Text style={styles.appName}>Employee</Text>
        <Text style={styles.appNameBold}>Management</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>Your team, organized.</Text>
      </Animated.View>

      {/* Bottom version */}
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#1e3a8a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoIcon: {
    fontSize: 52,
  },
  appName: {
    fontSize: 32,
    fontWeight: "300",
    color: "#94a3b8",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  appNameBold: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 4,
    textTransform: "uppercase",
    marginTop: -6,
  },
  tagline: {
    marginTop: 14,
    fontSize: 14,
    color: "#475569",
    letterSpacing: 1,
  },
  version: {
    position: "absolute",
    bottom: 40,
    fontSize: 12,
    color: "#334155",
  },
});
