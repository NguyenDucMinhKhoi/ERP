// Centralized role and permission utilities

// Role constants (keep in sync with backend `User.role`)
export const ROLES = {
  ADMIN: 'admin',
  GIANGVIEN: 'giangvien',
  ACADEMIC_STAFF: 'academic_staff',
  SALES_STAFF: 'sales_staff',
  FINANCE_STAFF: 'finance_staff',
  
  // Deprecated - for backward compatibility
  STAFF: 'nhanvien', // Old role, should not be used
  STUDENT: 'hocvien', // Students don't have User accounts by default
};

// Permission policy by module/resource
// Align with backend permissions
export const POLICY = {
  dashboard: [ROLES.ADMIN, ROLES.GIANGVIEN, ROLES.ACADEMIC_STAFF, ROLES.SALES_STAFF, ROLES.FINANCE_STAFF],
  
  // CRM/Student Management
  crm: [ROLES.ADMIN, ROLES.SALES_STAFF, ROLES.ACADEMIC_STAFF],
  students: [ROLES.ADMIN, ROLES.SALES_STAFF, ROLES.ACADEMIC_STAFF],
  
  // Academic Management  
  courses: [ROLES.ADMIN, ROLES.ACADEMIC_STAFF, ROLES.GIANGVIEN],
  classes: [ROLES.ADMIN, ROLES.ACADEMIC_STAFF, ROLES.GIANGVIEN],
  
  // Finance
  billing: [ROLES.ADMIN, ROLES.FINANCE_STAFF],
  payments: [ROLES.ADMIN, ROLES.FINANCE_STAFF],
  
  // Reports & Analytics
  reports: [ROLES.ADMIN, ROLES.ACADEMIC_STAFF, ROLES.SALES_STAFF, ROLES.FINANCE_STAFF],
  
  // General
  notifications: [ROLES.ADMIN, ROLES.GIANGVIEN, ROLES.ACADEMIC_STAFF, ROLES.SALES_STAFF, ROLES.FINANCE_STAFF],
  
  // Admin only
  tables: [ROLES.ADMIN],
  users: [ROLES.ADMIN],
};

// Helper functions for role checking
export function isAdmin(role) {
  return role === ROLES.ADMIN;
}

export function isGiangVien(role) {
  return role === ROLES.GIANGVIEN;
}

export function isStaff(role) {
  return [ROLES.ACADEMIC_STAFF, ROLES.SALES_STAFF, ROLES.FINANCE_STAFF].includes(role);
}

export function isAcademicStaff(role) {
  return role === ROLES.ACADEMIC_STAFF;
}

export function isSalesStaff(role) {
  return role === ROLES.SALES_STAFF;
}

export function isFinanceStaff(role) {
  return role === ROLES.FINANCE_STAFF;
}

export function isStaffMember(role) {
  return isAdmin(role) || isGiangVien(role) || isStaff(role);
}

export function hasAnyRole(role, allowedRoles) {
  if (!role) return false;
  return allowedRoles.includes(role);
}

export function isAllowed(role, resource /*, action = 'view' */) {
  const allowed = POLICY[resource] || [];
  return hasAnyRole(role, allowed);
}

// Simple guard component for React usage
// Usage:
// <RequireRole role={currentRole} allow={[ROLES.ADMIN, ROLES.STAFF]}> ... </RequireRole>
export function RequireRole({ role, allow, children, fallback = null }) {
  if (!hasAnyRole(role, allow)) return fallback;
  return children;
}


