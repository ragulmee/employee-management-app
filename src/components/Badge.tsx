import { StyleSheet, Text, View } from "react-native";

const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#0ea5a4",
];

function hashToColor(text?: string) {
  if (!text) return COLORS[0];
  let sum = 0;
  for (let i = 0; i < text.length; i++) sum += text.charCodeAt(i);
  return COLORS[sum % COLORS.length];
}

export default function Badge({ text }: { text?: string }) {
  const color = hashToColor(text);
  return (
    <View style={[styles.badge, { backgroundColor: color }] as any}>
      <Text style={styles.text}>{text || "N/A"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  text: { color: "white", fontWeight: "700", fontSize: 12 },
});
