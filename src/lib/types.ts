export type UserRole = "admin" | "viewer";

export type LeaveStatus = "pending" | "approved" | "rejected";

export type LeaveRequest = {
  id: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  requestedAt: string;
};

export type AttendanceStatus = "present" | "absent" | "remote" | "holiday";

export type AttendanceRecord = {
  date: string;
  status: AttendanceStatus;
};

export type SalaryHistoryRecord = {
  id: string;
  amount: string;
  date: string;
  note?: string;
};

export type Employee = {
  uid: string;
  employeeId: string;
  name: string;
  department: string;
  email?: string;
  salary?: string;
  photoUri?: string;
  dateJoined?: string;
  contractEndDate?: string;
  salaryReviewDate?: string;
  leaves?: LeaveRequest[];
  attendance?: AttendanceRecord[];
  salaryHistory?: SalaryHistoryRecord[];
};

export type AppUser = {
  email: string;
  name: string;
  role: UserRole;
  token: string;
};
