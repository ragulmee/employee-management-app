import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useState } from "react";

type Employee = {
  uid: string;
  employeeId: string;
  name: string;
  department: string;
  email?: string;
  salary?: string;
};

type DepartmentChartProps = {
  employees: Employee[];
};

const chartColors = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ec4899", "#14b8a6", "#f97316"];
const screenWidth = Dimensions.get("window").width - 40;

export default function DepartmentChart({ employees }: DepartmentChartProps) {
  const [activeTab, setActiveTab] = useState<"pie" | "salary" | "topearners">("pie");

  // Pie chart data - employee count per department
  const departmentCounts = employees.reduce<Record<string, number>>((acc, e) => {
    const d = e.department?.trim() || "General";
    acc[d] = (acc[d] ?? 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(departmentCounts).map(([name, count], index) => ({
    name,
    population: count,
    color: chartColors[index % chartColors.length],
    legendFontColor: "#94a3b8",
    legendFontSize: 12,
  }));

  // Bar chart data - salary by department
  const departmentSalaries = employees.reduce<Record<string, number>>((acc, e) => {
    const d = e.department?.trim() || "General";
    acc[d] = (acc[d] ?? 0) + Number(e.salary || 0);
    return acc;
  }, {});

  const salaryLabels = Object.keys(departmentSalaries);
  const salaryValues = Object.values(departmentSalaries);

  // Top earners
  const topEarners = [...employees]
    .sort((a, b) => Number(b.salary || 0) - Number(a.salary || 0))
    .slice(0, 5);

  if (employees.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📊 Analytics</Text>
        <Text style={styles.placeholder}>Add employees to see charts and analytics.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Analytics</Text>

      {/* Tab Switcher */}
      <View style={styles.tabs}>
        {[
          { key: "pie", label: "🏢 Dept" },
          { key: "salary", label: "💰 Salary" },
          { key: "topearners", label: "🏆 Top" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pie Chart */}
      {activeTab === "pie" && (
        <PieChart
          data={pieData}
          width={screenWidth}
          height={200}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="12"
          absolute
          hasLegend={true}
          chartConfig={{
            backgroundGradientFrom: "#1e293b",
            backgroundGradientTo: "#1e293b",
            color: () => "#94a3b8",
            labelColor: () => "#94a3b8",
          }}
          style={styles.chart}
        />
      )}

      {/* Salary Bar Chart */}
      {activeTab === "salary" && salaryLabels.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={{
              labels: salaryLabels,
              datasets: [{ data: salaryValues }],
            }}
            width={Math.max(screenWidth, salaryLabels.length * 90)}
            height={200}
            yAxisLabel="$"
            yAxisSuffix="k"
            chartConfig={{
              backgroundGradientFrom: "#1e293b",
              backgroundGradientTo: "#1e293b",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              labelColor: () => "#94a3b8",
              barPercentage: 0.6,
              propsForBackgroundLines: { stroke: "#334155" },
            }}
            style={styles.chart}
            showValuesOnTopOfBars
            fromZero
          />
        </ScrollView>
      )}

      {/* Top Earners */}
      {activeTab === "topearners" && (
        <View style={styles.topEarnersList}>
          {topEarners.map((employee, index) => (
            <View key={employee.uid} style={styles.topEarnerRow}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                </Text>
              </View>
              <View style={styles.earnerInfo}>
                <Text style={styles.earnerName}>{employee.name}</Text>
                <Text style={styles.earnerDept}>{employee.department}</Text>
              </View>
              <Text style={styles.earnerSalary}>
                ${Number(employee.salary || 0).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#334155",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#f1f5f9",
    marginBottom: 14,
  },
  placeholder: {
    color: "#64748b",
    lineHeight: 20,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#1d4ed8",
  },
  tabText: {
    color: "#64748b",
    fontWeight: "700",
    fontSize: 12,
  },
  activeTabText: {
    color: "#fff",
  },
  chart: {
    borderRadius: 16,
  },
  topEarnersList: {
    gap: 10,
  },
  topEarnerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  rankBadge: {
    width: 36,
    alignItems: "center",
  },
  rankText: {
    fontSize: 18,
  },
  earnerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  earnerName: {
    color: "#f1f5f9",
    fontWeight: "700",
    fontSize: 14,
  },
  earnerDept: {
    color: "#64748b",
    fontSize: 12,
  },
  earnerSalary: {
    color: "#38bdf8",
    fontWeight: "800",
    fontSize: 14,
  },
});
