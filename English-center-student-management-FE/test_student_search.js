// Test file to verify student search functionality
// You can open browser console and run this in DevTools

// Test the student search functionality
const testStudentSearch = () => {
  console.log('Testing student search functionality...');
  
  // Simulate the search logic from InvoiceCreation.jsx
  const allStudents = [
    { 
      id: 1, 
      ten: 'Nguyễn Văn A', 
      ma_hoc_vien: 'HV001', 
      email: 'nguyenvana@example.com', 
      sdt: '0123456789',
      trang_thai_hoc_phi: 'chuadong'
    },
    { 
      id: 2, 
      ten: 'Nguyễn Văn B', 
      ma_hoc_vien: 'HV002', 
      email: 'nguyenvanb@example.com', 
      sdt: '0987654321',
      trang_thai_hoc_phi: 'conno'
    },
    { 
      id: 3, 
      ten: 'Trần Thị C', 
      ma_hoc_vien: 'HV003', 
      email: 'tranthic@example.com', 
      sdt: '0111222333',
      trang_thai_hoc_phi: 'dadong'
    }
  ];

  const searchTerm = 'Nguyễn Văn B'.toLowerCase().trim();
  console.log('🔍 Search term:', searchTerm);
  
  const filteredStudents = allStudents.filter(student => {
    const matchesName = student.ten?.toLowerCase().includes(searchTerm);
    const matchesPhone = student.sdt?.includes(searchTerm);
    const matchesEmail = student.email?.toLowerCase().includes(searchTerm);
    const matchesCode = student.ma_hoc_vien?.toLowerCase().includes(searchTerm);
    
    console.log(`Testing student ${student.ten}:`, {
      matchesName,
      matchesPhone,
      matchesEmail,
      matchesCode,
      overall: matchesName || matchesPhone || matchesEmail || matchesCode
    });
    
    return matchesName || matchesPhone || matchesEmail || matchesCode;
  });

  console.log('🎯 Filtered results:', filteredStudents);
  return filteredStudents;
};

// Run the test
testStudentSearch();