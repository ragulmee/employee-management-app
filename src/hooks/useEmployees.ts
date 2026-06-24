import { fetchEmployees, deleteEmployee as removeEmployeeRemote, saveEmployee, subscribeToEmployeeChanges } from '@/lib/supabase';
import { Employee } from '@/lib/types';
import { useEffect, useState } from 'react';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      const data = await fetchEmployees();
      if (isMounted) {
        setEmployees(data);
        setLoading(false);
      }
    }

    load();
    const unsubscribe = subscribeToEmployeeChanges((data) => {
      if (isMounted) setEmployees(data);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  async function save(employee: Employee) {
    const next = await saveEmployee(employee);
    setEmployees(next);
    return next;
  }

  async function remove(uid: string) {
    const next = await removeEmployeeRemote(uid);
    setEmployees(next);
    return next;
  }

  return {
    employees,
    loading,
    setEmployees,
    save,
    remove,
    refresh: async () => {
      const data = await fetchEmployees();
      setEmployees(data);
    },
  };
}
