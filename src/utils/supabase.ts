import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Employee = {
  uid: string;
  employeeId: string;
  name: string;
  department: string;
  email?: string;
  salary?: string;
};

// Fetch all employees
export async function fetchEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Fetch error:", error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    uid: row.uid,
    employeeId: row.employee_id,
    name: row.name,
    department: row.department,
    email: row.email,
    salary: row.salary,
  }));
}

// Add or update employee
export async function upsertEmployee(employee: Employee): Promise<void> {
  const { error } = await supabase.from("employees").upsert({
    uid: employee.uid,
    employee_id: employee.employeeId,
    name: employee.name,
    department: employee.department,
    email: employee.email ?? "",
    salary: employee.salary ?? "",
  });

  if (error) console.warn("Upsert error:", error.message);
}

// Delete employee
export async function deleteEmployee(uid: string): Promise<void> {
  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("uid", uid);

  if (error) console.warn("Delete error:", error.message);
}