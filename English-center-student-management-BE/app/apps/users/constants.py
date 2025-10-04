# Role and Privilege string constants
ROLE_ADMIN = "admin"
ROLE_EMPLOYEE = "employee"
ROLE_STUDENT = "student"

PRIVILEGE_READ = "read"
PRIVILEGE_WRITE = "write"
PRIVILEGE_UPDATE = "update"
PRIVILEGE_DELETE = "delete"

# CORE module privileges
PRIVILEGE_CORE_CREATE_USER = "core.create.user"
PRIVILEGE_CORE_READ_USER = "core.read.user"
PRIVILEGE_CORE_UPDATE_USER = "core.update.user"
PRIVILEGE_CORE_DELETE_USER = "core.delete.user"
PRIVILEGE_CORE_APPROVE_ROLE = "core.approve.role"
PRIVILEGE_CORE_REPORT_AUDIT = "core.report.audit"

# CRM module privileges
PRIVILEGE_CRM_CREATE_HOCVIEN = "crm.create.hocvien"
PRIVILEGE_CRM_UPDATE_CHAMSOC = "crm.update.chamsoc"
PRIVILEGE_CRM_READ_THONGBAO = "crm.read.thongbao"
PRIVILEGE_CRM_REPORT_CONVERSION = "crm.report.conversion"
PRIVILEGE_CRM_APPROVE_ENROLL = "crm.approve.enroll"

# ACADEMIC module privileges
PRIVILEGE_ACADEMIC_CREATE_COURSE = "academic.create.course"
PRIVILEGE_ACADEMIC_UPDATE_SESSION = "academic.update.session"
PRIVILEGE_ACADEMIC_READ_ATTENDANCE = "academic.read.attendance"
PRIVILEGE_ACADEMIC_REPORT_COMPLETION = "academic.report.completion"
PRIVILEGE_ACADEMIC_APPROVE_ENROLL = "academic.approve.enroll"

# FINANCE module privileges
PRIVILEGE_FINANCE_CREATE_PAYMENT = "finance.create.payment"
PRIVILEGE_FINANCE_UPDATE_INVOICE = "finance.update.invoice"
PRIVILEGE_FINANCE_READ_REPORT = "finance.read.report"
PRIVILEGE_FINANCE_APPROVE_OVERDUE = "finance.approve.overdue"
PRIVILEGE_FINANCE_EXPORT_PDF = "finance.export.pdf"

# OPERATIONS module privileges
PRIVILEGE_OPS_CREATE_ENROLLMENT = "ops.create.enrollment"
PRIVILEGE_OPS_UPDATE_BATCH_ASSIGN = "ops.update.batch_assign"
PRIVILEGE_OPS_READ_REPORT_KPI = "ops.read.report_kpi"
PRIVILEGE_OPS_IMPORT_CSV = "ops.import.csv"
