import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Lock, Eye, EyeOff, Upload } from 'lucide-react';
import { ProfileForm } from '../index';

export default function StudentProfile() {
  const [profile, setProfile] = useState({
    id: 1,
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    phone: '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    dateOfBirth: '1995-05-15',
    gender: 'male',
    studentId: 'HV001234',
    joinDate: '2023-09-01',
    level: 'Intermediate',
    courses: ['English Grammar Advanced', 'Speaking Practice'],
    avatar: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async (profileData) => {
    setLoading(true);
    try {
      // API call to save profile info
      console.log('Saving profile:', profileData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(prev => ({ ...prev, ...profileData }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
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
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Courses in progress:</span>
            <span className="text-sm font-medium text-gray-900">2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Completed lessons:</span>
            <span className="text-sm font-medium text-gray-900">15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total hours:</span>
            <span className="text-sm font-medium text-gray-900">45h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Attendance:</span>
            <span className="text-sm font-medium text-green-600">95%</span>
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
