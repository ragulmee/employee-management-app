import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  value: string | number;
  color?: string;
  icon?: string;
};

export default function DashboardCard({ title, value, color = "#3b82f6", icon }: Props) {
  return (
    <View style={[styles.card, { borderTopColor: color }]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 10,
    flex: 1,
    borderTopWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#334155",
    minWidth: 0,
  },
  icon: {
    fontSize: 18,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
    color: "#f1f5f9",
    marginBottom: 2,
  },
  title: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "600",
    flexWrap: "wrap",
  },
});
