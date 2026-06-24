import { StyleSheet, View } from "react-native";
import DashboardCard from "./DashboardCard";

type StatCardsProps = {
  totalEmployees: number;
  totalSalary: number;
  departmentCount: number;
};

export default function StatCards({ totalEmployees, totalSalary, departmentCount }: StatCardsProps) {
  return (
    <View style={styles.row}>
      <DashboardCard title="Employees" value={totalEmployees} color="#3b82f6" icon="👥" />
      <DashboardCard title="Total Salary" value={`$${totalSalary.toLocaleString()}`} color="#f59e0b" icon="💰" />
      <DashboardCard title="Depts" value={departmentCount} color="#8b5cf6" icon="🏢" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
});
