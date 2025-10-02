// Centralized role and permission utilities

// Role constants (keep in sync with backend `User.role`)
export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'nhanvien',
  TEACHER: 'giangvien',
  STUDENT: 'hocvien',
};

// Permission policy by module/resource
// Adjust as features evolve. Actions can later be: view | create | update | delete
export const POLICY = {
  dashboard: [ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER, ROLES.STUDENT],
  crm: [ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER, ROLES.STUDENT],
  tables: [ROLES.ADMIN],
  billing: [ROLES.ADMIN, ROLES.STAFF, ROLES.STUDENT],
  reports: [ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER, ROLES.STUDENT],
  notifications: [ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER, ROLES.STUDENT],
};

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


