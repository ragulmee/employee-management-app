import { useRef, useState } from "react";
import {
    Animated,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import EmployeeProfile from "./EmployeeProfile";

type Employee = {
  uid: string;
  employeeId: string;
  name: string;
  department: string;
  email?: string;
  salary?: string;
};

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (uid: string) => void;
}

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

export default function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const threshold = -70;
  const [profileVisible, setProfileVisible] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
      onPanResponderMove: (_, gestureState) => {
        const nextX = Math.max(Math.min(gestureState.dx, 0), threshold);
        translateX.setValue(nextX);
      },
      onPanResponderRelease: (_, gestureState) => {
        const destination = gestureState.dx < threshold / 2 ? threshold : 0;
        Animated.spring(translateX, {
          toValue: destination,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  const badge = badgeColor(employee.department);

  return (
    <>
      <View style={styles.swipeWrapper}>
        <View style={styles.revealZone}>
          <TouchableOpacity style={styles.revealButton} onPress={() => onDelete(employee.uid)}>
            <Text style={styles.revealIcon}>🗑️</Text>
            <Text style={styles.revealText}>Delete</Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={[styles.card, { transform: [{ translateX }] }]} {...panResponder.panHandlers}>
          <TouchableOpacity
            style={styles.cardInner}
            onPress={() => setProfileVisible(true)}
            activeOpacity={0.85}
          >
            <View style={[styles.avatar, { backgroundColor: avatarColor(employee.name) }]}>
              <Text style={styles.avatarText}>{getInitials(employee.name)}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{employee.name}</Text>
              <Text style={styles.id}>ID: {employee.employeeId}</Text>
              <Text style={styles.detail}>✉ {employee.email ?? "No email"}</Text>
              <Text style={styles.salary}>💰 ${Number(employee.salary || 0).toLocaleString()}</Text>
              <View style={[styles.departmentPill, { backgroundColor: badge.bg }]}>
                <Text style={[styles.departmentText, { color: badge.text }]}>{employee.department}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(employee)}>
            <Text style={styles.editText}>✏️</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <EmployeeProfile
        employee={employee}
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}

const styles = StyleSheet.create({
  swipeWrapper: {
    marginBottom: 14,
    position: "relative",
  },
  revealZone: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: "#7f1d1d",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  revealButton: {
    alignItems: "center",
    padding: 10,
  },
  revealIcon: {
    fontSize: 20,
  },
  revealText: {
    fontSize: 10,
    color: "#fca5a5",
    fontWeight: "700",
    marginTop: 2,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#e2e8f0",
    fontWeight: "800",
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: "#f1f5f9",
    marginBottom: 2,
  },
  id: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 6,
  },
  detail: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 2,
  },
  salary: {
    fontSize: 12,
    color: "#38bdf8",
    fontWeight: "700",
    marginBottom: 8,
  },
  departmentPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  departmentText: {
    fontSize: 11,
    fontWeight: "700",
  },
  editBtn: {
    backgroundColor: "#0f172a",
    padding: 10,
    borderRadius: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  editText: {
    fontSize: 18,
  },
});
