import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Employee = {
  uid: string;
  employeeId: string;
  name: string;
  department: string;
  email?: string;
  salary?: string;
};

type Props = {
  employee: Employee | null;
  visible: boolean;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (uid: string) => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

function avatarColor(name: string) {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = ["#1e3a8a", "#065f46", "#7c2d12", "#4c1d95", "#831843"];
  return colors[hash % colors.length];
}

function badgeColor(department: string) {
  const colors: Record<string, { bg: string; text: string }> = {
    Tech:   { bg: "#1e3a8a", text: "#93c5fd" },
    HR:     { bg: "#78350f", text: "#fde68a" },
    Sales:  { bg: "#7c2d12", text: "#fed7aa" },
    Design: { bg: "#4c1d95", text: "#e9d5ff" },
    Ops:    { bg: "#065f46", text: "#6ee7b7" },
  };
  return colors[department] ?? { bg: "#1e293b", text: "#94a3b8" };
}

export default function EmployeeProfile({ employee, visible, onClose, onEdit, onDelete }: Props) {
  if (!employee) return null;
  const badge = badgeColor(employee.department);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Employee Profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Avatar section */}
            <View style={styles.avatarSection}>
              <View style={[styles.avatar, { backgroundColor: avatarColor(employee.name) }]}>
                <Text style={styles.avatarText}>{getInitials(employee.name)}</Text>
              </View>
              <Text style={styles.name}>{employee.name}</Text>
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeText, { color: badge.text }]}>{employee.department}</Text>
              </View>
            </View>

            {/* Details */}
            <View style={styles.detailsCard}>
              <DetailRow icon="🪪" label="Employee ID" value={employee.employeeId} />
              <DetailRow icon="✉️" label="Email" value={employee.email || "Not provided"} />
              <DetailRow icon="💰" label="Salary" value={`$${Number(employee.salary || 0).toLocaleString()}`} highlight />
              <DetailRow icon="🏢" label="Department" value={employee.department} />
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => { onClose(); onEdit(employee); }}
                activeOpacity={0.85}
              >
                <Text style={styles.editText}>✏️  Edit Employee</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => { onClose(); onDelete(employee.uid); }}
                activeOpacity={0.85}
              >
                <Text style={styles.deleteText}>🗑️  Delete Employee</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function DetailRow({ icon, label, value, highlight }: { icon: string; label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, highlight && styles.detailHighlight]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#0f172a",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#f1f5f9",
  },
  closeBtn: {
    backgroundColor: "#1e293b",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: "#94a3b8",
    fontWeight: "700",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: {
    color: "#e2e8f0",
    fontWeight: "800",
    fontSize: 32,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#f1f5f9",
    marginBottom: 10,
  },
  badge: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  badgeText: {
    fontWeight: "700",
    fontSize: 13,
  },
  detailsCard: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#0f172a",
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 14,
    width: 28,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    color: "#f1f5f9",
    fontWeight: "600",
  },
  detailHighlight: {
    color: "#38bdf8",
    fontWeight: "800",
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  editBtn: {
    backgroundColor: "#1d4ed8",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  editText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  deleteBtn: {
    backgroundColor: "#7f1d1d",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  deleteText: {
    color: "#fca5a5",
    fontWeight: "800",
    fontSize: 15,
  },
});
