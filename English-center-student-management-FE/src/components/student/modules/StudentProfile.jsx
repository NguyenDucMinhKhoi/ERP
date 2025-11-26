import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Lock, Eye, EyeOff, Upload } from 'lucide-react';
import { ProfileForm } from '../index';

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('ecsm_access_token') || sessionStorage.getItem('ecsm_access_token');
        const API_BASE_URL = import.meta.env.VITE_API_URL;

        // Fetch profile from real API
        const response = await fetch(`${API_BASE_URL}/hocviens/me/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        
        // Transform API data to component format
        setProfile({
          id: data.id,
          fullName: data.ten || '',
          email: data.email || '',
          phone: data.sdt || '',
          address: data.address || '',
          dateOfBirth: data.ngay_sinh || '',
          gender: 'male',
          studentId: data.id,
          joinDate: data.created_at?.split('T')[0] || '',
          level: 'Intermediate',
          courses: [],
          avatar: null
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (profileData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('ecsm_access_token') || sessionStorage.getItem('ecsm_access_token');
      const API_BASE_URL = import.meta.env.VITE_API_URL;

      // Update profile via API
      const response = await fetch(`${API_BASE_URL}/hocviens/${profile.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ten: profileData.fullName,
          email: profileData.email,
          sdt: profileData.phone,
          address: profileData.address,
          ngay_sinh: profileData.dateOfBirth
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setProfile(prev => ({ ...prev, ...profileData }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Không thể cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleToggleEdit = () => {
    setIsEditing(true);
  };

  function QuickStats() {
    if (!profile) return null;
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Courses in progress:</span>
            <span className="text-sm font-medium text-gray-900">{profile.courses?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Completed lessons:</span>
            <span className="text-sm font-medium text-gray-900">-</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total hours:</span>
            <span className="text-sm font-medium text-gray-900">-</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Attendance:</span>
            <span className="text-sm font-medium text-green-600">-</span>
          </div>
        </div>
      </div>
    );
  }

  function CurrentCourses() {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current courses</h3>
        <div className="space-y-3">
          {profile.courses.map((course, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{course}</p>
              <p className="text-xs text-gray-600">In progress</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function SecurityTips() {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security tips</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Use a strong password</p>
          <p>• Do not share login information</p>
          <p>• Log out after use</p>
          <p>• Update information regularly</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không thể tải thông tin cá nhân</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personal Account Management</h1>
          <p className="text-gray-600">Manage personal information and account security</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <ProfileForm
            profile={profile}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
            loading={loading}
            isEditing={isEditing}
            onToggleEdit={handleToggleEdit}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <QuickStats />
          <CurrentCourses />
          <SecurityTips />
        </div>
      </div>
    </div>
  );
}
