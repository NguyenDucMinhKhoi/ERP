export const leadStages = [
  { value: "moi", label: "Mới" },
  { value: "quan_tam", label: "Quan tâm" },
  { value: "nong", label: "Nóng" },
  { value: "mat", label: "Mất" },
];

export const dummyLeads = [
  { id: 1, name: "Nguyễn Minh An", phone: "0901112233", email: "an.nguyen@example.com", interest: "IELTS 6.5", stage: "warm", source: "Facebook", createdAt: "2024-09-10" },
  { id: 2, name: "Trần Thu Hà", phone: "0903334455", email: "ha.tran@example.com", interest: "TOEIC 650", stage: "new", source: "Website", createdAt: "2024-09-18" },
  { id: 3, name: "Lê Quốc Bảo", phone: "0905556677", email: "bao.le@example.com", interest: "General English", stage: "hot", source: "Referral", createdAt: "2024-09-20" },
];

export const dummyCareSchedules = [
  { id: 1, leadId: 1, type: "call", date: "2024-10-02", time: "10:00", note: "Gọi tư vấn IELTS" },
  { id: 2, leadId: 2, type: "email", date: "2024-10-03", time: "14:00", note: "Gửi brochure TOEIC" },
];

export const careTypes = [
  { value: "call", label: "Gọi điện" },
  { value: "sms", label: "SMS" },
  { value: "email", label: "Email" },
];

