import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Employee } from './types';

const supabaseUrl =
  Constants.expoConfig?.extra?.SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  '';
const supabaseAnonKey =
  Constants.expoConfig?.extra?.SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  '';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

const FALLBACK_EMPLOYEES_KEY = 'employees_v1';

export async function saveEmployeesLocally(employees: Employee[]) {
  await AsyncStorage.setItem(FALLBACK_EMPLOYEES_KEY, JSON.stringify(employees));
}

export async function loadEmployeesLocally(): Promise<Employee[]> {
  try {
    const raw = await AsyncStorage.getItem(FALLBACK_EMPLOYEES_KEY);
    return raw ? (JSON.parse(raw) as Employee[]) : [];
  } catch {
    return [];
  }
}

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const { data, error } = await supabase.from('employees').select('*');
    if (error) {
      console.warn('Supabase fetch failed, falling back to local storage', error.message);
      return loadEmployeesLocally();
    }
    const employees = Array.isArray(data) ? (data as Employee[]) : [];
    saveEmployeesLocally(employees);
    return employees;
  } catch (error) {
    console.warn('Supabase fetch threw an error', error);
    return loadEmployeesLocally();
  }
}

export async function saveEmployee(employee: Employee): Promise<Employee[]> {
  const updatedList = await updateEmployeeOnRemote(employee);
  await saveEmployeesLocally(updatedList);
  return updatedList;
}

export async function deleteEmployee(uid: string): Promise<Employee[]> {
  try {
    const { error } = await supabase.from('employees').delete().eq('uid', uid);
    if (error) {
      console.warn('Supabase delete failed, falling back to local storage', error.message);
    }
  } catch (error) {
    console.warn('Supabase delete error', error);
  }
  const current = await loadEmployeesLocally();
  const next = current.filter((item) => item.uid !== uid);
  await saveEmployeesLocally(next);
  return next;
}

async function updateEmployeeOnRemote(employee: Employee): Promise<Employee[]> {
  try {
    const { data, error } = await supabase
      .from('employees')
      .upsert(employee, { onConflict: 'uid' })
      .select('*');

    if (error) {
      console.warn('Supabase save failed, falling back to local storage', error.message);
      const local = await loadEmployeesLocally();
      const next = local.filter((item) => item.uid !== employee.uid);
      next.unshift(employee);
      return next;
    }

    const next = Array.isArray(data) ? (data as Employee[]) : [employee];
    return next;
  } catch (error) {
    console.warn('Supabase save error', error);
    const local = await loadEmployeesLocally();
    const next = local.filter((item) => item.uid !== employee.uid);
    next.unshift(employee);
    return next;
  }
}

export function subscribeToEmployeeChanges(onChange: (employees: Employee[]) => void) {
  try {
    const channel = supabase
      .channel('employees_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'employees' }, async () => {
        const employees = await fetchEmployees();
        onChange(employees);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  } catch {
    return () => {
      // no-op when realtime is not available
    };
  }
}
