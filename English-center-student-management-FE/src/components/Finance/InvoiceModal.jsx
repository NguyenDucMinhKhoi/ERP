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
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Arial', 'Helvetica', sans-serif; 
              margin: 0; 
              background: #fff;
              color: #333;
              line-height: 1.4;
              font-size: 14px;
            }
            
            /* A4 Paper Optimization */
            @page {
              size: A4;
              margin: 15mm;
            }
            
            .invoice-container { 
              max-width: 210mm;
              min-height: 297mm;
              margin: 0 auto; 
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              page-break-inside: avoid;
            }
            
            .invoice-header { 
              background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
              color: white; 
              padding: 20mm 15mm;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            
            .invoice-header h1 { 
              font-size: 22px; 
              font-weight: bold; 
              margin-bottom: 6px; 
              line-height: 1.2;
            }
            
            .company-info p { 
              margin-bottom: 3px; 
              color: rgba(255, 255, 255, 0.9); 
              font-size: 12px;
              line-height: 1.3;
            }
            
            .invoice-header .bg-white { 
              background: white !important; 
              color: #0d9488 !important; 
              padding: 8px 12px; 
              border-radius: 6px; 
              text-align: center;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              min-width: 100px;
            }
            
            .invoice-title { 
              text-align: center; 
              padding: 8mm 0; 
              background: #f9fafb; 
              font-size: 18px; 
              font-weight: bold; 
              color: #374151;
            }
            
            .invoice-content { 
              padding: 10mm 15mm;
            }
            
            .invoice-section { 
              margin-bottom: 8mm;
            }
            
            .invoice-section h3 { 
              color: #374151; 
              font-size: 14px; 
              margin-bottom: 6mm; 
              padding-bottom: 3mm; 
              border-bottom: 1px solid #14b8a6; 
              font-weight: bold;
            }
            
            .info-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 10mm;
              margin-bottom: 8mm;
            }
            
            .info-item { 
              display: flex; 
              margin-bottom: 3mm;
            }
            
            .info-label { 
              width: 80px; 
              font-weight: 500; 
              color: #6b7280; 
              font-size: 12px;
            }
            
            .info-value { 
              color: #374151; 
              font-weight: 600; 
              font-size: 12px;
            }
            
            .bg-gray-50 { background-color: #f9fafb !important; }
            .bg-teal-50 { background-color: #f0fdfa !important; }
            .text-teal-600 { color: #0d9488 !important; }
            .text-teal-800 { color: #115e59 !important; }
            
            .payment-table { 
              background: #f9fafb; 
              border-radius: 6px; 
              padding: 6mm; 
              margin-bottom: 8mm;
            }
            
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 4mm 0;
              background: white;
              border-radius: 4px;
              overflow: hidden;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            }
            
            th, td { 
              padding: 8mm 6mm; 
              text-align: left; 
              border-bottom: 1px solid #e5e7eb;
              font-size: 12px;
            }
            
            th { 
              background-color: #f0fdfa !important; 
              font-weight: bold; 
              color: #115e59;
              font-size: 12px;
            }
            
            .total-section { 
              background: linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%); 
              border-radius: 6px; 
              padding: 6mm; 
              margin-bottom: 8mm;
            }
            
            .total-amount { 
              font-size: 18px; 
              font-weight: bold; 
              color: #0d9488; 
            }
            
            .signature-section { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 10mm;
              margin: 8mm 0;
            }
            
            .signature { 
              text-align: center; 
              border: 1px dashed #d1d5db;
              border-radius: 4px;
              padding: 6mm;
              min-height: 25mm;
            }
            
            .signature-title { 
              font-weight: bold; 
              margin-bottom: 3mm; 
              font-size: 12px;
            }
            
            .signature-note { 
              font-size: 10px; 
              color: #6b7280; 
              margin-top: 15mm;
            }
            
            .footer { 
              text-align: center; 
              background: #f9fafb; 
              padding: 6mm; 
              border-top: 2px solid #14b8a6;
              border-radius: 0 0 8px 8px;
              margin-top: 6mm;
            }
            
            .footer-title { 
              color: #0d9488; 
              font-weight: bold; 
              font-size: 14px; 
              margin-bottom: 3mm; 
            }
            
            .footer-info { 
              color: #6b7280; 
              font-size: 11px; 
              line-height: 1.4;
            }
            
            @media print { 
              body { 
                margin: 0 !important; 
                padding: 0 !important;
                background: white !important; 
                font-size: 12px !important;
              }
              .no-print { display: none !important; }
              .invoice-container { 
                box-shadow: none !important; 
                margin: 0 !important;
                max-width: none !important;
                width: 100% !important;
                min-height: auto !important;
              }
              .invoice-header { 
                padding: 15mm 10mm !important;
              }
              .invoice-content { 
                padding: 8mm 10mm !important;
              }
              .info-grid { 
                gap: 8mm !important;
              }
              .signature-section { 
                gap: 8mm !important;
              }
              * { 
                -webkit-print-color-adjust: exact !important; 
                color-adjust: exact !important; 
              }
              .page-break { 
                page-break-before: always; 
              }
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
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(13,148,136,0.2) 50%, rgba(0,0,0,0.8) 100%)'
      }}
      onScroll={(e) => e.stopPropagation()}
    >
      <div 
        className="relative mx-auto w-full max-w-5xl bg-white rounded-2xl shadow-2xl border-0 max-h-[95vh] overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto max-h-[95vh] finance-modal-scrollbar">
        {/* Enhanced Modal Header */}
        <div className="relative no-print">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 opacity-90"></div>
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          ></div>
          
          {/* Header Content */}
          <div className="relative flex justify-between items-center p-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  Biên lai thanh toán
                </h3>
                <p className="text-teal-100 text-sm">
                  Chi tiết giao dịch học phí
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                In biên lai
              </button>
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Tải PDF
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 shadow-lg flex items-center justify-center"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Content - Enhanced Design */}
        <div ref={printRef} className="invoice-container" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'}}>
          {/* Enhanced Header Section */}
          <div className="invoice-header" style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
            borderRadius: '16px 16px 0 0',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative Elements */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '120px',
              height: '120px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '50%'
            }}></div>
            
            <div style={{position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div className="company-info">
                <h1 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                  TRUNG TÂM ANH NGỮ ABC
                </h1>
                <div style={{fontSize: '14px', opacity: '0.9', lineHeight: '1.6'}}>
                  <p style={{margin: '4px 0', display: 'flex', alignItems: 'center'}}>
                    <span style={{marginRight: '8px'}}>📍</span> 123 Đường ABC, Quận 1, TP.HCM
                  </p>
                  <p style={{margin: '4px 0', display: 'flex', alignItems: 'center'}}>
                    <span style={{marginRight: '8px'}}>📞</span> (028) 3xxx xxxx
                  </p>
                  <p style={{margin: '4px 0', display: 'flex', alignItems: 'center'}}>
                    <span style={{marginRight: '8px'}}>✉️</span> info@englishcenter.com
                  </p>
                  <p style={{margin: '4px 0', display: 'flex', alignItems: 'center'}}>
                    <span style={{marginRight: '8px'}}>🏢</span> MST: 0123456789
                  </p>
                </div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'right',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{fontSize: '12px', fontWeight: '500', opacity: '0.8', marginBottom: '8px'}}>BIÊN LAI</div>
                <div style={{fontSize: '20px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                  #{invoice.invoiceNumber}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Invoice Title */}
          <div className="invoice-title" style={{
            background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%)',
            border: '2px solid #14b8a6',
            borderRadius: '12px',
            padding: '16px',
            margin: '24px 0',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#0d9488',
            textShadow: '0 2px 4px rgba(13,148,136,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '-20px',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(45deg, #14b8a6, #0d9488)',
              borderRadius: '50%',
              opacity: '0.1'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '-20px',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(45deg, #14b8a6, #0d9488)',
              borderRadius: '50%',
              opacity: '0.1'
            }}></div>
            <span style={{position: 'relative', zIndex: 1}}>BIÊN LAI THANH TOÁN HỌC PHÍ</span>
          </div>

          {/* Enhanced Invoice Content */}
          <div className="invoice-content">
            {/* Enhanced Information Grid */}
            <div className="info-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {/* Enhanced Customer Info */}
              <div className="invoice-section" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                {/* Decorative icon */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: '0.1'
                }}>
                  <span style={{fontSize: '18px'}}>👤</span>
                </div>
                
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#0d9488',
                  marginBottom: '16px',
                  borderBottom: '2px solid #14b8a6',
                  paddingBottom: '8px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{marginRight: '8px'}}>👤</span>
                  Thông tin học viên
                </h3>
                <div className="info-item" style={{display: 'flex', marginBottom: '12px', alignItems: 'center'}}>
                  <span className="info-label" style={{fontWeight: 'bold', color: '#475569', minWidth: '80px'}}>Họ tên:</span>
                  <span className="info-value" style={{color: '#1e293b', fontWeight: '600'}}>{invoice.studentName}</span>
                </div>
                <div className="info-item" style={{display: 'flex', marginBottom: '12px', alignItems: 'center'}}>
                  <span className="info-label" style={{fontWeight: 'bold', color: '#475569', minWidth: '80px'}}>Mã HV:</span>
                  <span className="info-value" style={{color: '#1e293b', fontWeight: '600'}}>{invoice.studentCode}</span>
                </div>
                <div className="info-item" style={{display: 'flex', marginBottom: '12px', alignItems: 'center'}}>
                  <span className="info-label" style={{fontWeight: 'bold', color: '#475569', minWidth: '80px'}}>Khóa học:</span>
                  <span className="info-value" style={{color: '#1e293b', fontWeight: '600'}}>{invoice.courseName}</span>
                </div>
              </div>

              {/* Enhanced Payment Info */}
              <div className="invoice-section" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                {/* Decorative icon */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: '0.1'
                }}>
                  <span style={{fontSize: '18px'}}>💳</span>
                </div>
                
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#0d9488',
                  marginBottom: '16px',
                  borderBottom: '2px solid #14b8a6',
                  paddingBottom: '8px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{marginRight: '8px'}}>💳</span>
                  Thông tin thanh toán
                </h3>
                <div className="info-item" style={{display: 'flex', marginBottom: '12px', alignItems: 'center'}}>
                  <span className="info-label" style={{fontWeight: 'bold', color: '#475569', minWidth: '100px'}}>Ngày TT:</span>
                  <span className="info-value" style={{color: '#1e293b', fontWeight: '600'}}>{formatDate(invoice.paymentDate)}</span>
                </div>
                <div className="info-item" style={{display: 'flex', marginBottom: '12px', alignItems: 'center'}}>
                  <span className="info-label" style={{fontWeight: 'bold', color: '#475569', minWidth: '100px'}}>Phương thức:</span>
                  <span className="info-value" style={{color: '#1e293b', fontWeight: '600'}}>{paymentMethodLabels[invoice.paymentMethod]}</span>
                </div>
                <div className="info-item" style={{display: 'flex', marginBottom: '12px', alignItems: 'center'}}>
                  <span className="info-label" style={{fontWeight: 'bold', color: '#475569', minWidth: '100px'}}>Trạng thái:</span>
                  <span className="info-value" style={{
                    color: '#059669', 
                    fontWeight: 'bold',
                    background: '#ecfdf5',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    border: '1px solid #a7f3d0'
                  }}>
                    ✅ Đã thanh toán
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Payment Details Table */}
            <div className="payment-table" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative background */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '150px',
                height: '150px',
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                borderRadius: '50%',
                opacity: '0.03'
              }}></div>
              
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#0d9488',
                marginBottom: '20px',
                borderBottom: '3px solid #14b8a6',
                paddingBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1
              }}>
                <span style={{marginRight: '10px'}}>📊</span>
                Chi tiết thanh toán
              </h3>
              
              <div style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                position: 'relative',
                zIndex: 1
              }}>
                <table className="invoice-table" style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{
                      background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%)',
                      borderBottom: '2px solid #14b8a6'
                    }}>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        color: '#0d9488',
                        fontSize: '14px',
                        borderRight: '1px solid #e2e8f0'
                      }}>
                        📝 Nội dung
                      </th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: '#0d9488',
                        fontSize: '14px',
                        width: '150px'
                      }}>
                        💰 Số tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{borderBottom: '1px solid #f1f5f9'}}>
                      <td style={{padding: '20px', borderRight: '1px solid #f1f5f9'}}>
                        <div style={{
                          fontSize: '15px',
                          fontWeight: 'bold',
                          color: '#1e293b',
                          marginBottom: '8px'
                        }}>
                          🎓 Học phí khóa học: {invoice.courseName}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#64748b',
                          fontStyle: 'italic',
                          background: '#f8fafc',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          {invoice.description}
                        </div>
                      </td>
                      <td style={{
                        padding: '20px',
                        textAlign: 'right',
                        background: 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)'
                      }}>
                        <span style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#0d9488',
                          textShadow: '0 2px 4px rgba(13,148,136,0.1)'
                        }}>
                          {formatCurrency(invoice.amount)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Enhanced Total Amount */}
            <div className="total-section" style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 15px -3px rgba(13, 148, 136, 0.3)'
            }}>
              {/* Decorative elements */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '120px',
                height: '120px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                width: '80px',
                height: '80px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '50%'
              }}></div>
              
              <div style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '16px',
                position: 'relative',
                zIndex: 1
              }}>
                <span style={{
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{marginRight: '10px'}}>💰</span>
                  Tổng số tiền đã thanh toán:
                </span>
                <span className="total-amount" style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}>
                  {formatCurrency(invoice.amount)}
                </span>
              </div>
              <div style={{
                borderTop: '2px solid rgba(255,255,255,0.3)', 
                paddingTop: '16px',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  fontSize: '14px',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backdropFilter: 'blur(5px)'
                }}>
                  <span style={{fontWeight: 'bold', marginRight: '8px'}}>📝 Bằng chữ:</span>
                  <span style={{fontStyle: 'italic'}}>
                    {convertNumberToWords(invoice.amount)} đồng
                  </span>
                </div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="signature-section">
              <div style={{textAlign: 'center'}}>
                <div className="signature-title">Người nộp tiền</div>
                <div className="signature-note">(Ký và ghi rõ họ tên)</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div className="signature-title">Người thu tiền</div>
                <div className="signature-note">(Ký và ghi rõ họ tên)</div>
              </div>
            </div>

            {/* Enhanced Footer */}
            <div className="footer" style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              border: '2px solid #14b8a6',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              marginTop: '24px'
            }}>
              {/* Decorative pattern */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(20,184,166,0.05) 0%, transparent 70%)',
                borderRadius: '50%'
              }}></div>
              
              <div className="footer-title" style={{
                color: '#0d9488',
                fontWeight: 'bold',
                fontSize: '18px',
                marginBottom: '16px',
                position: 'relative',
                zIndex: 1,
                textShadow: '0 2px 4px rgba(13,148,136,0.1)'
              }}>
                <span style={{fontSize: '24px', marginRight: '8px'}}>🙏</span>
                Cảm ơn bạn đã tin tưởng và lựa chọn Trung tâm Anh ngữ ABC!
              </div>
              
              <div className="footer-info" style={{
                color: '#475569',
                fontSize: '14px',
                lineHeight: '1.6',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  background: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '12px',
                  display: 'inline-block'
                }}>
                  <span style={{fontWeight: 'bold', color: '#0d9488', marginRight: '8px'}}>📞</span>
                  Mọi thắc mắc xin liên hệ: 
                  <span style={{fontWeight: 'bold', color: '#1e293b'}}> (028) 3xxx xxxx</span>
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#64748b',
                  fontStyle: 'italic',
                  background: 'rgba(13,148,136,0.1)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px dashed #14b8a6'
                }}>
                  ℹ️ Biên lai này là bằng chứng thanh toán. Vui lòng lưu giữ để đối chiếu khi cần thiết.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Modal Footer */}
        <div className="no-print" style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          borderTop: '1px solid #e2e8f0',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          borderRadius: '0 0 24px 24px'
        }}>
          <button
            onClick={handlePrint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(13, 148, 136, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(13, 148, 136, 0.3)';
            }}
          >
            <svg style={{width: '18px', height: '18px', marginRight: '8px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            In biên lai
          </button>
          
          <button
            onClick={handleDownloadPDF}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 24px',
              background: 'white',
              color: '#475569',
              fontWeight: 'bold',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              cursor: 'pointer',
              fontSize: '14px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = '#14b8a6';
              e.target.style.color = '#0d9488';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.color = '#475569';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <svg style={{width: '18px', height: '18px', marginRight: '8px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Tải PDF
          </button>
          
          <button
            onClick={onClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 24px',
              background: 'white',
              color: '#ef4444',
              fontWeight: 'bold',
              borderRadius: '12px',
              border: '2px solid #fecaca',
              cursor: 'pointer',
              fontSize: '14px',
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#ef4444';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#ef4444';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 6px rgba(239, 68, 68, 0.1)';
            }}
          >
            <svg style={{width: '18px', height: '18px', marginRight: '8px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Đóng
          </button>
        </div>
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