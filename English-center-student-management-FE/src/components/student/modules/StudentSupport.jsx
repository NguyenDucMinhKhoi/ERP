import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle, HelpCircle, Bell, User } from 'lucide-react';

export default function StudentSupport() {
  const [activeTab, setActiveTab] = useState('notifications'); // notifications, support, feedback
  const [notifications, setNotifications] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: ''
  });
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with real API call
    const mockNotifications = [
      {
        id: 1,
        title: 'Schedule changed',
        message: 'English Grammar Advanced on 15/01 moved from 14:00-16:00 to 15:00-17:00',
        type: 'schedule_change',
        date: '2024-01-12T10:30:00Z',
        read: false
      },
      {
        id: 2,
        title: 'Tuition payment',
        message: 'January 2024 tuition is due. Please pay before 15/01',
        type: 'payment',
        date: '2024-01-10T09:00:00Z',
        read: true
      },
      {
        id: 3,
        title: 'Welcome new student',
        message: 'Welcome to English Center! We wish you a great learning journey.',
        type: 'welcome',
        date: '2024-01-08T14:00:00Z',
        read: true
      }
    ];

    const mockSupportTickets = [
      {
        id: 1,
        subject: 'Cannot access course materials',
        category: 'technical',
        priority: 'high',
        status: 'open',
        message: 'I cannot download the Present Perfect lesson materials. Could you check it for me?',
        response: null,
        createdAt: '2024-01-12T15:30:00Z',
        updatedAt: '2024-01-12T15:30:00Z'
      },
      {
        id: 2,
        subject: 'Schedule change request',
        category: 'schedule',
        priority: 'medium',
        status: 'resolved',
        message: 'I want to move from Mon/Wed/Fri class to Tue/Thu/Sat. Is it possible?',
        response: 'We reviewed your request. Tue/Thu/Sat class is full now. We will notify you when a seat is available.',
        createdAt: '2024-01-10T10:15:00Z',
        updatedAt: '2024-01-11T14:20:00Z'
      },
      {
        id: 3,
        subject: 'Feedback about teacher',
        category: 'feedback',
        priority: 'low',
        status: 'open',
        message: 'Ms. Sarah teaches very well and enthusiastically. I am very pleased with her teaching method.',
        response: null,
        createdAt: '2024-01-08T16:45:00Z',
        updatedAt: '2024-01-08T16:45:00Z'
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setSupportTickets(mockSupportTickets);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'schedule_change': return <Clock className="h-5 w-5 text-blue-600" />;
      case 'payment': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'welcome': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Open';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return 'Unknown';
    }
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    // Handle ticket submission
    console.log('New ticket:', newTicket);
    setShowNewTicket(false);
    setNewTicket({
      subject: '',
      category: 'general',
      priority: 'medium',
      message: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interactions & Support</h1>
          <p className="text-gray-600">Receive notifications and send questions, feedback</p>
        </div>
        <button
          onClick={() => setShowNewTicket(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Gửi yêu cầu hỗ trợ
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Notifications ({notifications.filter(n => !n.read).length})
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'support'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Support requests ({supportTickets.filter(t => t.status === 'open').length})
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'feedback'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Feedback
          </button>
        </nav>
      </div>

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-medium ${
                      notification.read ? 'text-gray-900' : 'text-blue-900'
                    }`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                  </div>
                  <p className={`mt-1 text-sm ${
                    notification.read ? 'text-gray-600' : 'text-blue-700'
                  }`}>
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    {formatDate(notification.date)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Support Tab */}
      {activeTab === 'support' && (
        <div className="space-y-4">
          {supportTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{ticket.subject}</h3>
                  <p className="text-sm text-gray-600 mt-1">{ticket.message}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                  </span>
                </div>
              </div>
              
              {ticket.response && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <User className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Center response</span>
                  </div>
                  <p className="text-sm text-gray-700">{ticket.response}</p>
                </div>
              )}
              
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>Created: {formatDate(ticket.createdAt)}</span>
                {ticket.updatedAt !== ticket.createdAt && (
                  <span>Updated: {formatDate(ticket.updatedAt)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Send feedback</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter feedback subject..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback type
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Teacher feedback</option>
                <option>Curriculum feedback</option>
                <option>Facilities feedback</option>
                <option>Other feedback</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback content
              </label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your feedback..."
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit feedback
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Submit a support request</h3>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter support request subject..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General</option>
                      <option value="technical">Technical</option>
                      <option value="schedule">Schedule</option>
                      <option value="payment">Payment</option>
                      <option value="course">Course</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request details
                  </label>
                  <textarea
                    rows={4}
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your support request in detail..."
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewTicket(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
