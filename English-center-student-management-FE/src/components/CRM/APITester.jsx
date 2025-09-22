import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  Database,
  Users,
  MessageSquare,
  Bell
} from 'lucide-react';
import crmService from '../../services/crmService';

export default function APITester() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testCases = [
    {
      id: 'connection',
      name: 'Test Connection',
      description: 'Kiểm tra kết nối API',
      icon: Database,
      test: () => crmService.testConnection()
    },
    {
      id: 'students',
      name: 'Get Students',
      description: 'Lấy danh sách học viên',
      icon: Users,
      test: () => crmService.getStudents({ page: 1, page_size: 10 })
    },
    {
      id: 'student_stats',
      name: 'Student Stats',
      description: 'Thống kê học viên',
      icon: Users,
      test: () => crmService.getStudentStats()
    },
    {
      id: 'care_logs',
      name: 'Get Care Logs',
      description: 'Lấy danh sách chăm sóc',
      icon: MessageSquare,
      test: () => crmService.getCareLogs({ page: 1, page_size: 10 })
    },
    {
      id: 'care_stats',
      name: 'Care Stats',
      description: 'Thống kê chăm sóc',
      icon: MessageSquare,
      test: () => crmService.getCareLogStats()
    },
    {
      id: 'notifications',
      name: 'Get Notifications',
      description: 'Lấy danh sách thông báo',
      icon: Bell,
      test: () => crmService.getNotifications({ page: 1, page_size: 10 })
    },
    {
      id: 'conversion_funnel',
      name: 'Conversion Funnel',
      description: 'Phễu chuyển đổi',
      icon: Database,
      test: () => crmService.getConversionFunnel()
    },
    {
      id: 'churn_rate',
      name: 'Churn Rate',
      description: 'Tỷ lệ rời bỏ',
      icon: Database,
      test: () => crmService.getChurnRate()
    }
  ];

  const runTest = async (testCase) => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      const result = await testCase.test();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      setTestResults(prev => ({
        ...prev,
        [testCase.id]: {
          status: 'success',
          duration,
          result: result,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      setTestResults(prev => ({
        ...prev,
        [testCase.id]: {
          status: 'error',
          duration,
          error: error.message,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults({});
    
    for (const testCase of testCases) {
      await runTest(testCase);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-error" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'border-success bg-success-50';
      case 'error':
        return 'border-error bg-error-50';
      default:
        return 'border-slate-200 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">API Tester</h2>
          <p className="text-slate-600 mt-1">Kiểm tra các endpoint CRM API</p>
        </div>
        <button
          onClick={runAllTests}
          disabled={loading}
          className="btn btn-primary flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          {loading ? 'Đang test...' : 'Test Tất Cả'}
        </button>
      </div>

      {/* Test Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testCases.map((testCase) => {
          const Icon = testCase.icon;
          const result = testResults[testCase.id];
          
          return (
            <div
              key={testCase.id}
              className={`card p-4 border-2 ${result ? getStatusColor(result.status) : 'border-slate-200'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-slate-400 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800">{testCase.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{testCase.description}</p>
                    
                    {result && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          <span className="text-sm font-medium">
                            {result.status === 'success' ? 'Thành công' : 'Lỗi'}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({result.duration}ms)
                          </span>
                        </div>
                        
                        {result.status === 'error' && (
                          <div className="text-xs text-error bg-error-100 p-2 rounded">
                            {result.error}
                          </div>
                        )}
                        
                        {result.status === 'success' && result.result && (
                          <div className="text-xs text-slate-600 bg-slate-100 p-2 rounded">
                            <strong>Response:</strong> {JSON.stringify(result.result).substring(0, 100)}...
                          </div>
                        )}
                        
                        <div className="text-xs text-slate-500">
                          {result.timestamp}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => runTest(testCase)}
                  disabled={loading}
                  className="btn btn-sm btn-outline"
                >
                  <Play className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {Object.keys(testResults).length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Tóm Tắt Kết Quả</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-800">
                {Object.keys(testResults).length}
              </div>
              <div className="text-sm text-slate-600">Tổng số test</div>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <div className="text-2xl font-bold text-success">
                {Object.values(testResults).filter(r => r.status === 'success').length}
              </div>
              <div className="text-sm text-slate-600">Thành công</div>
            </div>
            <div className="text-center p-4 bg-error-50 rounded-lg">
              <div className="text-2xl font-bold text-error">
                {Object.values(testResults).filter(r => r.status === 'error').length}
              </div>
              <div className="text-sm text-slate-600">Lỗi</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
