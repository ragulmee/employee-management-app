import { useMemo } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  employeeId: string;
  name: string;
  department: string;
  email: string;
  salary: string;
  errors: Record<string, string>;
  setEmployeeId: (value: string) => void;
  setName: (value: string) => void;
  setDepartment: (value: string) => void;
  setEmail: (value: string) => void;
  setSalary: (value: string) => void;
  isEditing: boolean;
  insertSampleData: () => void;
};

export default function EmployeeForm({
  visible,
  onClose,
  onSubmit,
  employeeId,
  name,
  department,
  email,
  salary,
  errors,
  setEmployeeId,
  setName,
  setDepartment,
  setEmail,
  setSalary,
  isEditing,
  insertSampleData,
}: Props) {
  const submitLabel = isEditing ? "Save Changes" : "Add Employee";
  const title = useMemo(() => isEditing ? "Edit Employee" : "New Employee", [isEditing]);

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "height" : "padding"}
          style={styles.modalWrapper}
        >
          <View style={styles.handle} />
          <Text style={styles.heading}>{title}</Text>

          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

            <View style={styles.field}>
              <Text style={styles.label}>Employee ID</Text>
              <TextInput
                placeholder="Enter employee ID"
                placeholderTextColor="#475569"
                value={employeeId}
                onChangeText={setEmployeeId}
                style={styles.input}
              />
              {errors.employeeId ? <Text style={styles.error}>{errors.employeeId}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                placeholder="Enter name"
                placeholderTextColor="#475569"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Department</Text>
              <TextInput
                placeholder="Enter department"
                placeholderTextColor="#475569"
                value={department}
                onChangeText={setDepartment}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Enter email"
                placeholderTextColor="#475569"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
              {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Salary</Text>
              <TextInput
                placeholder="Enter salary"
                placeholderTextColor="#475569"
                keyboardType="numeric"
                value={salary}
                onChangeText={(text) => setSalary(text.replace(/[^0-9.]/g, ""))}
                style={styles.input}
              />
              {errors.salary ? <Text style={styles.error}>{errors.salary}</Text> : null}
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={onSubmit} activeOpacity={0.85}>
              <Text style={styles.submitText}>{submitLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={insertSampleData} activeOpacity={0.85}>
              <Text style={styles.secondaryText}>Insert Sample Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalWrapper: {
    backgroundColor: "#0f172a",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 16,
    paddingHorizontal: 20,
    maxHeight: "92%",
    borderTopWidth: 1,
    borderColor: "#1e293b",
  },
  handle: {
    width: 50,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#334155",
    alignSelf: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#f1f5f9",
    marginBottom: 16,
  },
  content: {
    paddingBottom: 40,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    color: "#94a3b8",
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#334155",
  },
  error: {
    marginTop: 6,
    color: "#f87171",
    fontSize: 12,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  secondaryButton: {
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#1e293b",
  },
  secondaryText: {
    color: "#94a3b8",
    fontWeight: "700",
    fontSize: 14,
  },
  closeButton: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 8,
  },
  closeText: {
    color: "#475569",
    fontWeight: "700",
    fontSize: 14,
  },
});
