import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as Sharing from "expo-sharing";
import ConfirmModal from "../components/ConfirmModal";
import DepartmentChart from "../components/DepartmentChart";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeForm from "../components/EmployeeForm";
import EmptyState from "../components/EmptyState";
import StatCards from "../components/StatCards";
import { supabase } from "../utils/supabase";

type Employee = {
  uid: string;
  employeeId: string;
  name: string;
  department: string;
  email?: string;
  salary?: string;
};

const escapeCsvValue = (value: string) => `"${value.replace(/"/g, '""')}"`;

export default function HomeScreen() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [toDeleteUid, setToDeleteUid] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortKey, setSortKey] = useState<"none" | "name" | "salary">("none");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*");

      if (error) throw error;

      if (data) {
        const mapped: Employee[] = data.map((row) => ({
          uid: row.uid,
          employeeId: row.employee_id,
          name: row.name,
          department: row.department,
          email: row.email,
          salary: String(row.salary ?? ""),
        }));
        setEmployees(mapped);
      }
    } catch (e) {
      console.warn("Load error from Supabase:", e);
    } finally {
      setLoading(false);
    }
  };

  const departments = useMemo(() => {
    const unique = Array.from(new Set(employees.map((e) => e.department).filter(Boolean)));
    return ["All", ...unique];
  }, [employees]);

  const totalSalary = employees.reduce((sum, e) => sum + Number(e.salary || 0), 0);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return employees
      .filter((e) => {
        const matchesSearch =
          !q ||
          e.employeeId.toLowerCase().includes(q) ||
          e.name.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          (e.email || "").toLowerCase().includes(q) ||
          (e.salary || "").toLowerCase().includes(q);
        const matchesDepartment = selectedDepartment === "All" || e.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
      })
      .sort((a, b) => {
        if (sortKey === "name") {
          const result = a.name.localeCompare(b.name);
          return sortOrder === "asc" ? result : -result;
        }
        if (sortKey === "salary") {
          return sortOrder === "asc"
            ? Number(a.salary || 0) - Number(b.salary || 0)
            : Number(b.salary || 0) - Number(a.salary || 0);
        }
        return 0;
      });
  }, [employees, searchQuery, selectedDepartment, sortKey, sortOrder]);

  const openForm = () => setIsModalOpen(true);
  const closeForm = () => { setIsModalOpen(false); resetForm(); };

  const resetForm = () => {
    setEditingUid(null);
    setEmployeeId("");
    setName("");
    setDepartment("");
    setEmail("");
    setSalary("");
    setErrors({});
  };

  const exportEmployeesAsCsv = async () => {
    if (employees.length === 0) return;
    const headers = ["Employee ID", "Name", "Department", "Email", "Salary"];
    const rows = employees.map((e) =>
      [e.employeeId, e.name, e.department, e.email ?? "", e.salary ?? ""]
        .map((v) => escapeCsvValue(v))
        .join(","),
    );
    const csv = [headers.map((v) => escapeCsvValue(v)).join(","), ...rows].join("\n");
    const fileName = `employee-roster-${Date.now()}.csv`;

    if (Platform.OS === "web") {
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    try {
      const FileSystem = require("expo-file-system");
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Share employee roster",
      });
    } catch (error) {
      console.warn("CSV export failed", error);
    }
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!employeeId.trim()) nextErrors.employeeId = "Employee ID required";
    if (!name.trim()) nextErrors.name = "Name required";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Invalid email";
    if (salary && Number(salary) <= 0) nextErrors.salary = "Salary must be positive";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    const recordUid = editingUid || Date.now().toString();
    const payload = {
      uid: recordUid,
      employee_id: employeeId.trim(),
      name: name.trim(),
      department: department.trim() || "General",
      email: email.trim() || null,
      salary: salary.trim() ? Number(salary) : null,
    };

    try {
      const { error } = await supabase
        .from("employees")
        .upsert(payload, { onConflict: "uid" });

      if (error) throw error;
      
      await loadEmployees();
      closeForm();
    } catch (e) {
      console.warn("Error saving employee to Supabase:", e);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingUid(employee.uid);
    setEmployeeId(employee.employeeId);
    setName(employee.name);
    setDepartment(employee.department);
    setEmail(employee.email || "");
    setSalary(employee.salary || "");
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (uid: string) => {
    setToDeleteUid(uid);
    setConfirmVisible(true);
  };

  const deleteConfirmed = async () => {
    if (!toDeleteUid) return;
    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("uid", toDeleteUid);

      if (error) throw error;

      await loadEmployees();
    } catch (e) {
      console.warn("Error deleting employee from Supabase:", e);
    } finally {
      setConfirmVisible(false);
      setToDeleteUid(null);
    }
  };

  const insertSampleData = async () => {
    const samples = [
      { uid: Date.now().toString(), employee_id: "TECH-001", name: "Ari Kim", department: "Tech", email: "ari.kim@example.com", salary: 98000 },
      { uid: (Date.now() + 1).toString(), employee_id: "HR-002", name: "Maya Patel", department: "HR", email: "maya.patel@example.com", salary: 78000 },
    ];
    
    try {
      const { error } = await supabase.from("employees").upsert(samples);
      if (error) throw error;
      await loadEmployees();
    } catch (e) {
      console.warn("Error inserting sample data:", e);
    }
  };

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>👥 Employee</Text>
          <Text style={styles.headingBold}>Management</Text>
          <Text style={styles.subtitle}>Track, manage and grow your team.</Text>
        </View>

        <StatCards
          totalEmployees={employees.length}
          totalSalary={totalSalary}
          departmentCount={new Set(employees.map((e) => e.department)).size}
        />

        <DepartmentChart employees={employees} />

        {/* Search Row */}
<View style={styles.searchRow}>
  <TextInput
    placeholder="Search..."
    placeholderTextColor="#475569"
    value={searchQuery}
    onChangeText={setSearchQuery}
    style={styles.searchInput}
  />
</View>

        {/* Department Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow} contentContainerStyle={styles.pillList}>
          {departments.map((d) => {
            const isActive = d === selectedDepartment;
            return (
              <TouchableOpacity
                key={d}
                style={[styles.pill, isActive ? styles.activePill : styles.inactivePill]}
                onPress={() => setSelectedDepartment(d)}
                activeOpacity={0.85}
              >
                <Text style={[styles.pillText, isActive ? styles.activePillText : styles.inactivePillText]}>{d}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sort Buttons */}
        <View style={styles.sortRow}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => { setSortKey("name"); setSortOrder(sortKey === "name" && sortOrder === "asc" ? "desc" : "asc"); }}
            activeOpacity={0.85}
          >
            <Text style={styles.sortButtonText}>Name {sortKey === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => { setSortKey("salary"); setSortOrder(sortKey === "salary" && sortOrder === "asc" ? "desc" : "asc"); }}
            activeOpacity={0.85}
          >
            <Text style={styles.sortButtonText}>Salary {sortKey === "salary" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</Text>
          </TouchableOpacity>
        </View>

        {/* Employee List */}
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <EmptyState onInsertSample={insertSampleData} />
        ) : (
          filtered.map((e) => (
            <EmployeeCard key={e.uid} employee={e} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openForm} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <EmployeeForm
        visible={isModalOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        employeeId={employeeId}
        name={name}
        department={department}
        email={email}
        salary={salary}
        errors={errors}
        setEmployeeId={setEmployeeId}
        setName={setName}
        setDepartment={setDepartment}
        setEmail={setEmail}
        setSalary={setSalary}
        isEditing={Boolean(editingUid)}
        insertSampleData={insertSampleData}
      />

      <ConfirmModal
        visible={confirmVisible}
        title="Delete Employee"
        message="This will permanently remove the employee. Proceed?"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={deleteConfirmed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#0f172a" },
  container: { padding: 16, paddingBottom: 120 },
  header: { marginBottom: 16 },
  heading: { fontSize: 22, fontWeight: "300", color: "#94a3b8", letterSpacing: 1 },
  headingBold: { fontSize: 26, fontWeight: "800", color: "#f1f5f9", marginTop: -4, marginBottom: 4 },
  subtitle: { fontSize: 12, color: "#475569" },
  searchRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  searchInput: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#334155",
  },
  exportButton: {
    backgroundColor: "#1d4ed8",
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  exportButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  pillRow: { marginBottom: 12 },
  pillList: { paddingVertical: 4, flexDirection: "row" },
  pill: { borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14, marginRight: 8 },
  activePill: { backgroundColor: "#1d4ed8" },
  inactivePill: { backgroundColor: "#1e293b", borderWidth: 1, borderColor: "#334155" },
  pillText: { fontWeight: "700", fontSize: 13 },
  activePillText: { color: "#fff" },
  inactivePillText: { color: "#64748b" },
  sortRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  sortButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  sortButtonText: { fontWeight: "700", color: "#93c5fd", fontSize: 13 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 7,
  },
  fabIcon: { color: "#fff", fontSize: 28, lineHeight: 30, fontWeight: "800" },
});