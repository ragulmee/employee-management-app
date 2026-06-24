import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onInsertSample: () => void;
};

export default function EmptyState({ onInsertSample }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.iconPlaceholder}>
        <Text style={styles.icon}>👥</Text>
      </View>
      <Text style={styles.title}>No Employees Yet</Text>
      <Text style={styles.subtitle}>Add your first team member or load sample data.</Text>
      <TouchableOpacity style={styles.button} onPress={onInsertSample} activeOpacity={0.85}>
        <Text style={styles.buttonText}>+ Insert Sample Data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  iconPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#f1f5f9",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
  button: {
    backgroundColor: "#1d4ed8",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});
