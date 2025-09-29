import React, { useRef } from 'react';

const InvoiceModal = ({ invoice, onClose }) => {
  const printRef = useRef();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=650,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(`
      <html>
        <head>
          <title>Biên lai thanh toán - ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: 'Arial', sans-serif; margin: 20px; }
            .invoice { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 5px; }
            .company-info { font-size: 14px; color: #666; }
            .invoice-title { font-size: 20px; font-weight: bold; margin: 20px 0; text-align: center; }
            .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .info-section { flex: 1; }
            .info-label { font-weight: bold; color: #333; }
            .info-value { margin-bottom: 10px; }
            .details-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .details-table th, .details-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .details-table th { background-color: #f5f5f5; font-weight: bold; }
            .total-section { text-align: right; margin-bottom: 30px; }
            .total-amount { font-size: 18px; font-weight: bold; color: #333; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; }
            .signature-section { display: flex; justify-content: space-between; margin-top: 50px; }
            .signature { text-align: center; }
            @media print { 
              body { margin: 0; } 
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  };

  const handleDownloadPDF = () => {
    // This would typically use a library like jsPDF or html2pdf
    alert('Chức năng tải PDF sẽ được cài đặt với thư viện jsPDF');
  };

  const paymentMethodLabels = {
    cash: 'Tiền mặt',
    transfer: 'Chuyển khoản',
    card: 'Thẻ tín dụng',
    'e-wallet': 'Ví điện tử',
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white mb-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 no-print">
          <h3 className="text-xl font-medium text-gray-900">
            Biên lai thanh toán
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="mr-2">🖨️</span>
              In
            </button>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="mr-2">📄</span>
              PDF
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Đóng</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={printRef} className="invoice">
          {/* Header */}
          <div className="header">
            <div className="company-name">TRUNG TÂM ANH NGỮ ABC</div>
            <div className="company-info">
              <div>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</div>
              <div>Điện thoại: (028) 3xxx xxxx | Email: info@englishcenter.com</div>
              <div>MST: 0123456789</div>
            </div>
          </div>

          <div className="invoice-title">BIÊN LAI THANH TOÁN HỌC PHÍ</div>

          {/* Invoice Info */}
          <div className="invoice-info">
            <div className="info-section">
              <div className="info-value">
                <span className="info-label">Số biên lai:</span> {invoice.invoiceNumber}
              </div>
              <div className="info-value">
                <span className="info-label">Ngày thanh toán:</span> {formatDate(invoice.paymentDate)}
              </div>
              <div className="info-value">
                <span className="info-label">Phương thức:</span> {paymentMethodLabels[invoice.paymentMethod]}
              </div>
            </div>
            <div className="info-section">
              <div className="info-value">
                <span className="info-label">Học viên:</span> {invoice.studentName}
              </div>
              <div className="info-value">
                <span className="info-label">Mã học viên:</span> {invoice.studentCode}
              </div>
              <div className="info-value">
                <span className="info-label">Khóa học:</span> {invoice.courseName}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <table className="details-table">
            <thead>
              <tr>
                <th>Mô tả</th>
                <th style={{ width: '150px' }}>Số tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="font-medium">Học phí khóa học: {invoice.courseName}</div>
                  <div className="text-sm text-gray-600 mt-1">{invoice.description}</div>
                </td>
                <td className="text-right font-medium">
                  {formatCurrency(invoice.amount)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <div className="total-section">
            <div className="total-amount">
              Tổng số tiền đã thanh toán: {formatCurrency(invoice.amount)}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Bằng chữ: {convertNumberToWords(invoice.amount)} đồng
            </div>
          </div>

          {/* Signature Section */}
          <div className="signature-section">
            <div className="signature">
              <div className="font-medium mb-2">Người nộp tiền</div>
              <div className="mt-16 text-sm">
                (Ký và ghi rõ họ tên)
              </div>
            </div>
            <div className="signature">
              <div className="font-medium mb-2">Người thu tiền</div>
              <div className="mt-16 text-sm">
                (Ký và ghi rõ họ tên)
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <p>Cảm ơn bạn đã tin tưởng và lựa chọn Trung tâm Anh ngữ ABC!</p>
            <p>Mọi thắc mắc xin liên hệ: (028) 3xxx xxxx</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to convert number to words (Vietnamese)
function convertNumberToWords(num) {
  const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const tens = ['', '', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
  const scales = ['', 'nghìn', 'triệu', 'tỷ'];

  if (num === 0) return 'không';

  let result = '';
  let scaleIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      const chunkText = convertHundreds(chunk, ones, tens);
      result = chunkText + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + (result ? ' ' + result : '');
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return result.trim().charAt(0).toUpperCase() + result.trim().slice(1);
}

function convertHundreds(num, ones, tens) {
  let result = '';
  
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;
  
  if (hundreds > 0) {
    result += ones[hundreds] + ' trăm';
  }
  
  if (remainder > 0) {
    if (result) result += ' ';
    
    if (remainder < 10) {
      result += ones[remainder];
    } else if (remainder < 20) {
      if (remainder === 10) {
        result += 'mười';
      } else {
        result += 'mười ' + ones[remainder % 10];
      }
    } else {
      const tensDigit = Math.floor(remainder / 10);
      const onesDigit = remainder % 10;
      
      result += tens[tensDigit];
      if (onesDigit > 0) {
        result += ' ' + ones[onesDigit];
      }
    }
  }
  
  return result;
}

export default InvoiceModal;